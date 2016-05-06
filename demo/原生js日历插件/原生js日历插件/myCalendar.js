;(function(){
	var bOk = true;
	window.mackCalendar =function (name){
		//传进来的text
		var oT = document.getElementById(name);
		//创建oBoxdiv
		var oBox = document.createElement('div');
		oBox.className='yf_calendar';
		oBox.innerHTML = '<a href="javascript:;" class="left">←</a>\
		<h3>2015-04月</h3>\
		<a href="javascript:;" class="right">→</a>\
		<ol>\
			<li>一</li>\
			<li>二</li>\
			<li>三</li>\
			<li>四</li>\
			<li>五</li>\
			<li class="weekEnd">六</li>\
			<li class="weekEnd">日</li>\
		</ol>\
		<ul></ul>';
		//当文本框获取焦点，让oBox显示并设置位置
		oT.onfocus=function(ev){
			var oEvent = ev||event;
			oBox.style.display='block';
			oBox.style.left=oT.offsetLeft+'px';
			oBox.style.top=oT.offsetTop+oT.offsetHeight+'px';
			oEvent.cancelBubble=true;
		};
		oT.onclick=function(ev){
			var oEvent = ev||event;
			oEvent.cancelBubble=true;
		};
		var oH3 = oBox.getElementsByTagName('h3')[0];
		var oUl = oBox.getElementsByTagName('ul')[0];
		var aLi = oUl.children;
		var oLeft = oBox.getElementsByTagName('a')[0];
		var oRight = oBox.getElementsByTagName('a')[1];
		var iNow = 0;//相对的月份。
		/*
		**iNow++		往下个月走
		**iNow--		往上个月走
		*/
		//插入函数
		function calendar(){
			oUl.innerHTML='';
			//改变标题
			var oDate = new Date();
			oDate.setMonth(oDate.getMonth()+iNow,1);
			oH3.innerHTML = oDate.getFullYear()+'-'+(oDate.getMonth()+1);


			//插空格
			var oDate = new Date();
			oDate.setMonth(oDate.getMonth()+iNow,1);
			oDate.setDate(1);
			var w = oDate.getDay();
			if(w==0)w=7;//周末是0所以改成7
			w--;//插入星期-1的空li
			for(var i=0;i<w;i++){
				var oLi = document.createElement('li');
				oUl.appendChild(oLi);
			}


			//插日期
			var oDate = new Date();
			oDate.setMonth(oDate.getMonth()+iNow,1);
			oDate.setMonth(oDate.getMonth()+1);
			oDate.setDate(0);
			//n获取这个月有多少天
			var n = oDate.getDate();
			for(var i=0;i<n;i++){
				var oDate = new Date();
				//获取今天的日期
				var today = oDate.getDate();

				var oLi = document.createElement('li');
				//iNow=0当前月，<0之前的，>0之后的 
				if(iNow==0){
					if(today==i+1){
						oLi.className='today';
						selDate();
					}else if(i+1<today){
						oLi.className='past';
					}else{
						selDate();
					}
				}else if(iNow<0){
					oLi.className='past';
				}else{
					selDate();
				}
				//选择日期
				function selDate(){
					oLi.onclick=function(){
						var oDate = new Date();
						oDate.setMonth(oDate.getMonth()+iNow,1);
						oT.value = oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+this.innerHTML;
						oBox.style.display='none';
					};
				}

				oLi.onmouseover=function(){
					this.style.background='#ff0';
				};
				oLi.onmouseout=function(){
					this.style.background='';
				};

				oLi.innerHTML = i+1;
				oUl.appendChild(oLi);
			}
			//判断周末变红
			for(var i=0;i<aLi.length;i++){
				if(i%7==5||i%7==6){
					aLi[i].className='weekEnd';
				}
			}
		}
		calendar();
		oLeft.onclick=function(){
			iNow--;
			calendar();
		};
		oRight.onclick=function(){
			iNow++;
			calendar();
		};

		oT.parentNode.appendChild(oBox);



		if(bOk==false)return;
		bOk=false;
		var oLink = document.createElement('link');
		oLink.rel='stylesheet';
		oLink.type='text/css';
		oLink.href='myCalendar.css';
		document.documentElement.children[0].appendChild(oLink);

		oBox.onclick=function(ev){
			var oEvent = ev||event;
			oEvent.cancelBubble=true;
		};

		document.onclick=function(){
			oBox.style.display='none';
		};
	}
})();