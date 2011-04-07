function(head, req) {
	
	start({"headers": {"Content-Type" : "text/html"}});
	
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
	var escapeHtml = function(s){
		return s.split("&").join("&amp;").split( "<").join("&lt;").split(">").join("&gt;");
	}
	
	var page = parseInt(req.query.page) || 1;
	if(page <= 0) page = 1;
	
	var username = req.userCtx.name; 
	var data = [];
   var row;
   var now = new Date();
   while( row = getRow()){
	   data.push(row);
   }
   data.sort(function(a,b){
	  return a.value.rating - b.value.rating;
   }).reverse();
   
   var pageSize = 20;
   var hasPrev = page>1;
   var hasNext = (page*pageSize) < data.length;
   var viewmorehtml = "";
   if(hasPrev || hasNext){
	   viewmorehtml += "<div>view more: ";
	   if(hasPrev) viewmorehtml += "<a href='?page=" + (page-1) + "'>prev</a>";
	   if(hasPrev && hasNext) viewmorehtml += " | ";
	   if(hasNext) viewmorehtml += "<a href='?page=" + (page+1) + "'>next</a>";
	   viewmorehtml += "</div>";
	}
   
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
		send("<span id='username'>"+escapeHtml(username)+"</span>");
	}else{
		send("<span id='username'></span>");
	}
   send("<button id='signupButton' type='button'>Signup</button><button id='loginButton' type='button'>Login</button></span></div>");
   send(viewmorehtml);
   send("<ul>");
   
   var startIndex = (page-1) * pageSize;
   var min = Math.min(startIndex+pageSize,data.length);
   for(i = startIndex; i < min; i++){
	   row = data[i];
	   var post = row.value.post;
	   var rowdate = new Date(post.created_at);
	   var comments = row.value.comments;
	   var points = row.value.ups - row.value.downs;
	   	   
	   send("<li id='"+post._id+"'>");
	   send("<div><a class='title' href='"+escapeHtml(post.url)+"'>"+escapeHtml(post.title)+"</a></div>");
	   send("<div>submitted "+ dateString(now,rowdate) +" ago by "+escapeHtml(post.author)+"</div>");
	   send("<div><span>"+points+(points==1 ? " point" : " points")+" </span> <a href='/comments/"+post._id+"'>"+ comments +" "+ (comments==1 ? "comment" : "comments") +"</a></div>");
	   //send(JSON.stringify(row));
	   send("</li>");
   }
   send("</ul>");
   send(viewmorehtml);
   send('<h2>Submit link</h2><form id="postForm" action="post" method="post"><p><label>title</label><input type="text" name="title" /></p><p><label>url</label><input type="text" name="url" /></p><input type="submit" value="Submit" /></form>');
   send("</body></html>");
}
