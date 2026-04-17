import Dbm from "dbm";

export default class UpdateReviews extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        //console.log("UpdateReviews:process");
        //console.log(aAction);

        let database = Dbm.node.getDatabase();

        let place = await aAction.singleObjectRelationQuery("out:from:google/place");
        let placeId = await place.getIdentifier();

        let reviews = await Dbm.node.googlemaps.getReviews(placeId);

        let currentArray = reviews;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentReview = currentArray[i];
            let reviewId = currentReview["name"];

            let reviewSource = await database.getIdentifiableObjectIfExists("reviewSource/googleReview", reviewId);
            if(!reviewSource) {

                reviewSource = await database.createObject("private", ["reviewSource", "reviewSource/googleReview"]);
                await reviewSource.setIdentifier(reviewId);
                await reviewSource.addLinkedType("type/reviewSourceType", "google");
                await reviewSource.updateField("date", currentReview["publishTime"]);
                await reviewSource.updateField("rating", currentReview["rating"]);
                await reviewSource.updateField("description", Dbm.objectPath(currentReview, "originalText.text"));
                await reviewSource.updateField("name", Dbm.objectPath(currentReview, "authorAttribution.displayName") + ", " + currentReview["rating"] + " stars, " + currentReview["publishTime"].split("T")[0]);
                await reviewSource.updateField("from", Dbm.objectPath(currentReview, "authorAttribution.displayName"));
                await reviewSource.updateField("imageUrl", Dbm.objectPath(currentReview, "authorAttribution.photoUri"));
                await reviewSource.updateField("link", currentReview["googleMapsUri"]);

                await reviewSource.outgoingRelations.add(place, "for");

                let review = await database.createObject("public", ["review"]);

                await review.outgoingRelations.add(reviewSource, "from");
                await review.updateField("date", currentReview["publishTime"]);
                await review.updateField("rating", currentReview["rating"]);
                await review.updateField("description", Dbm.objectPath(currentReview, "originalText.text"));
                await review.updateField("name", Dbm.objectPath(currentReview, "authorAttribution.displayName") + ", " + currentReview["rating"] + " stars, " + currentReview["publishTime"].split("T")[0]);
                await review.updateField("from", Dbm.objectPath(currentReview, "authorAttribution.displayName"));

                await review.addActionTrigger("review/created");
            }
        }
    }
}