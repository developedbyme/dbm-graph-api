import Dbm from "dbm";

export default class Process extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("Process:process2");
        console.log(aAction);

        let database = Dbm.getRepositoryItem("graphDatabase").controller;

        let fields = await aAction.getFields();
        let data = fields["data"];
        console.log(fields);

        let actionGroup = await aAction.singleObjectRelationQuery("out:from:actionGroup");
        console.log(actionGroup);
        let actionGroupFields = await actionGroup.getFields();
        console.log(actionGroupFields);

        let actionName = actionGroupFields["actionName"];
        let dataTemplate = actionGroupFields["dataTemplate"];
        let valueField = actionGroupFields["valueField"];

        let parts = actionGroupFields["parts"];
        let index = data["index"];
        let partId = parts[index];
        let part = database.getObject(partId);
        let partFields = await part.getFields();
        let currentArray = partFields["values"];
        console.log(parts, currentArray);
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentValue = currentArray[i];

            let currentData = {...dataTemplate};
            currentData[valueField] = currentValue;

            await database.addActionToProcess(actionName, null, currentData);
        }

        let nextIndex = index+1
        if(nextIndex < parts.length) {
            await database.addActionToProcess("actionGroup/process", actionGroup, {"index": nextIndex});
        }
    }
}