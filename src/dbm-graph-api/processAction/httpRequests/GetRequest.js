import Dbm from "dbm";

export default class GetRequest extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("GetRequest:process");
        console.log(aAction);

        let fields = await aAction.getFields();
        let data = fields["data"];
        console.log(fields);

        let headers = {}; //METODO
            
        let response = await fetch(data["url"], {
            method: "GET",
            headers: headers,
        });

        console.log(response.status)

        let responseData = await response.text();
        console.log(responseData);
    }
}