/**
 *  @createBy   baiyu3@letv.com
 *  @date       2015-11-09
 *  @desc       业务逻辑模块
 */
define(function(require, exports, module) {
    /**声明严格模式**/
    "use strict";
    /**保存局部变量**/
    var $ = jQuery, // jquery
        W = window; // window
    /**业务逻辑**/
    var index = {
        /**API管理**/
        api: {
            
        },
        /**初始化入口**/
        init: function(){
            this.initModule();//载入依赖模块
            this.initDom();//获取dom节点
            this.initEvent();//绑定事件
        },
        /**初始化模块**/
        initModule: function(){
            
        },
        /**初始化dom节点**/
        initDom: function(){
            
        },
        /**初始化事件**/
        initEvent: function(){
            this.initGetData();//初始化数据获取
            this.initRender();//初始化渲染页面
            this.initInteractive();//初始化交互
        },
        /**初始化数据获取**/
        initGetData: function(){
            
        },
        /**初始化渲染页面**/
        initRender: function(){
            
        },
        /**初始化交互**/
        initInteractive: function(){
            
        }
    };
    /**入口**/
    index.init();
});