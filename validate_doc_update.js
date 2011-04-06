function (newDoc, oldDoc, userCtx) {

  function forbidden(message) {    
    throw({forbidden : message});
  };
  
  function unauthorized(message) {
    throw({unauthorized : message});
  };

  function require(field, message) {
	message = message || "Document must have a " + field;
    if (!newDoc[field]) forbidden(message);
  };
  
  function unchanged(field) {
	require(field);
    if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field]))
      throw({forbidden : "Field can't be changed: " + field});
  }

  var username = userCtx.name;
  if(!username || typeof username != "string" || username.length<1){
	  unauthorized("Must be logged on");
  }
  
  if (newDoc.author) {
	if(newDoc.author != username){
      unauthorized("You may only update documents with author " + username);
    }
  }  
  unchanged("type");
  
  var type = newDoc.type;
  
  switch(type){
	  case "post": 
		unchanged("created_at");
		unchanged("author");
		require("title");
		require("url");
		break;
	  case "comment": 
		unchanged("created_at");
		unchanged("author");
		unchanged("post_id");
		unchanged("path");
		require("text");
		break;
	  case "vote": 
		require("rating");
		if(newDoc._id.substring(32) != username){
			unauthorized("You may only vote with " + username);
		}
		break;
	  case "vote_comment":
		require("rating");
		unchanged("post_id");
		if(newDoc._id.substring(32) != username){
			unauthorized("You may only vote with " + username);
		}
		break;
  }

}
