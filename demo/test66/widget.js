/**
 *  @createBy   baiyu3@letv.com
 *  @date       2015-09-21
 *  @desc       封装常用组件
 */
define(function(require, exports, module) {
    "use strict"; // 严格模式
    // 定义全局变量
    var $ = jQuery,
        W = window,
        shareBox = ''; // 用于存储分享小模块$("#shareBox")
    // 操蛋的百度分享组件
    var bdShareWidget = function(obj) {
        var shareTitle = '',
            shareDesc = '',
            shareUrl = '',
            sharePic = '',
            shareTpl = '<div id="shareBox" class="share_con share_list bdsharebuttonbox" style="display:none;">\
                            <a href="javascript:;" class="weixin" data-cmd="weixin" title="分享到微信"></a>\
                            <a href="javascript:;" class="xlwb" data-cmd="tsina" title="分享到新浪微博"></a>\
                            <a href="javascript:;" class="qq" data-cmd="sqq" title="分享到QQ好友"></a>\
                            <a href="javascript:;" class="qzone" data-cmd="qzone" title="分享到QQ空间"></a>\
                            <a href="javascript:;" class="renren" data-cmd="renren" title="分享到人人网"></a>\
                        </div>';
        $(document.body).append(shareTpl);
        with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
        window._bd_share_config = {
            common: {
                // onBeforeClick百度分享2.0方法：自定义分享内容（多用于同页面多个分享）
                onBeforeClick: function(cmd, config) {
                    config.bdText = "我在乐视网看了【" + shareTitle + "】 - 在线观看 - 乐视网 ，推荐！" + shareUrl;
                    config.bdDesc = shareDesc;
                    config.bdUrl = shareUrl;
                    config.bdPic = sharePic;
                    return config;
                },
                bdText: "",
                bdDesc: "",
                bdUrl: "",
                bdPic: ""
            },
            share: [{
                bdSize: 16
            }]
        }
        // 将分享模块作为jq对象存到全局变量，以便后续多分享的实现
        shareBox = $("#shareBox");
        // 处理点击事件
        obj.live('click', function() {
            $("#shareBox").removeClass('bdshare-button-style0-16');
            $("#shareBox").hide();
            var self = $(this);
            // 显示分享入口并获取分享内容
            self.parent().append(shareBox).show();
            $("#shareBox").show();
            shareTitle = self.parents(".m_con").find('.m_tit a').text();
            shareDesc = '世界那么大，你确定不来看看么？';
            shareUrl = self.attr("href");
            sharePic = self.parents(".m_con").find("img").attr("src");
            return false;
        });
        // 点击页面其他区域隐藏分享入口
        $(document).click(function() {
            $("#shareBox").hide();
        });
    };
    // 瀑布流样式的异步加载数据组件
    var ajaxLoadata = function(option) {
        var columnList = option.obj, // 容器
            style = option.style,
            order = option.order,
            loadCount = 0, // 记录已加载数据个数
            loadAll = false, // 标识是否加载完所有数据
            res = [], //用于存储ajax请求到的数据
            pageNum = 1,
            loaded = [];
        loaded[0] = false;

        function dataLoad() {
            $(".feed-loading").show();
            loaded[pageNum - 1] = true;
            $.ajax({
                url: 'http://api.my.letv.com/video/hot/pklist?style=' + style + '&order=' + order + '&page=' + pageNum + '&pagesize=30',
                type: 'get',
                dataType: 'jsonp',
                success: function(data) {
                    pageNum++;
                    if (data.code == 200) {
                        res = data.data.items;
                        loadDate();
                    }
                }
            });
        }

        function scrollLoad() {
            // 判断是否滚出可视区域
            var runHeight = $(W).scrollTop() - (columnList.offset().top + columnList.outerHeight()) + $(W).height();
            if (runHeight > 0) {
                dataLoad();
            }
        }
        scrollLoad();
        /* 滚动触发加载功能 */
        $(W).on('scroll', function() {
            if (loaded[pageNum - 1] == true) {
                return;
            }
            if (!loadAll) {
                scrollLoad();
            }
        });

        function loadDate() {
            var _data; //定义变量用于存储返回的json数据
            var newDl; //定义变量用于存放创建的新dl标签
            var loads = 0; // 记录本次已加载个数(0-30)
            var nullImgNum = 0; //记录图片地址为null的个数
            var _arr = new Array(); // 临时存储新增的数据块
            //进行获取到数组的值
            for (var i = 0; i < 30; i++) {
                if (i >= res.length) { return; }
                var _dataVinfo = res[i].videoInfo;
                var _dataUinfo = res[i].userInfo;
                // 如果本次请求到的图片地址为null结束本次循环
                if (_dataVinfo.images16_9 == null) {
                    // 如果只有一条数据并且图片地址为null，隐藏loading图标
                    if (res.length == 1) {
                        $(".feed-loading").hide();
                    }
                    nullImgNum++;
                    continue;
                }
                // 创建要插入元素dl
                newDl = $('<dl class="dl_temp">\
                                <dd class="d_img">\
                                    <a title="' + _dataVinfo.name + '" target="_blank" href="http://www.letv.com/ptv/vplay/' + _dataVinfo.vid + '.html">\
                                        <img data-src="' + _dataVinfo.images16_9 + '" alt="' + _dataVinfo.name + '" src="http://i0.letvimg.com/lc03_iscms/201509/17/14/30/2bb79a32a9304395a3db2ac234e836ee.jpg">\
                                        <i class="user_share_bg user_share_bg1"></i><i class="user_share">' + _dataVinfo.name + '</i>\
                                    </a>\
                                </dd>\
                                <dd class="d_user">\
                                <span class="ugc_user_img"><img src="' + _dataUinfo.picture + '" alt="' + _dataUinfo.nickname + '"><i class="user_img_bg"></i></span>\
                                <p class="ugc_user_msg">\
                                    <span class="user_name" title="' + _dataUinfo.nickname + '">' + _dataUinfo.nickname + '</span>\
                                    <span class="user_info"><i><b></b><em class="j-playcount">' + _dataVinfo.play_count + '</em></i><i class="time_num"><b></b><em class="j-playcount">' + _dataVinfo.duration + '</em></i></span>\
                                </p></dd>\
                          </dl>');
                /* 图片延迟加载 */
                var img = new Image();
                img.src = newDl.find('.d_img img').attr('data-src');
                newDl.find('.d_img img').attr('src', img.src);
                _arr.push(newDl);
                img.onload = function() {
                    loads++;
                    function showData() {
                        $(".feed-loading").hide();
                        for (var j in _arr) {
                            //将创建的标签插入到相应的位置中
                            columnList.append(_arr[j]);
                            _arr[j].fadeIn();
                        }
                        // 清空临时数组
                        _arr = [];
                        loadCount = columnList.find('dl').length;
                    }
                    if (res.length >= 30) {
                        // 加载完成30张图片时，显示图片
                        if (loads == 30 - nullImgNum) {
                            showData();
                        }
                    } else {
                        if (loads == res.length - nullImgNum) {
                            loadAll = true;
                            showData();
                        }
                    }
                }
                /* 图片预加载end */
            }
        }
    };
    // 瀑布流
    var waterLoadata = function() {
        var loadCount = 0; // 记录已加载数据个数
        var runload = true; // 标识是否执行瀑布流加载
        var loadAll = false; // 标识是否加载完所有数据
        var res = []; //用于存储ajax请求到的数据
        var pageNum = 1;
        var loaded = [];
        loaded[0] = false;

        function dataLoad() {
            loaded[pageNum - 1] = true;
            $.ajax({
                url: 'plugin.php?id=letv_activity:shijia&action=getlist&order=new&inajax=1&ajaxdata=json&page=' + pageNum + '&count=10',
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    pageNum++;
                    if (data.message == 'ok') {
                        res = data.data;
                        loadDate();
                    }
                }
            });
        }

        function scrollLoad() {
            if (loadAll) {
                $(".player .to_load").addClass("hidden");
                return false;
            }
            if (!loadAll && runload) {
                //文档总高度减去当前已经滚动过去的距离，再减去window的高度
                var loadHeight = $(document).height() - $(this).scrollTop() - $(this).height();
                //如果滚动到可视区域，则进行数据的加载
                var runHeight = $(".Banner").height() + $(".thisweek").height() + $(".fans").height() + $(".Foot").height() + 200;
                if (loadHeight < runHeight) {
                    if (loadCount >= 30) {
                        if (loadAll) {
                            $(".player .to_load").addClass("hidden");
                        } else {
                            $(".player .to_load").removeClass("hidden");
                        }
                    } else {
                        dataLoad();
                    }
                }
            }
        }
        scrollLoad();
        /* 滚动触发加载功能 */
        $(window).scroll(function() {
            if (loaded[pageNum - 1] == true) {
                return false;
            }
            scrollLoad();
        });
        /* 点击触发加载功能 */
        if ($(".player .to_load a").length > 0) {
            $(".player .to_load a").on('click', function() {
                if (!loadAll && runload) {
                    $(".player .to_load a").text("玩命加载中...");
                    if (loaded[pageNum - 1] == true) {
                        return false;
                    }
                    dataLoad();
                }
            });
        }

        function loadDate() {
            var _data; //定义变量用于存储返回的json数据
            var newDl; //定义变量用于存放创建的新dl标签
            var newPos; //定义需要将新块放置到的新位置
            var newHeight; //用于检测最小高度
            var nowColHeight; //用于存储新块的高度
            var loads = 0; // 记录本次已加载个数(0-10)
            var _arr = new Array(); // 临时存储新增的数据块
            //进行获取到数组的值
            for (var i = 0; i < 10; i++) {
                if (i >= res.length) {
                    $(".player .to_load").addClass("hidden");
                    return false;
                }
                var _data = res[i];
                /*确定newPos是什么，即将新的div放置在哪里*/
                //找到高度最小的列，将这个新的块放置在这个列下面
                function minLen() {
                    newHeight = -1;
                    //用each遍历数组。对jQuery对象进行迭代，为每个匹配元素执行函数
                    $('.new_apply .column').each(function() {
                        //首先获取每一个列的高度
                        nowColHeight = Number($(this).height());
                        //比较5个列的高度
                        if (newHeight == -1 || newHeight > nowColHeight) {
                            //保证newHeight永远存储的是最小列的高度
                            newHeight = nowColHeight;
                            //利用this选中高度最小的那个列(newHeight)
                            newPos = $(this);
                        }
                    });
                }
                if (runload) {
                    var redGray = '';
                    if (_data.haspraised == true) {
                        redGray = 'clicked';
                    }
                    newDl = $('<dl tid="' + _data.tid + '" style="display:none;"><dd class="pic"><a href="/forum.php?mod=viewthread&tid=' + _data.tid + '"><img src="' + _data.photos + '"></a></dd><dd class="name">' + _data.realname + '</dd><dd class="detail"><span class="age">' + _data.age + '岁</span>，<span class="home">' + _data.resideprovince + '</span>，<span class="cm">' + _data.height + '</span>，<span class="work">' + _data.occupation + '</span>，<span class="edu">' + _data.education + '</span>，<span class="sign">' + _data.constellation + '</span></dd><dd class="menu"><a href="javascript:;" class="attention ' + redGray + '">' + _data.praise + '</a><em>|</em><a href="/forum.php?mod=viewthread&tid=' + _data.tid + '" class="review">' + _data.replies + '</a><em>|</em><a href="/forum.php?mod=viewthread&tid=' + _data.tid + '" class="more" target="_blank">更多</a></dd></dl>');
                    /* 图片预加载 */
                    src = "file:///C:/Users/baiyu3/Desktop/%E5%8D%81%E5%AB%8177/%E5%8D%81%E5%AB%81/images/player_pic2.jpg"
                    img
                    var img = new Image();
                    img.src = newDl.find('img').attr('imgsrc');
                    newDl.find('img').attr('src', img.src);
                    _arr.push(newDl);
                    img.onload = function() {
                        loads++;

                        function showData() {
                            for (j in _arr) {
                                minLen();
                                //将创建的标签插入到相应的位置中
                                newPos.append(_arr[j]);
                                _arr[j].fadeIn();
                            }
                            // 清空临时数组
                            _arr = [];
                            $(".player .to_load a").text("点击加载更多");
                            loadCount = $("#player dl").length - $("#player #hidden dl").length;
                        }
                        if (res.length >= 10) {
                            // 加载完成10张图片时，显示图片
                            if (loads == 10) {
                                showData();
                            }
                        } else {
                            if (loads == res.length) {
                                loadAll = true;
                                showData();
                            }
                        }
                    }
                    /* 图片预加载end */
                }
            }
        }
    };
    // 弹层组件
    var popWindow = {
        /*
         * @param context   String   required 提示语 
         * @param title     String   optional 提示标题 默认是“提示”
         * @param callback1 function optional 回调函数,点击确定后的执行函数
         * @param callback2 function optional 回调函数,点击取消后的执行函数
         * @param butext1   String   optional 确定按钮上的文字  默认值是“确定”
         * @param butext2   String   optional 取消按钮上的文字  默认值是“取消”
         */
        alert: function(title, context, butext1, callback1, butext2, callback2) {
            var title = title ? title : '提示';
            var context = context.toString();
            var butext1 = butext1 ? butext1 : '确认';
            var butext2 = butext2 ? butext2 : '';
            var btn2 = '', marT = '40';
            if (context != '') {marT = '20';}
            if (butext2 != '') {
                btn2 = '<a href="javascript:;" class="ugc_confirm_btn link ugc-cancel gray marL25">'+butext2+'</a>';
            }
            var dom = '<div class="ui_window pop-txt" id="pop-window" style="z-index: 900001; visibility: visible; width:400px; height: 200px; position: fixed; top: 50%; left:50%; display: none;">\
                            <div class="ui_pop_box ugc_popbox">\
                                <div class="ui_pop_head_btn_close j-close ugc_popclose_btn pop-close"></div>\
                                    <div class="ui_pop_body ugc_pop_round">\
                                    <div class="j-content">\
                                        <div class="ugc_pop_content">\
                                            <dl class="ugc_pop_main">\
                                                <dt class="ugc_poptip_img"></dt>\
                                                <dd>\
                                                    <h5 class="ugc_pop_tit">'+title+'</h5>\
                                                    <div>'+context+'</div>\
                                                </dd>\
                                            </dl>\
                                            <div class="ugc_pop_btns">\
                                                <a href="javascript:;" class="ugc_confirm_btn button ugc-continue marT'+marT+'">'+butext1+'</a>'+btn2+'\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>';
            //显示
            $('body').append(dom);
            $('#pop-window').css('margin-left', '-' + $('#pop-window').width() / 2 + 'px');
            $('#pop-window').css('margin-top', '-' + $('#pop-window').height() / 2 + 'px');
            $(document.body).append('<div id="shadowlayer" style="opacity: 0.4; filter:alpha(opacity=40); overflow: hidden; width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: 9000; display: block; background: none 0px 0px repeat scroll rgb(0, 0, 0);"><iframe style="position:absolute;width:100%;height:100%;filter:alpha(opacity=40);opacity=0.4;border-style:none;"></iframe></div>');
            $('#pop-window').show();
            //事件
            $('#pop-window .pop-close').on('click',function(event) {
                $('#shadowlayer').remove();
                $('#pop-window').remove();
            });
            $('#pop-window a.button').on('click',function(event) {
                $('#shadowlayer').remove();
                $('#pop-window').remove();
                if (callback1) {
                    callback1();
                }
            });
            if (!$('#pop-window .link')) {return;}
            $('#pop-window .link').click(function(event) {
                $('#shadowlayer').remove();
                $('#pop-window').remove();
                if (callback2) {
                    callback2;
                }
            });
        }
    }
    // 小组件
    var widget = {
        init: function() {
            formatCount(315648484);
        },
        /**乐视登录检测**/
        letvLogin: function() {
            //登录检测
            if(!Spirit.UserValidate.getUserInfo()) {
                Spirit.userLogin.openLetvLogin();
                var Event = window['Spirit'].Event;
                var eventid = Event.addEvent('loginSuccess', function(data){
                    window.location.reload();
                });
                return;
            }
        },
        /**数据格式化**/
        formatCount: function(num) {
            var _count = num + '';
            if (_count.length >= 7) {
                _count = _count.substring(0, 2) + '万'
            } else if (_count.length >= 4) {
                _count = _count.split('');
                for (var i = 0, len = _count.length; i < len; i++) {
                    if (i == len - 4) {
                        _count[i] = _count[i] + ',';
                    }
                }
                _count = _count.join('');
            }
            return _count;
        },
        /**数组去重**/
        unique: function (arr){
            var ret = [];
            var obj = {};
            for (var i = 0; i < arr.length; i++) {

                var item = arr[i];
                var key = typeof(item) + item;

                if (obj[key] !== 1) {
                    ret.push(item);
                    obj[key] = 1;
                }
            }
            return ret;
        },
        /**文本超出隐藏**/
        textHide: function(contents) {
            contents.each(function(index, obj) {
                if ($(obj).text().length >= 8) {
                    $(obj).text($(obj).text().substring(0, 7) + '...');
                }
            });
        },
        //注册时邮箱自动填充
        emailAutocomplate: function() {
            var elt = $('#email');
            var autoComplete, autoLi;
            autoComplete = $('.handy-dropdowncen:not(".not")');
            autoComplete.data('elt', elt);
            autoLi = autoComplete.find('a');

            autoLi.mouseover(function() {
                $(this).siblings().filter('.hover').removeClass('hover');
                $(this).addClass('hover');
            }).mouseout(function() {
                $(this).removeClass('hover');
            }).mousedown(function() {
                autoComplete.data('elt').val($(this).text()).change();
                autoComplete.hide();
            });

            elt.keyup(function(e) {
                if (/13|38|40|116/.test(e.keyCode) || this.value == '') {
                    if (this.value == '') {
                        $(this).prev().show();
                        autoComplete.hide();
                    }
                    return false;
                }
                var email = $.trim(this.value);
                autoLi.each(function() {
                    var data_mail = $(this).attr('data-mail');
                    this.innerHTML = '<span>' + email.replace(/\@+.*/, '') + '</span>' + data_mail;
                    var mailType = email.split('@', 2);
                    if (mailType[1] && data_mail.indexOf(mailType[1]) != -1) {
                        autoLi.removeClass('hover');
                        $(this).addClass('hover');
                    }
                });
                autoLi.filter(".hover").length || $(autoLi[0]).addClass('hover');
                autoComplete.show();
            }).keydown(function(e) {
                if (e.keyCode == 38) { //上
                    if(autoLi.filter('.hover').prev('a').length>0){
                        autoLi.filter('.hover').prev().addClass('hover').next().removeClass('hover');
                    }
                } else if (e.keyCode == 40) { //下
                    if(autoLi.filter('.hover').next('a').length>0){
                        autoLi.filter('.hover').next().addClass('hover').prev().removeClass('hover');
                    }
                } else if (e.keyCode == 13) { //Enter
                    autoLi.filter('.hover').mousedown();
                    e.preventDefault(); //如有表单，阻止表单提交
                }
            }).focus(function() {
                autoComplete.data('elt', $(this));
            }).blur(function() {
                autoComplete.hide();
            });
        },
        /**自定义滚动条**/
        scrollBar: function(dom){
            var scrollInfo = $(dom).find(".list.active ul")[0];
            var scrollRoll = $(dom).find(".list.active")[0];
            var scrollBar =$(dom).find(".list.active .scr-post")[0];
            // 不足一屏隐藏滚动条and不执行滚动
            if (scrollInfo.offsetHeight > scrollRoll.offsetHeight) {
                $(scrollBar).parent().show();
            } else{
                $(scrollBar).parent().hide();
                return;
            }
            scrollBar.onmousedown=function(ev){
                var oEvent = ev||event;
                var disY = oEvent.clientY-scrollBar.offsetTop;
                document.onmousemove=function(ev){
                    var oEvent = ev||event;
                    var t = oEvent.clientY-disY;
                    setTop(t);
                };
                document.onmouseup=function(){
                    document.onmousemove=null;
                    document.onmouseup=null;
                    scrollBar.releaseCapture&&scrollBar.releaseCapture();
                };
                scrollBar.setCapture&&scrollBar.setCapture();
                return false;
            };
            addWheel(dom,function(bOk){
                var t = scrollBar.offsetTop;
                if(bOk){
                    //下
                    t+=10;
                }else{
                    //上
                    t-=10;
                }
                setTop(t);
            });

            function setTop(t){
                if (t<0) {
                    t=0;
                }else if (t>scrollRoll.offsetHeight-scrollBar.offsetHeight) {
                    t = scrollRoll.offsetHeight-scrollBar.offsetHeight;
                }
                scrollBar.style.top = t+'px';
                var scale = t/(scrollRoll.offsetHeight-scrollBar.offsetHeight);
                scrollInfo.style.top = -scale*(scrollInfo.offsetHeight-scrollRoll.offsetHeight)+'px';
            }

            function addWheel(obj,fn){
                function fnWheel(ev){
                    var oEvent = ev||event;
                        //bOk
                        var bOk = true;
                        if(oEvent.wheelDelta){
                            //wheelDelta
                            if(oEvent.wheelDelta<0){
                                bOk=true;
                            }else{
                                bOk=false;
                            }
                        }else{
                            //detail
                            if(oEvent.detail>0){
                                bOk=true;
                            }else{
                                bOk = false;
                            }
                        }
                        //操作
                        fn&&fn(bOk);
                        oEvent.preventDefault&&oEvent.preventDefault();
                        return false;
                }
                //添加滚轮事件
                if(window.navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){
                    obj.addEventListener('DOMMouseScroll',fnWheel,false);
                }else{
                    obj.onmousewheel=fnWheel;
                }
            }
        },
        /**无缝滚动**
         *
         *   this.slide({
         *      autoScroll: 1,
         *      slideBox: $(".live_box"),
         *      slideShowArea: $(".live_slide_box"),
         *      slideContent: $(".slide_list"),
         *      slideLeftBtn: $(".slide_btn_left"),
         *      sliderightBtn: $(".slide_btn_right"),
         *      cellBlock: $(".live_box .slide_list dl"),
                showCount: 5
         *   });
         *
        **/
        slide: function(options){
            var autoScroll = options.autoScroll,
                slideBox = options.slideBox,
                cellblock = options.cellBlock,
                leftBtn = options.slideLeftBtn,
                rightBtn = options.sliderightBtn,
                showArea = options.slideShowArea,
                slideCon = options.slideContent,
                cellblockWidth = cellblock.eq(0).width(),
                tabWidth = showArea.width(),
                BigWidth = cellblock.length*cellblockWidth - tabWidth,
                _left = 0,
                time = null;
            if (cellblock.length<= options.showCount) {
                leftBtn.css('display','none');
                rightBtn.css('display','none');
            }else{
                slideBox.hover(function() {
                    leftBtn.show();
                    rightBtn.show();
                }, function() {
                    leftBtn.hide();
                    rightBtn.hide();
                });
            }
            leftBtn.live('click',function(){
                tabWidth = showArea.width();
                tabWidth = Math.abs(_left) > tabWidth ? tabWidth : Math.abs(_left);
                _left += tabWidth;
                slideCon.stop().animate({left: _left}, 300);
            });
            rightBtn.live('click',function(){
                tabWidth = showArea.width();
                tabWidth = (BigWidth - Math.abs(_left)) < tabWidth ? (BigWidth - Math.abs(_left)) : tabWidth;
                _left -= tabWidth;
                slideCon.stop().animate({left:_left}, 300);
            });
            if (autoScroll) {
                autoPlay();
                function autoPlay() {
                    time = setInterval(function() {
                        rightBtn.click();
                    },3000);
                }
                slideBox.mouseleave(function() {
                    autoPlay();
                });
                slideBox.mouseenter(function() {
                    clearInterval(time);
                });
            }
        },
        /**焦点图滚动**/
        focus: function(options) {
            var _options = {
                container: '.p_img',
                pics: '.p_img li',
                btns: '.p_tab li',
                autoMatic: 3
            }
            _options = $.extend({}, _options, options);

            var container = $(_options.container),
                pics = $(_options.pics),
                btns = $(_options.btns),
                autoMatic = _options.autoMatic;

            var containerWidth = pics.eq(0).width();

            var _index = 0;

            btns.each(function(index, obj) {
                $(obj).on('click', function() {
                    btns.removeClass('selected').eq(index).addClass('selected');
                    container.animate({
                        left: -(containerWidth * index)
                    });
                    _index = index;
                })
            });

            (function next() {
                setTimeout(function() {
                    if (container.hasClass('stop')) return next();;
                    if (_index == btns.length) _index = 0;
                    btns.removeClass('selected').eq(_index).addClass('selected');
                    container.animate({
                        left: -(containerWidth * _index)
                    });
                    _index++;
                    next();
                }, 3000);
            }());

            container.on('mouseenter', function() {
                $(this).addClass('stop');
            }).on('mouseleave', function() {
                $(this).removeClass('stop');
            });
        },
        /**焦点图淡入淡出**/
        fade: function(defaultOpts) {
            var defaultOpts = {
                interval: 3000, // 每隔3s轮播一次
                fadeInTime: 300, // 淡入时间：300ms
                fadeOutTime: 300 // 淡出时间：300ms
            };
            var _titles = $(".focus_box .focus_ico li");
            var _bodies = $(".focus_box .slide-pic li");
            var _count = _titles.length;
            var _current = 0;
            // 从中间开始轮播
            if (_count % 2 == 0) {
                _current = _count / 2 - 1;
            } else {
                _current = (_count - 1) / 2;
            }
            var _intervalID = null;
            // 清除计时器，停止轮播
            var stop = function() {
                window.clearInterval(_intervalID);
            };
            // 图片淡入淡出
            var slide = function(opts) {
                if (opts) {
                    _current = opts.current || 0;
                } else {
                    _current = (_current >= (_count - 1)) ? 0 : (++_current);
                };
                _bodies.filter(":visible").fadeOut(defaultOpts.fadeOutTime, function() {
                    _bodies.eq(_current).fadeIn(defaultOpts.fadeInTime);
                    _bodies.removeClass("cur").eq(_current).addClass("cur");
                });
                _titles.removeClass("cur").eq(_current).addClass("cur");
            };
            // 开始轮播
            var go = function() {
                stop();
                _intervalID = window.setInterval(function() {
                    slide();
                }, defaultOpts.interval);
            };
            // 鼠标移上停止轮播
            var itemMouseOver = function(target, items) {
                stop();
                var i = $.inArray(target, items);
                slide({
                    current: i
                });
            };
            // 鼠标hover分页点上轮播到相应图片
            _titles.hover(function() {
                if ($(this).attr('class') != 'cur') {
                    itemMouseOver(this, _titles);
                } else {
                    stop();
                }
            }, go);
            _bodies.hover(stop, go);
            go();
        },
        /**删除左右两端的空格**/
        trim: function(str) {
            if (!str) return;
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        /**限制输入小数点后n位**/
        limit: function(input, n) {
            input.bind('keyup', function() {
                // 限制输入小数点后两位
                $(this).value(value.replace(/\.\d{2,}$/, value.substr(value.indexOf('.'), 3)));
            });
        },
        /**获取url中某个参数**/
        getActivityId: function() {
            /activityid=(.+)(?:&|$)/.test(window.location.search)
            return RegExp.$1 || 0;
        }
        widget.init();
    }
    /**入口**/
    module.exports = functionName;
});