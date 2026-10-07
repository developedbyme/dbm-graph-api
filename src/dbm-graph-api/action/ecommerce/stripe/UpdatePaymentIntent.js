import Dbm from "dbm";
import crypto from "crypto";

export default class UpdatePaymentIntent extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.node.getDatabase();

        let stripeSettings = Dbm.repository.getItem("stripe");

        let stripePaymentAttempt = database.getObject(1*aData["id"]);
        let storedKey = await stripePaymentAttempt.getIdentifier();

        if(storedKey !== aData["key"]) {
            //METODO: should this throw?
            return returnObject;
        }

        let currentStatus = await stripePaymentAttempt.getSingleLinkedType("type/paymentAttemptStatus");
        if(currentStatus !== "pending") {
            //METODO: should this throw?
            return returnObject;
        }
        
        let cart = aData["cart"];
        await stripePaymentAttempt.updateField("cart", cart);

        let total = 0;

        let currentArray = cart.lineItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentLineItem = currentArray[i];
            let product = database.getObject(currentLineItem.product);
            let price = await product.singleObjectRelationQuery("out:in:priceGroup,in:for/regularPrice:price"); 
            //METODO: check for offers
            await price.loadFields();

            let currentPrice = 1*price.fields["total"];
            total += currentLineItem.quantity*currentPrice;
        }

        let amount = Math.round(100*total);

        let body = {
            "amount": String(amount)
        }

        let encodedBody = new URLSearchParams(body);

        let fields = await stripePaymentAttempt.getFields();
        let updateCount = fields["stripe/updateCount"]+1;
        await stripePaymentAttempt.updateField("stripe/updateCount", updateCount);

        //METODO: move these to logs
        await stripePaymentAttempt.updateField("stripe/updateTime" + updateCount, (new Date()).valueOf());
        await stripePaymentAttempt.updateField("stripe/updateIntentBody" + updateCount, body);

        let key = Dbm.repository.getItem("stripe").secretKey;

        let stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents/" + fields["stripe/id"], {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + key,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodedBody,
        });

        let responseData = await stripeResponse.json();
        await stripePaymentAttempt.updateField("stripe/updateIntentRespone" + updateCount, responseData);

        //METODO: handle error, responseData.error set

        return returnObject;
    }
}