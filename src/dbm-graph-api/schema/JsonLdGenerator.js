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
        let fields = await aDatabaseObject.getFields();
    
        return {
            "@type": "WebSite",
            "@id": this.baseUrl + "/" + "#website",
            "url": this.baseUrl + "/",
            "name": fields["name"] ? fields["name"] : site.name,
            "publisher": {
                "@id": this.baseUrl + "/" + "#organization"
            }
        };
    }

    async encodeOrganizationEntity(aDatabaseObject) {
        console.log("encodeOrganizationEntity");

        let site = Dbm.getInstance().repository.getItem("site");
        let fields = await aDatabaseObject.getFields();
    
        return {
            "@type": "Organization",
            "@id": this.baseUrl + "/" + "#organization",
            "url": this.baseUrl + "/",
            "name": fields["name"] ? fields["name"] : site.name,
        };

        //Logo
    }

    async encodeLocalBusiness(aDatabaseObject) {

        let site = Dbm.getInstance().repository.getItem("site");

        let type = await aDatabaseObject.singleObjectRelationQuery("in:for:schema/type");
        let typeName = await type.getIdentifier();
        let fields = await aDatabaseObject.getFields();

        let returnObject = {
            "@type": typeName,
            "@id": this.baseUrl + "/" + "#local-business",
            "url": this.baseUrl + "/",
            "name": fields["name"] ? fields["name"] : site.name,
            "telephone": fields["phoneNumber"],
            "email": fields["email"],
            "priceRange": fields["priceRangeDescription"],
            "parentOrganization": {
                "@id": this.baseUrl + "/" + "#organization"
            }
        };

        if(fields["rating/value"]) {
            returnObject["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": fields["rating/value"],
                "reviewCount": fields["rating/count"],
                "bestRating": fields["rating/max"] ? fields["rating/max"] : "5",
                "worstRating": fields["rating/min"] ? fields["rating/min"] : "1",
              }
        }

        let location = await aDatabaseObject.singleObjectRelationQuery("out:at:location");

        if(location) {
            let fields =  await location.getFields();

            returnObject["address"] = {
                "@type": "PostalAddress",
                "streetAddress": fields["street"],
                "addressLocality": fields["city"],
                "postalCode": fields["postCode"],
                "addressCountry": fields["country"]
            },

            returnObject["geo"] = {
                "@type": "GeoCoordinates",
                "latitude": fields["latitude"],
                "longitude": fields["longitude"]
            };
        }

        return returnObject;
    }
    
    async getWebsiteEntites() {
        console.log("getWebsiteEntites");
    
        let returnArray = [];
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
    
        let website = await database.getGlobalObject("website");
        if(website) {
            returnArray.push(await this.encodeWebsiteEntity(website));

            let organization = await website.singleObjectRelationQuery("out:by:organization");
            if(organization) {
                returnArray.push(await this.encodeOrganizationEntity(organization));

                let currentArray = await website.objectRelationQuery("out:by:organization,in:in:localBusiness");
                let currentArrayLength = currentArray.length;
                for(let i = 0; i < currentArrayLength; i++) {
                    let currentLocalBusiness = currentArray[i];
                    returnArray.push(await this.encodeLocalBusiness(currentLocalBusiness));
                }
            }
        }
    
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
          urlParts.pop();

          let breadcrumbItems = [];

          let currentUrl = "";
          let currentArray = urlParts;
          let currentArrayLength = currentArray.length;
          for(let i = 0; i < currentArrayLength; i++) {
            let currentPart = currentArray[i];
            currentUrl += currentPart + "/";
            let urlObject = await database.getObjectByUrl(currentUrl);
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

