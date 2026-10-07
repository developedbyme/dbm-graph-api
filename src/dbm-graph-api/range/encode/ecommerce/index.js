export {default as PriceGroup} from "./PriceGroup.js";
export {default as Price} from "./Price.js";
export {default as TaxGroup} from "./TaxGroup.js";
export {default as RecurringOfferGroup} from "./RecurringOfferGroup.js";
export {default as RecurringOffer} from "./RecurringOffer.js";
export {default as ContactDetails} from "./ContactDetails.js";

export * as product from "./product/index.js";
export * as order from "./order/index.js";
export * as lineitem from "./lineitem/index.js";

import DbmGraphApi from "../../../../../index.js";

export const fullSetup = function() {
    DbmGraphApi.range.encode.ecommerce.product.fullSetup();
    DbmGraphApi.range.encode.ecommerce.order.fullSetup();
    DbmGraphApi.range.encode.ecommerce.lineitem.fullSetup();

    DbmGraphApi.registerEncoding("priceGroup", new DbmGraphApi.range.encode.ecommerce.PriceGroup());
    DbmGraphApi.registerEncoding("price", new DbmGraphApi.range.encode.ecommerce.Price());
    DbmGraphApi.registerEncoding("taxGroup", new DbmGraphApi.range.encode.ecommerce.TaxGroup());
    DbmGraphApi.registerEncoding("recurringOfferGroup", new DbmGraphApi.range.encode.ecommerce.RecurringOfferGroup());
    DbmGraphApi.registerEncoding("recurringOffer", new DbmGraphApi.range.encode.ecommerce.RecurringOffer());

    DbmGraphApi.registerEncoding("contactDetails", new DbmGraphApi.range.encode.ecommerce.ContactDetails());
}