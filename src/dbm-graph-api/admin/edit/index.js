import DbmGraphApi from "../../../../index.js";
export {default as EditBaseObject} from "./EditBaseObject.js";

export {default as SetField} from "./SetField.js";
export {default as SetIdentifier} from "./SetIdentifier.js";
export {default as SetUrl} from "./SetUrl.js";
export {default as SetVisibility} from "./SetVisibility.js";
export {default as AddIncomingRelation} from "./AddIncomingRelation.js";
export {default as AddOutgoingRelation} from "./AddOutgoingRelation.js";
export {default as ClearCloudflareCache} from "./ClearCloudflareCache.js";
export {default as ReplaceIncomingRelation} from "./ReplaceIncomingRelation.js";
export {default as ReplaceOutgoingRelation} from "./ReplaceOutgoingRelation.js";
export {default as ReplaceMultipleIncomingRelations} from "./ReplaceMultipleIncomingRelations.js";
export {default as ReplaceMultipleOutgoingRelations} from "./ReplaceMultipleOutgoingRelations.js";
export {default as AddObjectType} from "./AddObjectType.js";
export {default as RemoveObjectType} from "./RemoveObjectType.js";
export {default as AddAction} from "./AddAction.js";


export const fullSetup = function() {
    let prefix = "graphApi/admin/edit/";
    {
        let name = "setField";
        let currentSelect = new DbmGraphApi.admin.edit.SetField();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "setIdentifier";
        let currentSelect = new DbmGraphApi.admin.edit.SetIdentifier();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "setUrl";
        let currentSelect = new DbmGraphApi.admin.edit.SetUrl();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "setVisibility";
        let currentSelect = new DbmGraphApi.admin.edit.SetVisibility();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "addIncomingRelation";
        let currentSelect = new DbmGraphApi.admin.edit.AddIncomingRelation();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "addOutgoingRelation";
        let currentSelect = new DbmGraphApi.admin.edit.AddOutgoingRelation();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "replaceIncomingRelation";
        let currentSelect = new DbmGraphApi.admin.edit.ReplaceIncomingRelation();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "replaceOutgoingRelation";
        let currentSelect = new DbmGraphApi.admin.edit.ReplaceOutgoingRelation();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "replaceMultipleIncomingRelations";
        let currentSelect = new DbmGraphApi.admin.edit.ReplaceMultipleIncomingRelations();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "replaceMultipleOutgoingRelations";
        let currentSelect = new DbmGraphApi.admin.edit.ReplaceMultipleOutgoingRelations();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "clearCache";
        let currentSelect = new DbmGraphApi.admin.edit.ClearCloudflareCache();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "addObjectType";
        let currentSelect = new DbmGraphApi.admin.edit.AddObjectType();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "removeObjectType";
        let currentSelect = new DbmGraphApi.admin.edit.RemoveObjectType();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "addAction";
        let currentSelect = new DbmGraphApi.admin.edit.AddAction();
        currentSelect.item.register(prefix + name);
    }
}