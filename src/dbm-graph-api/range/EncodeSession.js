import Dbm from "dbm";

export default class EncodeSession extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._encodings = {};
        this.outputController = null;

        //METODO: add cache of database objects
    }

    _readyToEncode(aId, aType) {
        let encodings = this._encodings[aId];
        if(!encodings) {
            encodings = this._encodings[aId] = {};
        }

        if(encodings[aType]) {
            return false;
        }

        return (encodings[aType] = true);
    }

    _encodeSingleNoAwait(aId, aType) {
        //console.log("_encodeSingleNoAwait");
        
        let shouldEncode = this._readyToEncode(aId, aType);
        //console.log(shouldEncode, aId, aType);
        if(shouldEncode) {
            let encoding = Dbm.getInstance().repository.getItemIfExists("graphApi/range/encode/" + aType);
            if(encoding) {
                return encoding.controller.encodeSingle(aId, this);
            }
        }
    }

    async encodeSingle(aId, aType) {
        //console.log("encodeSingle");

        await this._encodeSingleNoAwait(aId, aType);
    }

    async encodeSingleWithTypes(aId, aTypes) {
        let currentArray = aTypes;
        let currentArrayLength = currentArray.length;
        let promises = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            promises[i] = this._encodeSingleNoAwait(aId, currentArray[i]);
        }

        await Promise.all(promises);
    }

    async encode(aIds, aType) {
        let currentArray = aIds;
        let currentArrayLength = currentArray.length;
        let ids = new Array(currentArrayLength);
        let promises = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            let id = currentArray[i];
            promises[i] = this._encodeSingleNoAwait(id, aType);
        }

        await Promise.all(promises);

        return ids;
    }

    async encodeObjectOrNull(aObject, aType) {
        if(!aObject) {
            return 0;
        }

        await this.encodeSingle(aObject.id, aType);
        return aObject.id;
    }

    async encodeObjects(aObjects, aType) {
        let currentArray = aObjects;
        let currentArrayLength = currentArray.length;
        let ids = new Array(currentArrayLength);
        let promises = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            let object = currentArray[i];
            ids[i] = object.id;
            promises[i] = this._encodeSingleNoAwait(object.id, aType);
        }

        await Promise.all(promises);

        return ids;
    }

    outputEncodedData(aId, aData, aEncoding) {
        //console.log("EncodeSession::outputEncodedData");

        this.outputController.outputEncodedData(aId, aData, aEncoding);
    }
}