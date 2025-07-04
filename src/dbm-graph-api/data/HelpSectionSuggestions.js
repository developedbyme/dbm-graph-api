import Dbm from "dbm";

export default class HelpSectionSuggestions extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {

        await aEncodeSession.outputController.requireRole("admin");

        let returnObject = {};

        let content = aData["value"];
        returnObject["content"] = content;

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let item = await database.createObject("private", ["aiGeneratedHelpSectionSuggestions"]);
        await item.updateField("content", content);
        returnObject["id"] = item.id;

        let alreadyAdded = [
            "All about this section"
        ];

        let alreadyAddedString = "The page already have these faq sections: " + JSON.stringify(alreadyAdded);

        let contentString = JSON.stringify(content);

        let instructions = "Summarize what this page is about and generate sections for faq of what this page answers. Phrase the question as a user would write it when they are looking for information. Write the answer in an active tone of voice, call the company we and the user you. Only create questions for answers that are on this page, so if the answer is linked on another page it should not be included. This questions are aleady answered, so exclude similar questions: 'How can I contact Smartbox Self Storage?'. {additionalInstructions} Respond with only a json object {summary: string, questions: [{question: string, oneLineAnswer: string, answer: string, readMoreLinkText: string}]}, no markdown.";
        instructions = instructions.split("{data}").join(contentString);
        
        let additionalInstructions = "";
        instructions = instructions.split("{additionalInstructions}").join(additionalInstructions);

        let body = {
            "model": "gpt-4o",
            "response_format": { "type": "json_object" },
            "messages": [
               {"role":"system","content": instructions},
               /*{"role": "user", "content": alreadyAddedString},*/
               {"role": "user", "content": contentString}
           ],
            "temperature": 0.1
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
        await item.updateField("response", data);

        let message = data.choices[0].message;
        let responseContent = JSON.parse(message.content);
        console.log(responseContent);
        
        returnObject["titles"] = responseContent;
        
        return returnObject;
    }
}