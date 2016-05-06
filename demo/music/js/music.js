/*
 * 本地存储两个基本数据，其一为歌曲的索引值，用于控制选项卡以及数据初始化结果；
 * 其二为当前音乐的currentTime，目的在于能够进入页面之后继续进行播放。
 *
 */
(function(){

	var audioBtn = document.getElementById('audioBtn'),
		audioMusic = document.getElementById('audioMusic'),
		progress = document.getElementById('progress'),
		status = true,
		rotateDeg = 180,
		timer = null,
		a,b=0;
	audioBtn.onclick = controlMusic;
	/*键盘空格键控制是否播放*/
	document.onkeypress = function(e){
		if (e.which==32) {
			controlMusic();
		};
	};

	// 声明本地存储中，放置当前时间的变量
	var oldTime;
	var sumTime;

	/*音乐的播放控制以及圆形进度条的控制*/
	function controlMusic(){
		b=1;
		if(timer){
			clearInterval(timer);
		}
		if (status) {
			audioMusic.currentTime = oldTime;
			audioMusic.play();
			audioBtn.className = 'audio_btn pause';
			status = false;

			timer = setInterval(

			/*
			 * 计算比例，用百分比换算为度数。总共180度,计算出进度块需要旋转的角度
			 * 进行检测是否播放完成，如果播放完成，则重置播放器
			 *
			 */
			function(){
				var lrc_step=audioMusic.currentTime/audioMusic.duration;
				rotateDeg = audioMusic.currentTime/audioMusic.duration*180+180;
				progress.style.webkitTransform = 'rotate('+ rotateDeg +'deg)';
				progress.style.transform = 'rotate('+ rotateDeg +'deg)';
				progress.style.oTransform = 'rotate('+ rotateDeg +'deg)';
				progress.style.msTransform = 'rotate('+ rotateDeg +'deg)';
				music_lrc.scrollTop=500*lrc_step;
				scrollBar.style.top=420*lrc_step+'px';
				if (audioMusic.ended) {
					clearInterval(timer);
					audioBtn.className = 'audio_btn play';
					rotateDeg = 180;
					progress.style.webkitTransform = 'rotate('+ rotateDeg +'deg)';
					progress.style.oTransform = 'rotate('+ rotateDeg +'deg)';
					progress.style.msTransform = 'rotate('+ rotateDeg +'deg)';
					progress.style.transform = 'rotate('+ rotateDeg +'deg)';
					status = true;
				};

				/*
				 * 进行本地存储的数据存储相关操作
				 * 由于不需要兼容IE低端版本，因此直接使用HTML5-localstorage
				 *
				 */
				if(window.localStorage){	// 如果支持本地存储则执行下列操作
					localStorage.setItem('currentTime',audioMusic.currentTime);
					oldTime = localStorage.getItem('currentTime');
					sumTime = localStorage.setItem('duration',audioMusic.duration);
				}
			},200);
		}else{
			audioMusic.pause();
			audioBtn.className = 'audio_btn play';
			status = true;
		}
	}

	var audioPic = document.getElementById('audioPic'),
		audioTit = document.getElementById('audioTit'),
		audioInf = document.getElementById('audioInf'),
		audioLrc = document.getElementById('audioLrc'),
		audiolrc = document.getElementById('audiolrc'),
		music_lrc = document.getElementById('music_lrc'),
		scroll = document.getElementById('scrollRange'),
		scrollBar = document.getElementById('scrollBar'),
		tit = document.getElementById('tit'),
		tits = tit.getElementsByTagName('li');
	
	/*完成页面加载时需要申请后台数据*/
	var xhr = new XMLHttpRequest();
	var url = 'data/music.json';
	var datas;
	xhr.open('get', url, true);
	xhr.send(null);

	//有待添加loading图
	xhr.onload = function(){
		datas = xhr.responseText;
		datas = JSON.parse(datas);
		var num;
		/*此处进行本地存储检测，检测是否之前播放过音乐*/
		if (localStorage.getItem('musicNum')) {	//如果之前播放过，则直接提取当前的数值
			num = localStorage.getItem('musicNum');
		}else{	//如果没有播放过，设置为初始第一个
			num = 0;
		}

		// 基本数据处理
		audioPic.setAttribute('src', datas[num].pic);
		audioPic.setAttribute('alt', datas[num].tit);
		audioTit.innerHTML = datas[num].tit;
		audioInf.innerHTML = datas[num].inf;
		var lrcdataNew=datas[num].lrc,
			lrcrowNew=lrcdataNew.split(",");
		for (var g=0;g<lrcrowNew.length;g++){
			var ns=document.createElement('p');
			audioLrc.appendChild(ns);
			var lrcrows=music_lrc.getElementsByTagName('p');
			lrcrows[g].innerHTML=lrcrowNew[g];
		}
		audioMusic.setAttribute('src', datas[num].music);
		scrolldrag();
		// 处理选项卡显示样式
		tits[num].className = 'select';

		// 本地存储进行音乐索引值的存储
		localStorage.setItem('musicNum', num);
		setCircle();
	}

	// 圆框的位置初始化应当在页面初始化之后进行，在加载完成数据之后进行
	
	function setCircle(){
		// 进行本地存储数据的提取
		oldTime = parseFloat(localStorage.getItem('currentTime')); 
		// 设置为当前音乐的播放时间
		// 初始化半圆的角度值
		sumTime = parseFloat(localStorage.getItem('duration'));
		rotateDeg = oldTime/sumTime*180+180;
		progress.style.webkitTransform = 'rotate('+ rotateDeg +'deg)';
	}

	/*实现点击任何一个tab切换，进行相应数据的加载以及tab切换卡的样式变化*/
	for (var i = 0, len = tits.length; i < len; i++) {
		/*
		 * 点击时需要进行选项卡样式的处理以及数据的提取显示
		 * 同时，在点击时需要进行本地数据的存储，存储内容为music的Num，即索引值
		 *
		 */
		tits[i].onclick = function(i){
			
			return function(){
				audioLrc.innerHTML='';
				for (var j = 0, len = tits.length; j <len; j++) {
					tits[j].className = '';
				};

				// 选项卡样式
				tits[i].className = 'select';

				// 基本数据提取
				audioPic.setAttribute('src', datas[i].pic);
				audioPic.setAttribute('alt', datas[i].tit);
				audioTit.innerHTML = datas[i].tit;
				audioInf.innerHTML = datas[i].inf;
				audioMusic.setAttribute('src', datas[i].music);

				//测试开始
				var lrcdata=datas[i].lrc,
					lrcrow=lrcdata.split(",");
				for (var f=0;f<lrcrow.length;f++){
					var ns=document.createElement('p');
					audioLrc.appendChild(ns);
					var lrcrows=music_lrc.getElementsByTagName('p');
					lrcrows[f].innerHTML=lrcrow[f];
				}

				//测试结束	
				if (timer) {
					clearInterval(timer);
				};

				// 本地存储 音乐索引
				localStorage.setItem('musicNum', i);
				localStorage.setItem('duration', 0);
				localStorage.setItem('currentTime', 0);
				
				// 按钮样式初始化
				progress.style.webkitTransform = 'rotate(180deg)';
				audioBtn.className = 'audio_btn play';
				status = true;
				
				// 角度初始化
				oldTime = 0;
				sumTime = 0;
				scrolldrag();
			}	 
		}(i);
	};		
	//获取歌词高度，当歌词高度超出是出现滚动条
	function scrolldrag(){
		var audioLrcHigh=0,
		num=1;
		audioLrcHigh=audiolrc.offsetHeight;
		if (audioLrcHigh>480){
			scroll.style.display='block';
			//实现滚动条拖动
			scrollBar.onmousedown=function(e){
				var e=event||window.event,
					oldY=e.clientY,
					conY=scrollBar.offsetTop;
					num=1;
					
				document.onmousemove=function(e){
					if(num==1){
						var newY=e.clientY,
							newtop=conY+newY-oldY;
						if(status==false){
							audioMusic.pause();	
							clearInterval(timer);
						}
						if(newtop>=400){
							newtop=400;
						}
						if(newtop<=0){
							newtop=0;
						}
						scrollBar.style.top=newtop+'px';
						music_lrc.scrollTop=550*newtop/450;
					}
				}
			}
			document.onmouseup=function(){
				num=0;
				if(status==false){
					status=true;
					controlMusic();
				}
			}
		}else{
			scroll.style.display='none';
		}
	}
})();