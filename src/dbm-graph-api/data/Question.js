import Dbm from "dbm";
import DbmGraphApi from "../../../index.js";

export default class Question extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let question = aData["value"];
        returnObject["question"] = question;

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let questionItem = await database.createObject("private", ["customerQuestion"]);
        await questionItem.updateField("question", question);
        returnObject["id"] = questionItem.id;

        let selectQuery = new DbmGraphApi.range.Query();
        await selectQuery.setObjectType("helpSection");
        selectQuery.includePrivate();
        let items = await selectQuery.getObjects();

        let currentArray = items;
        let currentArrayLength = currentArray.length;
        let helpPages = new Array(currentArrayLength);

        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            let fields = await currentItem.getFields();

            let codedObject = {id: currentItem.id, question: fields.question, title: fields.title, answer: fields.description};
            helpPages[i] = codedObject;
        }

        let helpPagesString = JSON.stringify(helpPages);

        console.log(helpPages);

        let instructions = "Find out which the best help pages for the question and return the id from this json: {data}. {additionalInstructions} Respond with only a json object {hasMatch: boolean, pages: array with ids of the pages (in order of relevance)}, no markdown.";
        instructions = instructions.split("{data}").join(helpPagesString);
        
        let additionalInstructions = "Units are stored in square feet, so convert square meters to feet.";
        instructions = instructions.split("{additionalInstructions}").join(additionalInstructions);

        let body = {
            "model": "gpt-4o-mini",
            "response_format": { "type": "json_object" },
            "messages": [
               {"role":"system","content": instructions},
               {"role": "user", "content": question}
           ],
            "temperature": 0.7
       }

        let headers = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + Dbm.getInstance().repository.getItem("openAi").token
        }
        
        let response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        let data = await response.json();
        await questionItem.updateField("response", data);

        let message = data.choices[0].message;
        let content = JSON.parse(message.content);
        console.log(content);

        let pages = [];
        {
            let currentArray = content.pages;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentId = 1*currentArray[i];

                if(!isNaN(currentId)) {
                    pages.push(currentId);
                    await aEncodeSession.encodeSingle(currentId, "helpSection");
                    await questionItem.addIncomingRelation(currentId, "suggestedFor");
                }
            }
        }
        
        returnObject["answers"] = pages;
        
        return returnObject;
    }
}