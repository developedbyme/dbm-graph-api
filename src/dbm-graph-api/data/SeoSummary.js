import Dbm from "dbm";

export default class SeoSummary extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let content = aData["value"];
        returnObject["content"] = content;

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let item = await database.createObject("private", ["aiGeneratedSeoSummary"]);
        await item.updateField("content", content);
        returnObject["id"] = item.id;

        let contentString = JSON.stringify(content);

        let instructions = "Generate an seo description for the page data provided by the user, with a max character count of 155. {additionalInstructions} Respond with only a json object {seoSummary: string}, no markdown.";
        instructions = instructions.split("{data}").join(contentString);
        
        let additionalInstructions = "";
        instructions = instructions.split("{additionalInstructions}").join(additionalInstructions);

        let body = {
            "model": "gpt-4o-mini",
            "messages": [
               {"role":"system","content": instructions},
               {"role": "user", "content": contentString}
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
        await item.updateField("response", data);

        let message = data.choices[0].message;
        let responseContent = JSON.parse(message.content);
        console.log(responseContent);
        
        returnObject["seoSummary"] = responseContent["seoSummary"];
        
        return returnObject;
    }
}