function(doc) {
	switch(doc.type){
		case "post": emit(doc._id, ["post", doc]); break;
		case "vote": emit(doc._id.substring(0,32), ["vote", doc.rating]); break;
		case "comment": emit(doc.post_id, ["c"]); break;
	}
}
