function(keys, values, rereduce) {
	var i;
	var l = values.length;
	var ret = {post:null, ups:0, downs:0, comments:0};
	if(rereduce){
		for(i = 0; i < l; ++i){
			if(values[i].post){
				ret.post = values[i].post;
			}
			ret.ups += values[i].ups;
			ret.downs += values[i].downs;
			ret.comments += values[i].comments;
		}
	}else{
		for(i = 0; i < l; ++i){
			switch(values[i][0]){
				case "post": 
					ret.post = values[i][1]; 
					break;
				case "vote": 
					var r = values[i][1];
					if(r>0){
						ret.ups++;
					}else if(r<0){
						ret.downs++;
					}
					break;
				case "c":
					ret.comments++;
					break;
			}
		}
	}
	if(ret.post!=null){
		var s = ret.ups - ret.downs;
		var order = Math.log(Math.max(Math.abs(s),1)) / Math.log(10);
		var sign = s > 0 ? 1 : (s<0 ? -1 : 0);
		var seconds = ret.post.created_at/1000 - 1134028003;
		ret.rating = Math.round((order + sign * seconds / 45000) * 10000000) / 10000000;
	}
	
	return ret;
}
