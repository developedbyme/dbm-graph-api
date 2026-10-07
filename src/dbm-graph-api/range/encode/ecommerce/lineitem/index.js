export {default as LineItem} from "./LineItem.js";

import DbmGraphApi from "../../../../../../index.js";

export const fullSetup = function() {
    DbmGraphApi.registerEncoding("lineItem", new DbmGraphApi.range.encode.ecommerce.lineitem.LineItem());
    DbmGraphApi.registerEncoding("lineItem_product", DbmGraphApi.range.encode.SingleRelation.create("product", "in:for:product", "product"));
}