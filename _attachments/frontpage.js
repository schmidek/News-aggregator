
$(document).ready(function(){
	CouchDB.name = $("#username").html();
	$("#signupButton").click(CouchDB.signup);
	$("#loginButton").click(CouchDB.login);
	$("li").prepend("<div style='width:5ex;float:left;margin-right:10px;'><button class='upvote' type='button'>Up</button><button class='downvote' type='button'>Dn</button></div>");
	$(".upvote").click(function(){
		CouchDB.vote($(this).closest("li").attr("id"), 1);
	});
	$(".downvote").click(function(){
		CouchDB.vote($(this).closest("li").attr("id"), -1);
	});
	$("#postForm").submit(function(event){
		event.preventDefault();
		if(!CouchDB.ensureLogin()){
			return false;
		}
		var data = $(this).serializeJSON();
		data.type = "post";
		data.created_at = new Date().getTime();
		data.author = CouchDB.name;
		$.ajax({
			type: "POST",
			url: "post",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(msg){ window.location.reload(); }
		});
		return false;
	});
});
