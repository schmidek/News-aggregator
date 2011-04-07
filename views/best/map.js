function(doc) {
	switch(doc.type){
		case "post": emit([doc._id,""], ["post", doc]); break;
		case "comment": emit([doc.post_id,doc._id], ["comment", doc]); break;
		case "vote_comment": emit([doc.post_id,doc._id.substring(0,32)], ["vote", doc.rating]); break;
	}
}
