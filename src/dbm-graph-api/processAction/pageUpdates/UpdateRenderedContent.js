import Dbm from "dbm";

export default class UpdateRenderedContent extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("UpdateRenderedContent:process");
        //console.log(aAction);

        let database = Dbm.getRepositoryItem("graphDatabase").controller;
        let page = await aAction.singleObjectRelationQuery("out:from:page");

        let fields = await page.getFields();

        let webcrawler = Dbm.getRepositoryItem("webcrawler");
        let renderedContent = null;

        if(!fields["seo/noIndex"]) {
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

                renderedContent = Dbm.objectPath(data, "data.html");
            }
        }

        if(renderedContent !== fields["renderedContent"]) {
            await page.updateField("renderedPageContent", renderedContent);

            await database.addActionToProcess("pageUpdates/clearCache", [page]);
        }
    }
}