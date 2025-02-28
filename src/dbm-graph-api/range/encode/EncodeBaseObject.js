import Dbm from "dbm";

export default class EncodeBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async encode(aIds, aEncodingSession) {

        let encodingPromises = [];

        let currentArray = aIds;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentId = currentArray[i];
            encodingPromises.push(this.encodeSingle(currentId, aEncodingSession));
        }

        await Promise.all(encodingPromises);
    }

    async encodeSingle(aId, aEncodingSession) {
        //console.log("EncodeBaseObject::encodeSingle");

        let data = await this.getEncodedData(aId, aEncodingSession);
        aEncodingSession.outputEncodedData(aId, data, this.item.encodingType);       
    }

    async getEncodedData(aId, aRequest) {
        //console.log("EncodeBaseObject::encodeSingle");

        //MENOTE: should be overridden

        return {};
    }

    _dataOrNull(aData) {
        if(aData === undefined) {
            return null;
        }

        return aData;
    }
}