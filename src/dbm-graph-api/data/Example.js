import Dbm from "dbm";

export default class Example extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        returnObject["example"] = "This is an example";

        return returnObject;
    }
}