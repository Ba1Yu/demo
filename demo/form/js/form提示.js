(function(){
	var na=document.getElementById('name'),
		pass=document.getElementById('pass'),
		pas=document.getElementById('pa_cha'),
		nam=document.getElementById('na_cha'),
		btn=document.getElementById('btn');
	//用户名区域输入内容时功能函数
	na.oninput = function(){
		var xhr=new XMLHttpRequest(),
		    url='data/c.json';
		xhr.open('get',url,true);
		xhr.send(null);
		
	//从josn调取数据
		xhr.onload=function(){
			var cha= JSON.parse(xhr.responseText);
			if(na.value==cha[3].dis){
				nam.innerHTML='已存在！'
				btn.style.background='url("images/form_btn1.jpg")';
			}else{
				nam.innerHTML='可以使用'
				btn.style.background='url("images/form_btn.jpg")';
			}
		}
	}
})();
