(function () {
	var hoursBox = document.getElementById('con_hour'),
		minutesBox = document.getElementById('con_min'),
		secondsBox = document.getElementById('con_sec'),
		hours = hoursBox.getElementsByTagName('p'),
		minutes = minutesBox.getElementsByTagName('p'),
		seconds = secondsBox.getElementsByTagName('p'),
		timer = null;

	// 清除计时器，防止出现计时器叠加
	clearInterval(timer);

	timer = setInterval(time,1000);	// 计时器，每隔1s调用一次函数time()

	/*
	 * 名称：time
	 * 作用：获取当前时间，把获取到的数据添加到相应立体块中
	 * 原理：通过创建新Date()对象,获取当前时间，
	 * 关系：被计时器timer调用
	 */
	function time() {
		var date = new Date(),
			h = date.getHours(),	// 存放当前时间点的小时
			m = date.getMinutes(),	// 存放当前时间点的分数
			s = date.getSeconds();	// 存放当前时间点的秒数
		
		// 判断当前时间点中有没有小于10的数值，如果有，则在该数前添加一个0
		if(h < 10){
			h = '0' + h;
		}
		if(m < 10){
			m = '0' + m;
		}
		if (s < 10) {
			s = '0' + s;
		}

		// 用for循环遍历所有p标签，为p标签添加处理后的时间点数据
		for (var i = 0, len = seconds.length; i < len; i++){
			
			hours[i].innerHTML = h;
			minutes[i].innerHTML = m;
			seconds[i].innerHTML = s;
		}
	}
	time();
})();

	
