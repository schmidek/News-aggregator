
var getPath = function(ele, path){
	var parent = $(ele).parent().closest("li");
	if(parent.length>0){
		return getPath(parent[0], path.concat(parent.attr("id")));
	}else{
		return path.reverse();
	}
}

$(document).ready(function(){
	CouchDB.name = $("#username").html();
	var temp = location.href.split("/");
	CouchDB.postid = temp[temp.length-1];
	$("#loginButton").click(CouchDB.login);
	$("#signupButton").click(CouchDB.signup);
	$("li").prepend("<div style='width:5ex;float:left;margin-right:10px;'><div><button class='upvote' type='button'>Up</button></div><div><button class='downvote' type='button'>Dn</button></div></div>");
	$(".reply").live("click", function(){
		$(this).hide();
		$(this).after('<form class="commentForm" action="post" method="post"><p><textarea name="text" ></textarea></p><input type="submit" /><button type="button" class="cancelReply">cancel</button></form>');
	});
	$(".cancelReply").live("click", function(){
		var form = $(this).closest("form");
		form.prev().show();
		form.remove();
	});
	$("li").append('<button class="reply" type="button">reply</button>');
	$(".upvote").click(function(){
		CouchDB.vote_comment($(this).closest("li").attr("id"), 1);
	});
	$(".downvote").click(function(){
		CouchDB.vote_comment($(this).closest("li").attr("id"), -1);
	});
	$(".commentForm").live("submit",function(event){
		event.preventDefault();
		if(!CouchDB.ensureLogin()){
			return false;
		}
		var data = $(this).serializeJSON();
		var id = CouchDB.newUuids(1)[0];
		data.type = "comment";
		data.created_at = new Date().getTime();
		data.author = CouchDB.name;
		data.post_id = CouchDB.postid;
		data.path = getPath(this, [id]);
		$.ajax({
			type: "PUT",
			url: "/comment/"+id,
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(msg){ window.location.reload(); }
		});
		return false;
	});
});
