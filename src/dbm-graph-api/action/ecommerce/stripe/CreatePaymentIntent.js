import Dbm from "dbm";

export default class CreatePaymentIntent extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.node.getDatabase();

        let stripeSettings = Dbm.repository.getItem("stripe");

        let stripePaymentAttempt = await database.createObject("private", ["stripePaymentAttempt"]);
        returnObject["id"] = stripePaymentAttempt.id;
        
        let cart = aData["cart"];
        stripePaymentAttempt.updateField("cart", cart);

        let amount = 49900; // 499.00 SEK

        //"payment_method_types[]": "card",

        let body = {
            amount: String(amount),
            currency: stripeSettings.currency,
            
            "metadata[attempt_id]": stripePaymentAttempt.id,
        }

        let encodedBody = new URLSearchParams(body);

        stripePaymentAttempt.updateField("createIntentBody", body);

        let key = Dbm.repository.getItem("stripe").secretKey;

        let stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + key,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodedBody,
        });

        let responseData = await stripeResponse.json();
        stripePaymentAttempt.updateField("createIntentRespone", responseData);

        //METODO: handle error, responseData.error set

        returnObject["clientSecret"] = responseData.client_secret;

        return returnObject;
    }
}