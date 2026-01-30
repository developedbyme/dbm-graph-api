import Dbm from "dbm";

export default class SelectBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    requireParameters(aData, ...aRequiredParameters) {
        let isOk = true;
        let missingParameters = [];

        let currentArray = aRequiredParameters;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentParameterName = currentArray[i];
            if(!aData[currentParameterName]) {
                isOk = false;
                missingParameters.push(currentParameterName);
            }
        }

        if(!isOk) {
            throw("Missing parameters: " + missingParameters.join(", "));
        }
    }

    async select(aQuery, aData, aRequest) {

    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}