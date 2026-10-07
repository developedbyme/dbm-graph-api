export {default as Order} from "./Order.js";
export {default as LineItems} from "./LineItems.js";

import DbmGraphApi from "../../../../../../index.js";

export const fullSetup = function() {
    DbmGraphApi.registerEncoding("order", new DbmGraphApi.range.encode.ecommerce.order.Order());
    DbmGraphApi.registerEncoding("order_lineItems", new DbmGraphApi.range.encode.ecommerce.order.LineItems());
    DbmGraphApi.registerEncoding("order_contactDetails", DbmGraphApi.range.encode.SingleRelation.create("contactDetails", "in:for:contactDetails", "contactDetails"));
}