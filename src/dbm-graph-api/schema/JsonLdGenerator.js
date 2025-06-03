import Dbm from "dbm";

export default class JsonLdGenerator extends Dbm.core.BaseObject{

    _construct() {
        super._construct();

        this.baseUrl = null;
        this.name = null;
    }

    async encodeWebsiteEntity(aDatabaseObject) {
        console.log("encodeWebsiteEntity");

        let site = Dbm.getInstance().repository.getItem("site");
    
        return {
            "@type": "WebSite",
            "@id": this.baseUrl + "/" + "#website",
            "url": this.baseUrl + "/",
            "name": site.name,
            "publisher": {
                "@id": this.baseUrl + "/" + "#organization"
            }
        };
    }

    async encodeOrganizationEntity(aDatabaseObject) {
        console.log("encodeOrganizationEntity");

        let site = Dbm.getInstance().repository.getItem("site");
    
        return {
            "@type": "Organization",
            "@id": this.baseUrl + "/" + "#organization",
            "url": this.baseUrl + "/",
            "name": site.name,
        };

        //Logo
    }
    
    async getWebsiteEntites() {
        console.log("getWebsiteEntites");
    
        let returnArray = [];
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
    
        let globalObject = await database.getIdentifiableObjectIfExists("globalObject", "website");
        if(globalObject) {
            let website = globalObject.singleObjectRelationQuery("out:pointingTo:*");
            if(website) {
                returnArray.push(await this.encodeWebsiteEntity(website));
                returnArray.push(await this.encodeOrganizationEntity(website));
            }
        }
    
        console.log(returnArray);
    
        return returnArray;
    }

    async getPageEntites(aPage) {

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let fields = await aPage.getFields();
        let url = await aPage.getUrl();
        let returnArray = [];

        let fullUrl = this.baseUrl + url;

        let pageObject = {
            "@type": "WebPage",
            "@id": fullUrl + "#webpage",
            "url": fullUrl,
            "name": fields["title"],
            "description": fields["meta/description"],
            "breadcrumb": {
              "@id": fullUrl +"#breadcrumb"
            },
            
          }
          returnArray.push(pageObject);

          let urlParts = url.split("/");
          console.log(urlParts);
          urlParts.pop();

          let breadcrumbItems = [];

          let currentUrl = "";
          let currentArray = urlParts;
          let currentArrayLength = currentArray.length;
          for(let i = 0; i < currentArrayLength; i++) {
            let currentPart = currentArray[i];
            currentUrl += currentPart + "/";
            let urlObject = await database.getObjectByUrl(currentUrl);
            console.log(urlObject, currentUrl);
            if(urlObject) {
                let urlObjectFields = await urlObject.getFields();
                let encodedStep = {
                    "@type": "ListItem",
                    "position": (i+1),
                    "name": urlObjectFields["navigationName"] ? urlObjectFields["navigationName"] : urlObjectFields["title"],
                    "item": this.baseUrl + currentUrl
                  }
                
                  breadcrumbItems.push(encodedStep);
            }
          }

            let breadcrumbList = {
            "@type": "BreadcrumbList",
            "@id": fullUrl + "#breadcrumb",
            "itemListElement": breadcrumbItems
          }

          returnArray.push(breadcrumbList);

        return returnArray;


        

          /*
          "primaryImageOfPage": {
              "@id": "https://example.com/product/acme-coffee-maker#primaryimage"
            }
              */
    }
}

