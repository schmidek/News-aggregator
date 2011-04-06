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
   send("<script type='text/javascript' src='/comments.js'></script>");
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
   var ratings = new Object();
   var rows = [];
   var row;
   while( row = getRow()){
		if(row.value.comment){
			ratings[row.value.comment._id] = row.value.rating;
			rows.push(row.value);
		}
   }
   var i;
   for(i in rows){
	   row = rows[i];
	   row.pathRatings = [];
	   var j, pk;
	   for(j in row.comment.path){
		   pk = row.comment.path[j];
		   row.pathRatings.push(ratings[pk]);
		   row.pathRatings.push(pk);
	   }
   }
   rows.sort(function(a,b){
	   if (a.pathRatings < b.pathRatings) return -1;
	   if (a.pathRatings > b.pathRatings) return 1;
	  return 0;
   });
   var prev = [];
   var now = new Date();
   for(i in rows){
	   row = rows[i];
	   var newpath = row.comment.path;
	   if(newpath.length > prev.length){
			for(var k = 0; k < newpath.length-prev.length; k++){
				send("<ul>");
			}
	   }else if(newpath.length < prev.length){
		   send("</li>");
		   for(var k = 0; k < prev.length-newpath.length; k++){
			   send("</ul></li>");
		   }
	   }else{
		   send("</li>");
	   }
	   send("<li id='"+ row.comment._id +"'>");
	   send("<div>"+ row.comment.author + " " + (row.ups-row.downs) + " points " + dateString(now,new Date(row.comment.created_at)) + " ago</div>");
	   send("<p>"+ row.comment.text +"</p>");
	   //send(JSON.stringify(row));
	   
	   prev = newpath;
   }
   send("</li>");
   for(var k = 0; k < prev.length-1; k++){
		send("</ul></li>");
	}
   send("</ul>");
   send('<h2>Post Comment</h2><form class="commentForm" action="post" method="post"><p><textarea name="text" ></textarea></p><input type="submit" /></form>');
   send("</body></html>");
}
