export {default as CreatePaymentIntent} from "./CreatePaymentIntent.js";
export {default as UpdatePaymentIntent} from "./UpdatePaymentIntent.js";
export {default as VerifyPaymentIntent} from "./VerifyPaymentIntent.js";

import DbmGraphApi from "../../../../../index.js";

export const fullSetup = function() {
    DbmGraphApi.registerActionFunction("stripe/createPaymentIntent", new DbmGraphApi.action.ecommerce.stripe.CreatePaymentIntent());
    DbmGraphApi.registerActionFunction("stripe/updatePaymentIntent", new DbmGraphApi.action.ecommerce.stripe.UpdatePaymentIntent());
    DbmGraphApi.registerActionFunction("stripe/verifyPaymentIntent", new DbmGraphApi.action.ecommerce.stripe.VerifyPaymentIntent());
    DbmGraphApi.registerActionFunction("stripe/updateAttemptDetails", new DbmGraphApi.action.ecommerce.UpdateAttemptDetails());
}