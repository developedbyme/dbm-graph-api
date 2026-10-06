export {default as CreatePaymentIntent} from "./CreatePaymentIntent.js";

import DbmGraphApi from "../../../../../index.js";

export const fullSetup = function() {
    DbmGraphApi.registerActionFunction("stripe/createPaymentIntent", new DbmGraphApi.action.ecommerce.stripe.CreatePaymentIntent());
}