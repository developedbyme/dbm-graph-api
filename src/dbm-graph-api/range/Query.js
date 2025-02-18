import Dbm from "dbm";

export default class Query extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._joins = [];
        this._whereStatements = [];
        this._includeOnly = null;
        this._visibilities = ["public"];
        this._skipVisibility = false;
    }

    async setObjectType(aName) {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let objectType = await database.getObjectType(aName);

        this._joins.push("INNER JOIN ObjectTypesLink ON Objects.id = ObjectTypesLink.id");
        this._whereStatements.push("ObjectTypesLink.type = " + objectType);

        return this;
    }

    includeOnly(aIds) {
        if(!this._includeOnly) {
            this._includeOnly = aIds;
        }
        else {
            this._includeOnly = this._includeOnly.filter(value => aIds.includes(value));
        }

        return this;
    }

    includeNone() {
        this._includeOnly = [];

        return this;
    }

    includePrivate() {
        this._visibilities.push("private");

        return this;
    }

    includeDraft() {
        this._visibilities.push("draft");

        return this;
    }

    includeAnyStatus() {
        this._skipVisibility = true;

        return this;
    }

    addFieldQuery(aKey, aValue) {

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        this._joins.push("INNER JOIN Fields ON Objects.id = Fields.object");
        this._whereStatements.push("Fields.name = " + database.connection.escape(aKey));
        this._whereStatements.push("Fields.value = " + database.connection.escape(JSON.stringify(aValue)));

        return this;
    }

    withIdentifier(aIdentifier) {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        this._joins.push("INNER JOIN Identifiers ON Objects.id = Identifiers.object");
        this._whereStatements.push("Identifiers.identifier = " + database.connection.escape(aIdentifier));

        return this;
    }

    async getIds() {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        
        let query = "SELECT Objects.id as id FROM Objects";

        if(this._joins.length) {
            query += " " + this._joins.join(" ");
        }
        
        let whereStatements = [].concat(this._whereStatements);
        if(this._includeOnly !== null) {
            if(this._includeOnly.length === 0) {
                return [];
            }
            whereStatements.push("Objects.id IN (" + this._includeOnly.join(",") + ")");
        }

        if(!this._skipVisibility) {
            let visibilityIds = [];
            let currentArray = this._visibilities;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentId = await database.getVisibilityType(currentArray[i]);
                visibilityIds.push(currentId);
            }

            whereStatements.push("Objects.visibility IN (" + visibilityIds.join(",") + ")");
        }

        if(whereStatements.length) {
            query += " WHERE " + whereStatements.join(" AND ");
        }

        let result = await database.connection.query(query);
        let currentArray = result[0];
        let currentArrayLength = currentArray.length;
        let returnArray = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            returnArray[i] = currentArray[i]["id"];
        }


        return returnArray;
    }

    async getObjects() {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let ids = await this.getIds();

        return database.getObjects(ids);
    }

    async getObject() {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let ids = await this.getIds();

        if(ids.length) {
            //METODO: warning if more than 1
            return database.getObject(ids[0]);
        }

        return null;
    }
}