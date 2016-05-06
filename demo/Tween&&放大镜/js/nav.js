//获取并绑定标签
var nav_box=document.getElementById('nav_box'),
	nav=document.getElementById('nav'),
	navs=nav.getElementsByTagName('li'),
	back=document.getElementById('index'),
	nowpos=0,
	b=nowpos,
	t=null;
//for循环绑定点击事件
	for(var i=0;i<navs.length;i++){
		navs[i].onmouseover=function(){
			for(var j=0;j<navs.length;j++){
				if(this==navs[j]){
					autoscroll(nowpos,j*117);
				}
			}
		}
		navs[i].onmouseout=function(){ autoscroll(nowpos,0); }
	}
	//引用Tween算法
	function autoscroll(b,c){
		var n=0,d=40,c=c-nowpos,b=nowpos;
		clearInterval(t);
		t=setInterval(function(){
		n++;
		if(n>=d){
			clearInterval(t);
		}
		nowpos=Tween.Back.easeOut(n,b,c,d);
		index.style.backgroundPosition=nowpos+'px 0';
		},16);
	}
	//放大镜部分
	var outside=document.getElementById('enlarge'),
		box=document.getElementById('smallpic'),
		con=document.getElementById('con'),
		big=document.getElementById('bigpic'),
		pic=document.getElementById('pic'),
		turnbig=document.getElementById('turnbig'),
		close_btn=document.getElementById('close_btn'),
		blowup=document.getElementById('blowup'),
		text_right=document.getElementById('text_right');
	box.onmouseover=function(event){
		var event=event||window.event;
		big.style.display='block';
		turnbig.style.display='block';
		turnbig.onclick=function(){
			blowup.style.display='block';
		}
		close_btn.onclick=function(){
			blowup.style.display='none';
		}
		box.onmousemove=function(event){
			var event=event||window.event;
			var newX=event.clientX;
			var newY=event.clientY;
			var endX=newX-box.offsetLeft-con.offsetWidth/2;
			var endY=newY-box.offsetTop-con.offsetHeight/2;
			if(endX<0){
				endX=0;
			}
			if(endY<0){
				
				endY=0;
			}
			if(endX>box.clientWidth-con.offsetWidth){
				
				endX=box.clientWidth-con.offsetWidth;
			}
			if(endY>box.clientHeight-con.offsetHeight){
				
				endY=box.clientHeight-con.offsetHeight;
			}
			con.style.left=endX+'px';
			con.style.top=endY+'px';
			big.scrollLeft=con.offsetLeft*1.5;
			big.scrollTop=con.offsetTop*1.5;
		}
	}
	box.onmouseout=function(){
		big.style.display='none';
		turnbig.style.display='none';
	}