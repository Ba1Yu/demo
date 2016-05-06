(function(){
	var x=100;
		y=100,
		z=true,
		w=true;
	setInterval(function(){

		if(z){
			x++;
			if(x>=300){
				z=false;
			}
		}else{
			x--;
			if(x<=0){
				z=true;
			}
		}
		if(w){
			y+=2;
			if(y>=180){
				w=false;
			}
		}else{
			y-=2;
			if(y<=0){
				w=true;
			}
		}
	$('img').css('-webkit-mask-position',x+'px '+y+'px');
	},1);
	})();