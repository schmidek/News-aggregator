function(keys, values, rereduce) {
	var i;
	var l = values.length;
	var ret = {post:null, comment:null, ups:0, downs:0};
	if(rereduce){
		for(i = 0; i < l; ++i){
			if(values[i].comment){
				ret.comment = values[i].comment;
			}
			if(values[i].post){
				ret.post = values[i].post;
			}
			ret.ups += values[i].ups;
			ret.downs += values[i].downs;
		}
	}else{
		for(i = 0; i < l; ++i){
			switch(values[i][0]){
				case "post":
					ret.post = values[i][1];
					break
				case "comment": 
					ret.comment = values[i][1]; 
					break;
				case "vote": 
					var r = values[i][1];
					if(r>0){
						ret.ups++;
					}else if(r<0){
						ret.downs++;
					}
					break;
			}
		}
	}
	if(ret.comment!=null){
		
		var n = ret.ups + ret.downs;
		if(n==0){
			ret.rating = 0.5;
		}else{
			var z = 1.0;
			var z2 = z*z;
			var p = ret.ups / n;
			ret.rating = Math.sqrt(p+z2/(2*n)-z*((p*(1-p)+z2/(4*n))/n))/(1+z2/n);
		}
		ret.rating = Math.round((1-ret.rating)*100000)/100000;
	}
	
	return ret;
}
