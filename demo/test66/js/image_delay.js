/**
 *	@name	    imageDelay
 *	@desc		图片懒加载组件
 *	@author		Rain66<baiyu3@letv.com>
 *	@use 		
 *				require(['common/image_delay/image_delay'],function (image_delay) {
 *					var imgLoader = image_delay;
 *					//常规用法 
 *					imgLoader.init();
 *
 *					//异步加载的图片绑定懒加载
 *					imgLoader.add($(selector).find('img'));
 *					
 *					//清除add绑定的事件
 *					imgLoader.del();
 *
 *					//预加载指定容器内的图片
 *					imgLoader.fast($(selector).find('img'));
 *					
 *				});
*/
define(function(){

	var imageDelay = function(){
		var w = window,
			d = document,
			winHeight = d.documentElement.clientHeight,
			scrollTop = d.documentElement.scrollTop || d.body.scrollTop;
			
		var addEvent = function(obj, evt, fn){(obj.addEventListener) ? obj.addEventListener(evt, fn, false) : obj.attachEvent('on' + evt, fn)};
		var removeEvent = function(obj, evt, fn){(obj.removeEventListener) ? obj.removeEventListener(evt, fn, false) : obj.detachEvent('on' + evt, fn)};
		var getElementTop = function(ele){
			var _ele = 0;
			try{
				_ele = ele.getBoundingClientRect().top + scrollTop;
			} catch(e){};
			return _ele;
		};
		var getImgs = function(){
			if(d.querySelectorAll){
				return d.querySelectorAll('img[data-src]');
			}else{
				var _imgs = d.getElementsByTagName('img'),
					_arr = [];
				for(var i = 0, len = _imgs.length; i < len; i++){
					if(_imgs[i].getAttribute('data-src')) _arr.push(_imgs[i]);
				}
				return _arr;
			}
		}

		addEvent(w,'resize',function(){winHeight = d.documentElement.clientHeight});
		addEvent(w,'scroll',function(){scrollTop = d.documentElement.scrollTop || d.body.scrollTop;});
		
		var event = function(){
			var subscribers = [];
			return {
				sub: function(evt, fn){
					subscribers[evt] ? subscribers[evt].push(fn) : (subscribers[evt] = []) && subscribers[evt].push(fn);
					return '{"evt":"' + evt +'","fn":"' + (subscribers[evt].length - 1) + '"}';
				},
				pub: function(evt, args){
					if(subscribers[evt]){
						var ev = subscribers[evt];
						for(var i = 0, len = ev.length; i < len; i ++){
							if(typeof(ev[i]) === 'function'){
								ev[i](args);
							}
						}
						return this;
					}
					return false;
				}
			}
		}();
		
		var init = function(){
			var cache = function(imgs){
				var _obj = {};
				for(var i = 0, len = imgs.length;i < len;i++){
					var top = getElementTop(imgs[i]);
					if( _obj[top]){
						_obj[top].push(imgs[i])
					}else{
						_obj[top] = [imgs[i]];
					}
				}
				return _obj;
			}
			
			var reset = function(obj){
				var _obj = {};
				for(var key in obj){
					for(var i = 0, data = obj[key], len = data.length; i < len; i++){
						if(data[i].src) continue;
						var top = getElementTop(data[i]);
						if( _obj[top]){
							_obj[top].push(data[i])
						}else{
							_obj[top] = [data[i]];
						}
					}
				}
				return _obj;
			}
			
			var bindEvent = function(obj, type){
				var scroll = function(){
					for(var key in obj){
						if(scrollTop + winHeight >= key){
							for(var i = 0, data = obj[key], len = data.length; i < len; i++){
									data[i].src = data[i].getAttribute('data-src');
							}
							delete obj[key];
						}
					}
				}
				addEvent(w, 'scroll', scroll);

				if(type){
					event.sub('removeScrollGlobal', function(){
						removeEvent(w, 'srcoll', scroll);
					})
				}else{
					event.sub('removeScroll', function(){
						removeEvent(w, 'srcoll', scroll);
					})
				}

				scroll();
			}
			
			return {
				init: function(){
					var timer = null,
						obj = cache(getImgs());
					var resize = function(){
						clearTimeout(timer);
						timer = setTimeout(function(){
							event.pub('removeScrollGlobal');
							bindEvent(reset(obj), true);
						}, 300);
					}
					bindEvent(obj, true);
					addEvent(w, 'resize', resize);
				},
				add: function(aImages){
					var timer = null,
						obj = cache(aImages);
					var resize = function(){
						clearTimeout(timer);
						timer = setTimeout(function(){
							event.pub('removeScroll');
							bindEvent(reset(obj));
						}, 300);
					}
					bindEvent(obj);
					addEvent(w, 'resize', resize);
					event.sub('removeResize',function(){removeEvent(w, 'resize', resize)});
					return this;
				},
				del: function(){
					event.pub('removeScroll');
					event.pub('removeResize');
					return this;
				},
				fast: function(aImages){
					for(var i = 0;i < aImages.length;i++){
							aImages[i].src  = aImages[i].getAttribute('data-src');
					}
					return this;
				}
			}
		}
		
		return init();
	}

	return imageDelay();
});