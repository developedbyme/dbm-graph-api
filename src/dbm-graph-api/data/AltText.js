import Dbm from "dbm";

export default class SeoSummary extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let imageId = aData["id"];

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let item = await database.createObject("private", ["aiGeneratedAltText"]);

        returnObject["id"] = item.id;
        returnObject["imageId"] = imageId;
        
        let image = database.getObject(imageId);
        let fields = await image.getFields();

        let url = fields["resizeUrl"];
        if(url) {
            url = url.split("{scale}").join("width=1024,height=1024")
        }

        returnObject["url"] = url;

        let instructions = "Generate an alt text for the image. Respond with only a json object {altText: string}, no markdown.";

        let body = {
            "model": "gpt-4o",
            "response_format": { "type": "json_object" },
            "max_tokens": 300,
            "messages": [
              {"role":"system","content": instructions},
              {
                "role": "user",
                "content": [
                  {
                    "type": "image_url",
                    "image_url": {
                      "url": url
                    }
                  }
                ]
              }
            ]
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
        console.log(data);
        await item.updateField("response", data);

        let message = data.choices[0].message;
        console.log(message.content);
        let responseContent = JSON.parse(message.content);
        console.log(responseContent);
        
        returnObject["altText"] = responseContent["altText"];
        
        return returnObject;
    }
}