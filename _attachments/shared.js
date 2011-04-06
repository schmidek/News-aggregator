(function( $ ){
$.fn.serializeJSON=function() {
var json = {};
jQuery.map($(this).serializeArray(), function(n, i){
json[n['name']] = n['value'];
});
return json;
};
})( jQuery );

var CouchDBUtils = function(){
	
	var self = this;
	
	this.uuids_cache = [];
	this.name = null;
	this.postid = null;
	
	this.newUuids = function(n, buf) {
	  buf = buf || 100;
	  if (this.uuids_cache.length >= n) {
	    var uuids = this.uuids_cache.slice(this.uuids_cache.length - n);
	    if(this.uuids_cache.length - n == 0) {
	      this.uuids_cache = [];
	    } else {
	      this.uuids_cache =
	          this.uuids_cache.slice(0, this.uuids_cache.length - n);
	    }
	    return uuids;
	  } else {
		var ret;
		$.ajax({
			type: "GET",
			url: "/_uuids?count=" + (buf+n),
			dataType: "json",
			async: false,
			success: function(data){
				self.uuids_cache =
					self.uuids_cache.concat(data.uuids.slice(0, buf));
				ret = data.uuids.slice(buf);
			}
		});
	    return ret;
	  }
	};
	this.vote = function(id, rating){
		if(!this.ensureLogin()){
			return false;
		}
		var data = new Object();
		data.type = "vote";
		data.rating = rating;
		$.ajax({
			type: "PUT",
			url: "/vote/"+id+self.name,
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(msg){  }
		});
	};
	this.vote_comment = function(id, rating){
		if(!this.ensureLogin()){
			return false;
		}
		var data = new Object();
		data.type = "vote_comment";
		data.post_id = this.postid;
		data.rating = rating;
		$.ajax({
			type: "PUT",
			url: "/vote/"+id+self.name,
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(msg){  }
		});
	};
	this.signup = function(){
		$("#signupDialog").dialog({
			autoOpen: true,
			height: 'auto',
			width: 'auto',
			modal: true,
			buttons: {
				"Create an account": function(){
					var data = $("#signupDialog form").serializeJSON();
					var _name = data.name;
					var _password = data.password;
					data.type = "user";
					data.roles = [];
					data.salt = "1";
					data.password_sha = $.sha1(data.password+data.salt);
					delete data.password;
					$.ajax({
						type: "PUT",
						url: "/create_user/org.couchdb.user:"+data.name,
						contentType: "application/json",
						data: JSON.stringify(data),
						success: function(msg){ 
							self._login(_name,_password);
							$("#signupDialog").dialog("close"); 
						}
					});
				},
				Cancel: function(){
					$(this).dialog("close");
				}
			},
			close: function(){
				$(this).dialog("destroy");
			}
		});
	};
	this._login = function(_name,_password){
		$.ajax({
			type: "POST",
			url: "/_session",
			headers: {"X-CouchDB-WWW-Authenticate": "Cookie"},
			contentType: "application/x-www-form-urlencoded",
			data: "name="+_name+"&password="+_password,
			dataType: "json",
			success: function(resp){ 
				if(resp.ok && resp.name){
					$("#username").html(resp.name);
					self.name = resp.name;
				}
				$("#loginDialog").dialog("close"); 
			}
		});
	};
	this.login = function(){
		$("#loginDialog").dialog({
			autoOpen: true,
			height: 'auto',
			width: 'auto',
			modal: true,
			buttons: {
				"Login": function(){
					var data = $("#loginDialog form").serializeJSON();
					self._login(data.name, data.password);
				},
				Cancel: function(){
					$(this).dialog("close");
				}
			}
		});
	};
	this.ensureLogin = function(){
		if(!self.name || self.name=="null" || self.name==""){
			$.ajax({
				type: "GET",
				url: "/_session",
				dataType: "json",
				async: false,
				success: function(resp){ 
					if(resp.ok && resp.userCtx.name){
						$("#username").html(resp.userCtx.name);
						self.name = resp.userCtx.name;
						return true;
					}else{
						self.login();
						return false;
					}
				}
			});
		}else{
			return true;
		}
	};
	
};
var CouchDB = new CouchDBUtils();
