import DbmGraphApi from "../../../../../index.js";

export {default as OrderByKey} from "./OrderByKey.js";

export const PREFIX = "graphApi/range/select/";

export const register = function(aName, aHandler) {
    aHandler.item.register(PREFIX + aName);
}

export const fullSetup = function() {
    register("orderByKey", new DbmGraphApi.range.select.ecommerce.OrderByKey());
}