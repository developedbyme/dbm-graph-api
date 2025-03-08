import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class ClearCloudflareCache extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {

        let cloudflare = Dbm.getInstance().repository.getItem("cloudflare");
        let url = await aObject.getUrl();

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