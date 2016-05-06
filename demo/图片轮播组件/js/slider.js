/*
 * jquery Plugin slider
 * created by baiyu
 * 2015-6-10
 */

(function($) {
    $.fn.lsSwitch = function(options) {
        //默认参数
        var defaults = {
            effect: 'fade', //轮播效果
            move: 1,
            display_num: 1, //显示几个
            speed: 500, //切换时长
            auto: false, //是否自动播放
            interval: 3000, //自动滚动延时
            direct: 'next', //滚动方向
            slider_btn: true, //焦点控制器
            controls: true //左右切换
        };
        var options = $.extend(defaults, options);

        var Container = $(this);
        var Set = $(this).find('ul');
        var Item = Set.find('li');
        var ow = Container.width();
        var oh = Container.height();

        var first = 0;
        var last = options.display_num - 1;

        var is_working = false; //滚动冲突解决状态
        var j = ''; //自动轮番计时器

        //延迟加载兼容
        var imgs = $("img", $(this));
        imgs.each(function() {
            if (typeof $(this).attr("imgsrc") != "undefined") {
                $(this).attr("src", $(this).attr("imgsrc")).removeAttr("imgsrc");
            }
        });
        if (Item.length < 2) {
            return false;
        }
        switch (options.effect) {
            case "fade":
                fade();
                autoPlay();
                break;
            case "top":
                top();
                autoPlay();
                break;
            default:
                left();
                autoPlay();
                break;
        };

        function left() {
            set_slider();
            Item.css({
                'float': 'left',
                'listStyle': 'none',
                'width': ow + 'px'
            });
            Set.css({
                'width': (Item.length + 1) * Item.width() + 'px'
            });

            var joinItems = Item.slice(0, options.display_num).clone();
            Set.empty().append(joinItems);

            //对前后衔接处理
            spliceLast();
            spliceFirst();

            var seg = ow * options.move;
            Set.css({
                'position': 'relative',
                'left': '-' + seg + 'px'
            });
        }

        function top() {
            set_slider();
            Item.css({
                'float': 'left',
                'listStyle': 'none',
                'height': oh + 'px'
            });
            Set.css({
                'height': (Item.length + 1) * Item.height() + 'px'
            });

            var joinItems = Item.slice(0, options.display_num).clone();
            Set.empty().append(joinItems);
            spliceLast();
            spliceFirst();

            var seg = oh * options.move;
            Set.css({
                'position': 'relative',
                'top': '-' + seg + 'px'
            });
        }

        function fade() {
            set_slider();
            Item.css({
                'float': 'left',
                'listStyle': 'none'
            });
        }

        function start_slide() {
            if (options.direct == 'next') {
                j = setInterval(function() {
                    slide_next();
                }, options.interval);
            } else {
                j = setInterval(function() {
                    slide_prev();
                }, options.interval);
            }
        }

        function set_slider() {
            if (options.controls) {
                set_control();
            }

            if (options.slider_btn) {
                Container.append('<div class="slider-page"><span class="select"><a hidefocus="true">H</a></span></div>');
                for (var i = 1; i < Item.length; i++) {
                    $('.slider-page', Container).append('<span><a hidefocus="true">H</a></span>');
                }
                clickSwitch();
            }
        }

        function slide_prev() {
            if (!is_working) {
                is_working = true;
                set_pos('prev');
                set_pos_select();

                if (options.effect == 'left') {
                    var seg = ow * options.move;
                    Set.animate({
                        left: '+=' + seg
                    }, options.speed, function() {
                        Set.find('li').slice(-options.move).remove();
                        Set.css('left', -(seg));
                        spliceLast();
                        is_working = false;
                    });
                } else if (options.effect == 'top') {
                    var seg = oh * options.move;
                    Set.animate({
                        top: '+=' + seg
                    }, options.speed, function() {
                        Set.find('li').slice(-options.move).remove();
                        Set.css('top', -(seg));
                        spliceLast();
                        is_working = false;
                    });
                } else if (options.effect == 'fade') {
                    var pos_select = $('.slider-page span', Container).index($('.slider-page span.select', Container));
                    Item.css({
                        "z-index": "0"
                    }).fadeOut(0);
                    $(Item[pos_select]).css({
                        "z-index": "1"
                    }).fadeIn(options.speed, function() {
                        is_working = false;
                    });
                }

            }
        }

        function slide_next() {
            if (!is_working) {
                is_working = true;
                set_pos('next');
                set_pos_select();
                if (options.effect == 'left') {
                    var seg = ow * options.move;
                    Set.animate({
                        left: '-=' + seg
                    }, options.speed, function() {
                        Set.find('li').slice(0, options.move).remove();
                        Set.css('left', -(seg));
                        spliceFirst();
                        is_working = false;
                    });
                } else if (options.effect == 'top') {
                    var seg = oh * options.move;
                    Set.animate({
                        top: '-=' + seg
                    }, options.speed, function() {
                        Set.find('li').slice(0, options.move).remove();
                        Set.css('top', -(seg));
                        spliceFirst();
                        is_working = false;
                    });
                } else if (options.effect == 'fade') {
                    var pos_select = $('.slider-page span', Container).index($('.slider-page span.select', Container));
                    Item.css({
                        "z-index": "0"
                    }).fadeOut(0);
                    $(Item[pos_select]).css({
                        "z-index": "1"
                    }).fadeIn(options.speed, function() {
                        is_working = false;
                    });
                }
            }
        }

        function clickSwitch() {
            $('.slider-page span', Container).bind('click', function() {
                if (!is_working) {
                    is_working = true;
                    var pos_select = $('.slider-page span', Container).index($('.slider-page span.select', Container));
                    var pos_click = $('.slider-page span', Container).index($(this));
                    var pos_range = pos_click - pos_select;

                    if (options.effect == 'left') {
                        var seg = ow * options.move;
                        if (pos_range > 0) {
                            for (var pr = 0; pr < pos_range; pr++) {
                                clearInterval(j);
                                set_pos('next');
                                set_pos_select();
                                if (pr == (pos_range - 1)) {
                                    var speed = options.speed;
                                } else {
                                    var speed = 0;
                                }
                                Set.animate({
                                    left: '-=' + seg
                                }, speed, function() {
                                    Set.find('li').slice(0, options.move).remove();
                                    Set.css('left', -(seg));
                                    spliceFirst();
                                    is_working = false;
                                });
                            }
                        }
                        if (pos_range < 0) {
                            for (var pr = pos_range; pr < 0; pr++) {
                                clearInterval(j);
                                set_pos('prev');
                                set_pos_select();
                                if (pr == -1) {
                                    var speed = options.speed;
                                } else {
                                    var speed = 0;
                                }
                                Set.animate({
                                    left: '+=' + seg
                                }, speed, function() {
                                    Set.find('li').slice(-options.move).remove();
                                    Set.css('left', -(seg));
                                    spliceLast();
                                    is_working = false;
                                });
                            }
                        }
                    } else if (options.effect == 'top') {
                        var seg = oh * options.move;
                        if (pos_range > 0) {
                            for (var pr = 0; pr < pos_range; pr++) {
                                clearInterval(j);
                                set_pos('next');
                                set_pos_select();
                                if (pr == (pos_range - 1)) {
                                    var speed = options.speed;
                                } else {
                                    var speed = 0;
                                }
                                Set.animate({
                                    top: '-=' + seg
                                }, speed, function() {
                                    Set.find('li').slice(0, options.move).remove();
                                    Set.css('top', -(seg));
                                    spliceFirst();
                                    is_working = false;
                                });
                            }
                        }
                        if (pos_range < 0) {
                            for (var pr = pos_range; pr < 0; pr++) {
                                clearInterval(j);
                                set_pos('prev');
                                set_pos_select();
                                if (pr == -1) {
                                    var speed = options.speed;
                                } else {
                                    var speed = 0;
                                }
                                Set.animate({
                                    top: '+=' + seg
                                }, speed, function() {
                                    Set.find('li').slice(-options.move).remove();
                                    Set.css('top', -(seg));
                                    spliceLast();
                                    is_working = false;
                                });
                            }
                        }
                    } else if (options.effect == 'fade') {
                        if (pos_range > 0) {
                            for (var pr = 0; pr < pos_range; pr++) {
                                clearInterval(j);
                                set_pos('next');
                                set_pos_select();
                                $(Item[pos_select]).css({
                                    "z-index": "0"
                                }).fadeOut(options.speed);
                                if (pr == (pos_range - 1)) {
                                    $(Item[first]).css({
                                        "z-index": "1"
                                    }).fadeIn(options.speed, function() {
                                        is_working = false;
                                    });
                                } else {
                                    $(Item[first]).css({
                                        "z-index": "0"
                                    }).fadeOut(options.speed, function() {
                                        is_working = false;
                                    });
                                }
                            }
                        }
                        if (pos_range < 0) {
                            for (var pr = pos_range; pr < 0; pr++) {
                                clearInterval(j);
                                set_pos('prev');
                                set_pos_select();
                                if (pr == -1) {
                                    $(Item[first]).css({
                                        "z-index": "1"
                                    }).fadeIn(options.speed, function() {
                                        is_working = false;
                                    });
                                } else {
                                    $(Item[first]).css({
                                        "z-index": "0"
                                    }).fadeOut(options.speed, function() {
                                        is_working = false;
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }

        function set_control() {
            Container.append('<div class="slider-pn">\
                                <a class="slider-prev iepng" hidefocus="true" href="javascript:void(0);"></a>\
                                <a class="slider-next iepng" hidefocus="true" href="javascript:void(0);"></a>\
                            </div>');
            $('.slider-pn .slider-next', Container).bind('click', function() {
                slide_next();
                clearInterval(j);
                return false;
            });
            $('.slider-pn .slider-prev', Container).bind('click', function() {
                slide_prev();
                clearInterval(j);
                return false;
            });
        }

        function set_pos(dir) {
            if (dir == 'next') {
                first += options.move;
                if (first >= Item.length) {
                    first = first % Item.length;
                }
                last += options.move;
                if (last >= Item.length) {
                    last = last % Item.length;
                }
            } else if (dir == 'prev') {
                first -= options.move;
                if (first < 0) {
                    first = Item.length + first;
                }
                last -= options.move;
                if (last < 0) {
                    last = Item.length + last;
                }
            }
        }

        function set_pos_select() {
            $('.slider-page', Container).children('span').removeClass('select');
            $($('.slider-page', Container).children('span')[first]).addClass('select');
        }

        //第一个之前的衔接
        function spliceFirst() {
            var chain = new Array();
            var collect = Item.clone();
            le = last;
            for (var i = 0; i < options.move; i++) {
                le++;
                if (!collect[le]) {
                    le = 0;
                }
                chain[i] = $(collect[le]);
            }
            $.each(chain, function(index) {
                Set.append(chain[index][0]);
            });
        }

        //最后一个的衔接
        function spliceLast() {
            var chain = new Array();
            var collect = Item.clone();
            fe = first;
            for (var i = 0; i < options.move; i++) {
                fe--;
                if (!collect[fe]) {
                    fe = Item.length - 1;
                }
                chain[i] = $(collect[fe]);
            }
            $.each(chain, function(index) {
                Set.prepend(chain[index][0]);
            });
        }

        function autoPlay() {

            if (options.auto) {
                start_slide();
            }
            Container.hover(function() {
                if (Container.find('.slider-pn').length > 0) {
                    Container.find(".slider-pn").addClass("slider-pnhover");
                }
                if (options.auto) {
                    clearInterval(j);
                }
            }, function() {
                if (Container.find('.slider-pn').length > 0) {
                    Container.find(".slider-pn").removeClass("slider-pnhover");
                }
                if (options.auto) {
                    start_slide();
                }
            });
        }
    }
})(jQuery);

//延迟加载
function lazyLoad() {
    $(".dynload").each(function() {
        typeof $(this).attr("imgsrc") != "undefined" && $(this).offset().top < $(document).scrollTop() + $(window).height() && $(this).attr("src", $(this).attr("imgsrc")).removeAttr("imgsrc");
    });
}

function startLsSwitch() {
    var lsSwitchs = $(".slider_start");
    lsSwitchs.each(function() {
        var opt = $(this).attr("options").toString().split("|");
        $(this).lsSwitch({
            effect: opt[1].toString(),
            auto: opt[2] == "1" ? true : false,
            interval: parseInt(opt[3]),
            speed: parseInt(opt[4]),
            controls: opt[5] == "1" ? true : false,
            slider_btn: opt[6] == "1" ? true : false
        });
        $(this).removeClass("slider_start");
    });
}
$(function() {
    lazyLoad(); // 初始化图片延迟加载
    startLsSwitch(); // 图片轮播效果初始化
})