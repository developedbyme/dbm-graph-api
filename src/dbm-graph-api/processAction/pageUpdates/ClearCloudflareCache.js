import Dbm from "dbm";

export default class ClearCloudflareCache extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("ClearCloudflareCache:process");
        //console.log(aAction);

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let page = await aAction.singleObjectRelationQuery("out:from:page");

        let cloudflare = Dbm.getInstance().repository.getItem("cloudflare");
        let url = await page.getUrl();

        if(cloudflare.domain && cloudflare.zone) {
            let fullUrl = cloudflare.domain + url;
    
            let requestUrl = "https://api.cloudflare.com/client/v4/zones/" + cloudflare.zone + "/purge_cache";
    
            let body = {
              "files": [fullUrl]
            }
    
            let headers = {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + cloudflare.cacheToken
            }
            
            let response = await fetch(requestUrl, {
                method: "DELETE",
                headers: headers,
                body: JSON.stringify(body),
            });
    
            let data = await response.json();
        }
        else {
            //METODO: report error log
        }

        
    }
}