export {default as Product} from "./Product.js";
export {default as RequiredProducts} from "./RequiredProducts.js";
export {default as PriceGroup} from "./PriceGroup.js";

//METODO: add purchase options

import DbmGraphApi from "../../../../../../index.js";

export const fullSetup = function() {
    DbmGraphApi.registerEncoding("product", new DbmGraphApi.range.encode.ecommerce.product.Product());
    DbmGraphApi.registerEncoding("product_requiredProducts", new DbmGraphApi.range.encode.ecommerce.product.RequiredProducts());
    DbmGraphApi.registerEncoding("product_priceGroup", new DbmGraphApi.range.encode.ecommerce.product.PriceGroup());
}