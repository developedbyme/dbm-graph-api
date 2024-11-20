import Dbm from "dbm";

export default class Query extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._includeOnly = null;
        this._visibilities = ["public"];
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
    }

    async getIds() {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        
        let query = "SELECT Objects.id as id FROM Objects";
        
        let whereStatements = [];
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
}