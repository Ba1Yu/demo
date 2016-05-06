// define(function(){
var getShare = function() {
	var dtd = $.Deferred();
	var cdn = "http://js.letvcdn.com/lc01_iscms/201510/15/12/57/qrcode.js";
	$.getScript(cdn).done(function() {
		dtd.resolve(_share);
	});
	function _share(customOpt) {
		var defOpt = {
			listenItem: "[share-type]",
			shareContent: {
				//分享内容
				title: '写在为文本框title字段',
				url: 'http://www.so.com',
				pic: 'http://p8.qhimg.com/t018046aa17e3b8d53b.png',
				//空间的标题
				desc: '写在标题里的desc字段'
			},
			shareUrl: {
				qq: 'http://connect.qq.com/widget/shareqq/index.html',
				sina: 'http://service.weibo.com/share/share.php',
				qweibo: 'http://share.v.t.qq.com/index.php',
				qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
				renren: 'http://widget.renren.com/dialog/share'
			},
			params: {
				sina: {
					appkey: '1343713053',
					serchPic: true
				},
				qzone: {},
				qq: {
					site: 'letvcdn'
				},
				qweibo: {
					c: 'share',
					a: 'index',
					appkey: '801cf76d3cfc44ada52ec13114e84a96'
				}
			},
			//不同的分享参数可能有所不同，这里做个转换
			kmap: {
				qzone: {
					pic: 'pics',
					title: 'desc'
				},
				reren: {
					url: 'resourceUrl',
					desc: 'description'
				},
				qq: {
					pic: 'pics'
				}
			}
		}
		var opt = $.extend({}, defOpt, opt);
		var rooter = $(document.body);
		function getQRcode(opt) {
			var qrwrap = $('<div class="qrcode"></div>');
			function supportCanvas() {
				return !!document.createElement('canvas').getContext;
			}
			function toUtf8(str) {
				var out, i, len, c;
				out = "";
				len = str.length;
				for (i = 0; i < len; i++) {
					c = str.charCodeAt(i);
					if ((c >= 0x0001) && (c <= 0x007F)) {
						out += str.charAt(i);
					} else if (c > 0x07FF) {
						out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
						out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
						out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
					} else {
						out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
						out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
					}
				}
				return out;
			}
			qrwrap.qrcode({
				render: supportCanvas() ? "canvas" : 'table',
				width: opt.width || 150,
				height: opt.height || 150,
				text: toUtf8(opt.text) || 'no'
			});
			return qrwrap;
		}

		function bindEvt(delegateEl, handlde) {
			//delegateEl  "[data-tag=delegateEl]"
			var tag;
			if (delegateEl) {
				tag = "[data-tag=" + delegateEl + "] " + opt.listenItem;
			} else {
				tag = opt.listenItem;
			}
			rooter.on('click', tag, function(e) {
				var shareType = $(this).attr('share-type');
				if (shareType == 'weixin') {
					var qrwrap = $('<div class="qrcode"></div>');
					//微信如果输入中文必须转化成utl8
					handlde($(this), opt.shareContent, getQRcode);
				} else {
					var customeShareContent = handlde($(this), opt.shareContent);
					var params = $.extend(opt.params[shareType], customeShareContent);

					//过滤空的参数
					$.map(params, function(v, k) {
						if (!v) {
							delete params[k]
						}
					});

					//这里做一个键值转换，用来适应不同地址的分享参数不同
					var kmap = opt.kmap[shareType];
					if (kmap) {
						$.map(kmap, function(k, v) {
							var _tk = params[k];
							var _tv = params[v];

							//名称互换
							if (_tk && _tv) {
								params[k] = _tv;
								params[v] = _tk;
							} else {
								//名称改写
								_tv && (params[k] = _tv);
								delete params[v];
							}
						});
					}
					var shareUrl = opt.shareUrl[shareType] + '?' + $.param(params);
					if (this.tagName === 'A') {
						this.target = "_blank";
						this.href = shareUrl;
					} else {
						left = (screen.width - 900) / 2;
						top = (screen.height - 760) / 2;
						window.open(shareUrl, '', ('width=900, height=760, top=' + top + ', left=' + left + ', toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=yes, status=no'));
					}
				}
			});
		}
		function bindGlobal(copt) {
			bindEvt(null, copt.onBeforeClick);
		}

		function bindOne(copt) {
			bindEvt(copt.delegateEl, copt.onBeforeClick)
		}

		function bindSome(ary) {
			$.each(ary, function(i, oneOpt) {
				if (!oneOpt.delegateEl) {
					return
				} else {
					bindOne(oneOpt);
				}
			})
		}

		function removeEvt(delegateEl) {
			var tag;
			if (delegateEl) {
				tag = "[data-tag=" + delegateEl + "] " + opt.listenItem;
			} else {
				tag = opt.listenItem;
			}
			rooter.off('click', tag);
		}
		function removeSome(ary) {
			$.each(ary, function(i, el) {
				removeEvt(el);
			});
		}
		function removeOne(el) {
			removeEvt(el);
		}
		function removeGlobal() {
			removeEvt()
		}
		return {
			add: function(prop) {
				if ($.isPlainObject(prop) && !$.isEmptyObject(prop)) {
					if (prop.delegateEl && prop.onBeforeClick) {
						bindOne(prop)
					}
					if (!prop.delegateEl && prop.onBeforeClick) {
						bindGlobal(prop)
					}
				}
				if ($.isArray(prop)) {
					//过滤不符合规范的空对象
					$.grep(prop, function(el) {
						return el.delegateEl && el.onBeforeClick;
					});

					bindSome(prop)
				}
				return this;
			},
			remove: function(prop) {
				if (!prop) {
					removeGlobal();
				}
				if (typeof prop == 'string') {
					removeOne(prop)
				}
				if ($.isArray(prop)) {
					//过滤不符合规范的空对象
					$.grep(prop, function(el) {
						return !!el;
					});
					removeSome(prop);
				}
				return this;
			}
		}
	}
	return dtd.promise();
}

// return share;
// });