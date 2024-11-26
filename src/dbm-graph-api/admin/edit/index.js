import DbmGraphApi from "../../../../index.js";
export {default as EditBaseObject} from "./EditBaseObject.js";

export {default as SetField} from "./SetField.js";
export {default as SetUrl} from "./SetUrl.js";
export {default as AddIncomingRelation} from "./AddIncomingRelation.js";
export {default as AddOutgoingRelation} from "./AddOutgoingRelation.js";

let fullSetup = function() {
    let prefix = "graphApi/admin/edit/";
    {
        let name = "setField";
        let currentSelect = new DbmGraphApi.admin.edit.SetField();
        currentSelect.item.register(prefix + name);
    }

    {
        let name = "setUrl";
        let currentSelect = new DbmGraphApi.admin.edit.SetUrl();
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
}

export {fullSetup};