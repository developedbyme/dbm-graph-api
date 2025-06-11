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

        let alreadyAddedString = "The page already have these titles: " + JSON.stringify(alreadyAdded);

        let contentString = "Content of the page: " + JSON.stringify(content);

        let instructions = "Analyze the content and generate a list of questions and link titles that this page answers. Do the link titles as a call to action. {additionalInstructions} Respond with only a json object {helpSectionTitles: array of {question: string, linkTitle: string}}, no markdown.";
        instructions = instructions.split("{data}").join(contentString);
        
        let additionalInstructions = "";
        instructions = instructions.split("{additionalInstructions}").join(additionalInstructions);

        let body = {
            "model": "gpt-4o-mini",
            "response_format": { "type": "json_object" },
            "messages": [
               {"role":"system","content": instructions},
               {"role": "user", "content": alreadyAddedString},
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
        
        returnObject["titles"] = responseContent["helpSectionTitles"];
        
        return returnObject;
    }
}