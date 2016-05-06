define(function() {
    'use strict';

    /**
     *
     * @param dom 原生dom对象
     * @param width 可视宽度
     * @param height 可视高度
     * @constructor
     */
    function jsScroller(dom, width, height) {
        this.container = dom;
        var self = this,
            list = dom.getElementsByTagName("div") ?
                dom.getElementsByTagName("div") :  dom.getElementsByTagName("ul");
        for (var i = 0; i < list.length; i++) {
            if (list[i].className.indexOf("Scroller-Container") > -1) {
                dom = list[i];
            }
        }

        //Private methods
        this._setPos = function(x, y, evt) {
            if (x < this.viewableWidth - this.totalWidth)
                x = this.viewableWidth - this.totalWidth;
            if (x > 0) x = 0;
            if (y < this.viewableHeight - this.totalHeight)
                y = this.viewableHeight - this.totalHeight;
            if (y > 0) y = 0;

            this._x = x;
            this._y = y;
            dom.style.left = this._x + "px";
            if (evt && evt == 'animate') {
                $(dom).animate({top: this._y}, 500);
            } else {
                dom.style.top = this._y + "px";
            }
        };

        //Public Methods
        this.reset = function() {
            this.content = dom;
            this.totalHeight = dom.offsetHeight;
            this.totalWidth = dom.offsetWidth;
            this._x = 0;
            this._y = 0;
            dom.style.left = "0px";
            dom.style.top = "0px";
        };

        this.scrollBy = function(x, y) {
            this._setPos(this._x + x, this._y + y);
        };

        this.scrollTo = function(x, y, evt) {
            this._setPos(-x, -y, evt);
        };

        this.stopScroll = function() {
            if (this.scrollTimer) window.clearInterval(this.scrollTimer);
        };

        this.startScroll = function(x, y) {
            this.stopScroll();
            this.scrollTimer = window.setInterval(
                function() {
                    self.scrollBy(x, y);
                }, 40
            );
        };

        this.swapContent = function(c, w, h) {
            dom = c;
            var list = dom.getElementsByTagName("div");
            for (var i = 0; i < list.length; i++) {
                if (list[i].className.indexOf("Scroller-Container") > -1) {
                    dom = list[i];
                }
            }
            if (w) this.viewableWidth = w;
            if (h) this.viewableHeight = h;
            this.reset();
        };

        //variables
        this.content = dom;
        this.viewableWidth = width;
        this.viewableHeight = height;
        this.totalWidth = dom.offsetWidth;
        this.totalHeight = dom.offsetHeight;
        this.scrollTimer = null;
        this.reset();
    }

    function scrollCore(o, s, a, h, scale,ev) {
        var self = this;

        this.reset = function() {
            //Arguments that were passed
            this._parent = o;
            this._src = s;
            this.auto = a ? a : false;
            this.evBottomHandle = ev ? (typeof ev.onBottom === 'function' ? ev.onBottom : function() {}) : function() {};
            this.evScrollHandle = ev ? (typeof ev.onScroll === 'function' ? ev.onScroll : function() {}) : function() {};
            //Component Objects
            this._up = this._findComponent("Scrollbar-Up", this._parent);
            this._down = this._findComponent("Scrollbar-Down", this._parent);
            this._yTrack = this._findComponent("Scrollbar-Track", this._parent);
            this._yHandle = this._findComponent("Scrollbar-Handle", this._yTrack);
            //Height and position properties
            this._trackTop = findOffsetTop(this._yTrack);
            this._trackHeight = this._yTrack.offsetHeight;

            if (scale) {
                if (this._isReset) h = this._resetHeight;
                this._yHandle.style.height = Math.floor(this._trackHeight * h / this._src.totalHeight) + 'px';
            }

            this._handleHeight = this._yHandle.offsetHeight;
            this._x = 0;
            this._y = 0;
            //Misc. variables
            this._barTop = 0;
            this._scrollDist = 5;
            this._scrollTimer = null;
            this._selectFunc = null;
            this._grabPoint = null;
            this._tempTarget = null;
            this._tempDistX = 0;
            this._tempDistY = 0;
            this._disabled = false;
            this._isBottom = false;
            // 滚动距离比例
            this._ratio = (this._src.totalHeight - this._src.viewableHeight) / (this._trackHeight - this._handleHeight);
            this._yHandle.ondragstart = function() { return false; };
            this._yHandle.onmousedown = function() { return false; };

            this._addEvent(this._src.content, "mousewheel", this._scrollbarWheel);
            this._removeEvent(this._parent, "mousedown", this._scrollbarClick);
            this._addEvent(this._parent, "mousedown", this._scrollbarClick);

            this._src.reset();
            this._yHandle.style.top = "0px";
            this._yHandle.style.left = "0px";
            this._moveContent();

            if (this._src.totalHeight < this._src.viewableHeight) {
                this._disabled = true;
                this._yHandle.style.visibility = "hidden";
                if (this.auto) this._parent.style.visibility = "hidden";
            } else {
                this._disabled = false;
                this._yHandle.style.visibility = "visible";
                this._parent.style.visibility = "visible";
            }
        };

        this._addEvent = function(o, t, f) {
            if (o.addEventListener) o.addEventListener(t, f, false);
            else if (o.attachEvent) o.attachEvent('on' + t, f);
            else o['on' + t] = f;
        };

        this._removeEvent = function(o, t, f) {
            if (o.removeEventListener) o.removeEventListener(t, f, false);
            else if (o.detachEvent) o.detachEvent('on' + t, f);
            else o['on' + t] = null;
        };

        this._findComponent = function(c, o) {
            var kids = o.childNodes;
            for (var i = 0; i < kids.length; i++) {
                if (kids[i].className && kids[i].className.lastIndexOf(c) > -1) {
                    return kids[i];
                }
            }
        };

        function findOffsetTop(o) {
            var t = 0;
            if (o.offsetParent) {
                while (o.offsetParent) {
                    t += o.offsetTop;
                    o = o.offsetParent;
                }
            }
            return t;
        }

        this._scrollbarClick = function(e) {
            if (self._disabled) return false;
            e = e ? e : event;
            if (!e.target) e.target = e.srcElement;

            if (e.target.className.indexOf("Scrollbar-Up") > -1) self._scrollUp(e);
            else if (e.target.className.indexOf("Scrollbar-Down") > -1) self._scrollDown(e);
            else if (e.target.className.indexOf("Scrollbar-Track") > -1) self._scrollTrack(e);
            else if (e.target.className.indexOf("Scrollbar-Handle") > -1) self._scrollHandle(e);

            self._tempTarget = e.target;
            self._selectFunc = document.onselectstart;
            document.onselectstart = function() {
                return false;
            };

            self._addEvent(document, "mouseup", self._stopScroll, false);

            return false;
        };

        this._scrollbarDrag = function(e) {
            e = e ? e : event;
            var v = e.clientY + document.body.scrollTop - self._trackTop;
            if (v >= self._trackHeight - self._handleHeight + self._grabPoint) {
                self._yHandle.style.top = self._trackHeight - self._handleHeight + "px";
                self._triggerBottomEvt(self._yHandle.style.top);
            } else if (v <= self._grabPoint) {
                self._yHandle.style.top = "0px";
                self._isBottom = false;
            } else {
                self._yHandle.style.top = v - self._grabPoint + "px";
                self._isBottom = false;
            }

            self._y = parseInt(self._yHandle.style.top, 10);
            self._barTop = 0;
            self._triggerScrollEvt(e, self._yHandle.style.top);
            self._moveContent();
        };

        this._scrollbarWheel = function(e) {
            e = e ? e : event;
            var dir = 0;
            if (e.wheelDelta >= 120) dir = -1;
            if (e.wheelDelta <= -120) dir = 1;

            self.scrollBy(0, dir * 20);
            e.returnValue = false;
        };

        this._startScroll = function(x, y) {
            this._tempDistX = x;
            this._tempDistY = y;
            this._scrollTimer = window.setInterval(function() {
                self.scrollBy(self._tempDistX, self._tempDistY);
            }, 40);
        };

        this._stopScroll = function() {
            self._removeEvent(document, "mousemove", self._scrollbarDrag, false);
            self._removeEvent(document, "mouseup", self._stopScroll, false);

            if (self._selectFunc) document.onselectstart = self._selectFunc;
            else document.onselectstart = function() {
                return true;
            };

            if (self._scrollTimer) window.clearInterval(self._scrollTimer);
        };

        this._scrollUp = function(e) {
            this._startScroll(0, -this._scrollDist);
        };

        this._scrollDown = function(e) {
            this._startScroll(0, this._scrollDist);
        };

        this._scrollTrack = function(e) {
            var curY = e.clientY + document.body.scrollTop,
                y = curY - this._trackTop - this._handleHeight / 2;
            this._scroll(0, y, 'animate');
            this._triggerScrollEvt(e.target, y + 'px');
        };

        this._scrollHandle = function(e) {
            var curY = e.clientY + document.body.scrollTop;
            this._grabPoint = curY - findOffsetTop(this._yHandle);
            this._addEvent(document, "mousemove", this._scrollbarDrag, false);
        };

        this._scroll = function(x, y, evt) {
            if (y > this._trackHeight - this._handleHeight) {
                y = this._trackHeight - this._handleHeight;
                this._triggerBottomEvt(y + 'px');
            }
            if (y < 0) y = 0;
            this._isBottom = !this._isBottom;
            if (evt && evt == 'animate') {
                $(this._yHandle).animate({top: y}, 500);
            } else {
                this._yHandle.style.top = y + "px";
            }
            this._y = y;
            this._moveContent(evt);
        };

        this._triggerBottomEvt = function(data) {
            if (!self._isBottom) {
                self.evBottomHandle(data);
                self._isBottom = !self._isBottom;
            }
        };

        this._triggerScrollEvt = function(e, data) { self.evScrollHandle(e, data); };

        this._moveContent = function(evt) {
            this._src.scrollTo(0, Math.round(this._y * this._ratio), evt);
        };

        this._resetContent = function(posY) {
            this._src._setPos(0, posY)
        };

        this.scrollBy = function(x, y) {
            this._scroll(0, (-this._src._y + y) / this._ratio);
        };

        this.scrollTo = function(x, y, evt) {
            this._scroll(0, y / this._ratio, evt);
        };

        this.swapContent = function(w, h) {
            this._removeEvent(this._src.content, "mousewheel", this._scrollbarWheel, false);
            this._src.swapContent(this._src.content, w, h);
            this.reset();
        };

        this.resetLocation = function() {
            this._isReset = true;
            this._resetWidth = (this._src.container.offsetWidth || this._src.container.style.width);
            this._resetHeight = (this._src.container.offsetHeight || this._src.container.style.height);

            var posY = this._src._y,
                srcTop = this._src.content.style.top,
                setBarTop = null;

            if (this._barTop) {
                setBarTop = this._barTop;
            } else {
                setBarTop = this._barTop = this._y;
            }

            var yHandleTop = (this._resetHeight * setBarTop / this._src.viewableHeight) || 0;
            this.swapContent(this._resetWidth, this._resetHeight);
            this._resetContent(posY);
            this._src.content.style.top = srcTop;
            this._yHandle.style.top = parseInt(yHandleTop, 10) + 'px';
        };

        this.reset();
    }

    var Scroller = {
        /**
         *
         * @param dom 原生dom对象
         * @param isAuto {boolean} 是否自动隐藏滚动条
         * @param scale {boolean} 滚动条是否随滚动总区域高度调整而调整
         * @param obj {obj} 事件回调函数
         */
        init: function(dom, isAuto, useScale, obj) {
            var id = null;
            for (var i = 0, len = dom.childNodes.length; i < len; i += 1) {
                if (dom.childNodes[i].className && dom.childNodes[i].className.indexOf('Scrollbar-Container') > -1) {
                    id = dom.childNodes[i];
                }
            }

            var contHeight = useScale ? (dom.offsetHeight || parseInt(dom.style.height, 10)) : 0,
                width = dom.offsetWidth || parseInt(dom.style.width, 10) || 0,
                height = dom.offsetHeight || parseInt(dom.style.height, 10) || 0,
                scroller = new jsScroller(dom, width, height),
                scrollBar = new scrollCore(id, scroller, isAuto, contHeight, useScale, obj);

            return scrollBar;
        }
    }

    return Scroller;
});