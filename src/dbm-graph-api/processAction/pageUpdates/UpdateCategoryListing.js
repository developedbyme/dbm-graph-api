import Dbm from "dbm";

export default class UpdateCategoryListing extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("UpdateCategoryListing:process");
        console.log(aAction);

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let page = await aAction.singleObjectRelationQuery("out:from:page");
        
        let categories = await page.objectRelationQuery("out:in:group/pageCategory");
        let links = await page.objectRelationQuery("in:for:linkPreview");

        let defaultLinks = [];
        {
            let currentArray = links;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentLink = currentArray[i];

                let mode = await currentLink.getSingleLinkedType("type/listUpdateMode");

                if(mode === "byCategories") {
                    defaultLinks.push(currentLink);
                }
            }

            if(defaultLinks.length === 0) {
                let link = await database.createObject("public", ["linkPreview"]);
                await link.addLinkedType("type/listUpdateMode", "byCategories");
                await link.addOutgoingRelation(page, "for");

                defaultLinks.push(link);
            }
        }
        
        let categoryListIds = [];
        {
            let currentArray = categories;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentCategory = currentArray[i];

                let list = await currentCategory.singleObjectRelationQuery("out:for:linkList");

                if(!list) {
                    list = await database.createObject("public", ["linkList"]);
                    let fields = await currentCategory.getFields();
                    await list.updateField("name", fields["name"] + " (page category list)");
                    await currentCategory.addOutgoingRelation(list, "for");
                }
                
                categoryListIds.push(list.id);
            }
        }

        {
            let currentArray = defaultLinks;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentLink = currentArray[i];

                await currentLink.replaceMultipleOutgoingRelations(categoryListIds, "in", "linkList");
            }
        }
    }
}