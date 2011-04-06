function(head, req) {
	
	var dateString = function(a,b){
		
		var f = function(num,unit){
			var n = Math.floor(num);
			if(n!=1) unit += "s";
			return n + " "+unit;
		};
		
		var datediff = (a - b)/1000;
	   if(datediff < 60) return f(datediff,"second");
	   datediff /= 60;
	   if(datediff < 60) return f(datediff,"minute");
	   datediff /= 60;
	   if(datediff < 24) return f(datediff,"hour");
	   datediff /= 24;
	   if(datediff < 30) return f(datediff,"day");
	   datediff /= 30;
	   if(datediff < 12) return f(datediff,"month");
	   datediff /= 12;
	   return f(datediff,"year");
	};
	
	var username = req.userCtx.name; 
   start({"headers": {"Content-Type" : "text/html"}});
   send("<html><head><script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js'></script><script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js'></script>");
   send('<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/dark-hive/jquery-ui.css" type="text/css" />');
   send('<link rel="stylesheet" type="text/css" href="/style/main.css" />');
   send("<script type='text/javascript' src='/jquery.sha1.js'></script>");
   send("<script type='text/javascript' src='/shared.js'></script>");
   send("<script type='text/javascript' src='/frontpage.js'></script>");
   send("</head><body>");
   send("<div id='loginDialog' title='Login' style='display:none;'><form><label>name</label><input type='text' name='name' /><br /><label>password</label><input type='password' name='password' /></form></div>");
   send("<div id='signupDialog' title='Signup' style='display:none;'><form><label>name</label><input type='text' name='name' /><br /><label>password</label><input type='password' name='password' /></form></div>");
   send("<div style='width:70%;float:left;'><h1 style='margin-left:10px;'><a href='/'>Main</a></h1></div>");
   send("<div style='width:30%;float:right;height:200px;'><span style='float:right;'>");
   if(username!=null){
		send("<span id='username'>"+username+"</span>");
	}else{
		send("<span id='username'></span>");
	}
   send("<button id='signupButton' type='button'>Signup</button><button id='loginButton' type='button'>Login</button></span></div>");
   send("<ul>");
   var data = [];
   var row;
   var now = new Date();
   while( row = getRow()){
	   data.push(row);
   }
   data.sort(function(a,b){
	  return a.value.rating - b.value.rating;
   }).reverse();
   for(i in data){
	   row = data[i];
	   var post = row.value.post;
	   var rowdate = new Date(post.created_at);
	   var comments = row.value.comments;
	   
	   send("<li id='"+post._id+"'>");
	   send("<div><a class='title' href='"+post.url+"'>"+post.title+"</a></div>");
	   send("<div>submitted "+ dateString(now,rowdate) +" ago by "+post.author+"</div>");
	   send("<div><a href='/comments/"+post._id+"'>"+ comments +" "+ (comments==1 ? "comment" : "comments") +"</a></div>");
	   //send(JSON.stringify(row));
	   send("</li>");
   }
   send("</ul>");
   send('<h2>Submit link</h2><form id="postForm" action="post" method="post"><p><label>title</label><input type="text" name="title" /></p><p><label>url</label><input type="text" name="url" /></p><input type="submit" /></form>');
   send("</body></html>");
}
