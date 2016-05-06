$(function (){
	/*
	 *调用时钟函数，给指针初始化位置
	 */
	clock();
	/*
	 *设置一个计时器，每过一秒重新获取一下时间，对时针分针秒针进行角度设置
	 */
	 function clock(){
		var	time = new Date(),
			h = time.getHours()%12,//获取当前小时
			m = time.getMinutes(),//获取当前分
			s = time.getSeconds();//获取当前秒
		$('.hour').css({
			'-webkit-transform':'rotate('+h*30+'deg)'
		});
		$('.minute').css({
			'-webkit-transform':'rotate('+m*6+'deg)'
		});
		$('.sec').css({
			'-webkit-transform':'rotate('+s*6+'deg)'
		});
	}
	setInterval(clock,1000);
});