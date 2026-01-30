import DbmGraphApi from "../../../../index.js";

export {default as SelectBaseObject} from "./SelectBaseObject.js";
export {default as IdSelection} from "./IdSelection.js";
export {default as ByObjectType} from "./ByObjectType.js";
export {default as IncludePrivate} from "./IncludePrivate.js";
export {default as IncludeDraft} from "./IncludeDraft.js";
export {default as ObjectRelationQuery} from "./ObjectRelationQuery.js";
export {default as GlobalObjectRelationQuery} from "./GlobalObjectRelationQuery.js";
export {default as WithIdentifier} from "./WithIdentifier.js";
export {default as IdentifiableObjectRelationQuery} from "./IdentifiableObjectRelationQuery.js";

export const PREFIX = "graphApi/range/select/";

export const register = function(aName, aHandler) {
    aHandler.item.register(PREFIX + aName);
}

export const fullSetup = function() {
    register("byObjectType", new DbmGraphApi.range.select.ByObjectType());

    register("idSelection", new DbmGraphApi.range.select.IdSelection());
    register("withIdentifier", new DbmGraphApi.range.select.WithIdentifier());

    register("includePrivate", new DbmGraphApi.range.select.IncludePrivate());
    register("includeDraft", new DbmGraphApi.range.select.IncludeDraft());

    register("objectRelationQuery", new DbmGraphApi.range.select.ObjectRelationQuery());
    register("globalObjectRelationQuery", new DbmGraphApi.range.select.GlobalObjectRelationQuery());
    register("identifiableObjectRelationQuery", new DbmGraphApi.range.select.IdentifiableObjectRelationQuery());
}