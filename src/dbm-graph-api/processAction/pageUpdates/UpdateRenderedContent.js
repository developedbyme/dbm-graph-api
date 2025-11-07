import Dbm from "dbm";

export default class UpdateRenderedContent extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("UpdateRenderedContent:process");
        //console.log(aAction);

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let page = await aAction.singleObjectRelationQuery("out:from:page");

        let webcrawler = Dbm.getInstance().repository.getItem("webcrawler");

        if(webcrawler.domain && webcrawler.renderPageUrl) {
            let url = await page.getUrl();

            let fullUrl = webcrawler.domain + url;
    
            let body = {
                "url": fullUrl,
                "key": webcrawler.key
            }
    
            let headers = {
                "Content-Type": "application/json",
            }
            
            let response = await fetch(webcrawler.renderPageUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });
    
            let data = await response.json();

            let renderedContent = Dbm.objectPath(data, "data.html");
            await page.updateField("renderedPageContent", renderedContent);

            await database.addActionToProcess("pageUpdates/clearCache", [page]);
        }

        
    }
}