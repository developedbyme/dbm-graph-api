import Dbm from "dbm";

export default class SendEmail extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        //console.log("SendEmail:process");
        //console.log(aAction);

        let fields = await aAction.getFields();
        let data = fields["data"];

        let message = this.item.client.controller.createMessage();

        message.setTo(data["to"]);
        if(data["from"]) {
            message.setFrom(data["from"]);
        }
        
        message.setSubject(data["subject"]);
        message.setTextContent(data["textContent"]);
        message.setHtmlContent(data["htmlContent"]);

        message.item.additionalData = data["additionalData"];

        await message.send();
    }
}