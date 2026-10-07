import Dbm from "dbm";
import crypto from "crypto";

export default class VerifyPaymentIntent extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.node.getDatabase();

        let stripeSettings = Dbm.repository.getItem("stripe");

        let stripePaymentAttempt = database.getObject(1*aData["id"]);
        let storedKey = await stripePaymentAttempt.getIdentifier();

        console.log(aData);

        if(storedKey !== aData["key"]) {
            //METODO: should this throw?
            return returnObject;
        }

        let currentStatus = await stripePaymentAttempt.getSingleLinkedType("type/paymentAttemptStatus");

        //MEDEBUG: //
        if(currentStatus === "completed" || currentStatus === "creatingOrder") {
            returnObject["order"] = await aEncodeSession.encodeObjectOrNull(await stripePaymentAttempt.singleObjectRelationQuery("in:from:order"), "order");
            returnObject["status"] = currentStatus;
            return returnObject;
        }

        let fields = await stripePaymentAttempt.getFields();

        let key = Dbm.repository.getItem("stripe").secretKey;

        let stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents/" + fields["stripe/id"], {
            headers: {
                "Authorization": "Bearer " + key
            }
        });

        let responseData = await stripeResponse.json();
        await stripePaymentAttempt.updateField("stripe/verifyIntentBody", responseData);

        if(responseData.status) {
            await stripePaymentAttempt.changeLinkedType("type/paymentAttemptStatus", "creatingOrder");

            let order = await database.createObject("private", ["order"]);

            await order.changeLinkedType("type/orderStatus", "creating");

            await order.outgoingRelations.add(stripePaymentAttempt, "from");

            let orderContactDetails = await database.createObject("private", ["contactDetails", "contactDetails/order"]);
            await orderContactDetails.outgoingRelations.add(order, "for");

            let name = Dbm.objectPath(fields, "details.name");

            await orderContactDetails.updateFieldIfSet("name", name);
            await orderContactDetails.updateFieldIfSet("phoneNumber", Dbm.objectPath(fields, "details.phoneNumber"));
            await orderContactDetails.updateFieldIfSet("email", Dbm.objectPath(fields, "details.email"));
            await orderContactDetails.updateFieldIfSet("address", Dbm.objectPath(fields, "details.address"));

            let cart = fields["cart"];

            await order.updateFieldIfSet("cartMeta", cart["meta"]);

            let currentArray = cart.lineItems;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentLineItemData = currentArray[i];

                if(currentLineItemData.type === "product") {
                    let product = database.getObject(currentLineItemData.product);

                    let lineItem = await database.createObject("private", ["lineItem"]);
                    await lineItem.outgoingRelations.add(order, "in");

                    await lineItem.changeLinkedType("type/lineItemType", currentLineItemData.type);
                    await lineItem.updateFieldIfSet("cartMeta", currentLineItemData["meta"]);

                    await lineItem.incomingRelations.add(product, "for");

                    await lineItem.updateField("quantity", currentLineItemData.quantity);

                    let price = await product.singleObjectRelationQuery("out:in:priceGroup,in:for/regularPrice:price"); 
                    //METODO: check for offers
                    await price.loadFields();

                    let currentPrice = 1*price.fields["total"];
                    await lineItem.updateField("unitPrice", currentPrice);
                }
            }
            
            let mode = await stripePaymentAttempt.getSingleLinkedType("type/paymentAttemptMode");
            await database.addActionToProcess("paymentCompleted/" + mode, stripePaymentAttempt);

            await stripePaymentAttempt.changeLinkedType("type/paymentAttemptStatus", "completed");
        }

        returnObject["order"] = await aEncodeSession.encodeObjectOrNull(await stripePaymentAttempt.singleObjectRelationQuery("in:from:order"), "order");

        currentStatus = await stripePaymentAttempt.getSingleLinkedType("type/paymentAttemptStatus");
        returnObject["status"] = currentStatus;

        return returnObject;
    }
}