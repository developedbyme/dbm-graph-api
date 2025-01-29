import Dbm from "dbm";

export default class Query extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._joins = [];
        this._whereStatements = [];
        this._includeOnly = null;
        this._visibilities = ["public"];
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

        //METODO: include visibility

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
}