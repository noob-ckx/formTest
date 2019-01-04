layui.define(['laytpl','layer','form'], function(exports){
    "use strict";
    var $ = layui.$,
        form = layui.form,
        laytpl = layui.laytpl,
        layer = layui.layer,
        hint = layui.hint(),
        MOD_NAME = 'paperList',//组件名称
        eventName = {},
        eventObj = {
            event:function(name,data,fn){
                if(typeof fn === 'function'){
                    eventName[name] = fn;
                };
                if(data){
                    if(typeof eventName[name] === 'function'){
                       eventName[name](data)
                    }
                }
            },
            select:function(){

            }
        },
        BTN_EVENT_NAME = 'paper-event',
        MODE_INDEX = 'paper-index',
        //外部接口,当前暴露：render方法
        paperList = {
            setSelect:function(s){
                return eventObj.select.call(this,s)
            },
            on: function(events, callback){
                return eventObj.event.call(this,events,'',callback)
            }
        },
        //操作当前实例
        thisList = function(){
            var that = this,options = that.config;
            //找不到DOM，总体提示
            if(!$(options.elem)[0]){
                hint.error('The ID option was not found in the paperList');
            }

            return {}
        },
        //构造器
        Class = function(options){
            var that = this;
            //将外部传入options、当前构造器的config、外部暴露的接口中config
            //整合进当前的构造器中
            that.config = $.extend({}, that.config, paperList.config, options);
            that.render();
        };

    //构造器配置属性
    Class.prototype.config = {
        data:new Array(),
        select:false,
        table:false,
        btn:false,
        selectAll:false
    };

    Class.prototype.render = function(){
        var that = this,
            options = that.config,
            _btn='',
            _com = 0,
            _select = ['<form class="layui-form">','<input type="checkbox" lay-skin="primary"> ','</form>'].join('');
        ;
        if(!$(options.elem)[0]){
            return false;
        }
        if($(options.btnElem)[0]){
            options.btn = true;
            _btn = $(options.btnElem)[0].innerHTML;
            _com = _com + 2;
        }
        if(options.select){
            _com = _com + 1;
        }
        var content = $(options.contentElem)[0].innerHTML.replace("d.","item.");
        var str = ['{{#  layui.each(d, function(index, item){ }}',
                    '<div class="layui-row" ' + MODE_INDEX +'="{{index}}" style="border: 1px solid #dddddd;border-radius: 3px;padding: 14px;margin: 10px;box-shadow:0 0 3px #d2d2d2;">',
                        options.select?'<div class="layui-col-md1">' + _select +'</div>':'',
                        '<div class="layui-col-md' + (12-_com) + '">',
                            content,
                        '</div>',
                        //判断是否加载按钮
                        options.btn?'<div class="layui-col-md2" style="text-align: right">' + _btn + '</div>':'',
                    '</div>',
                    '{{#  }) }}'].join('');

        var elem = laytpl(str).render(options.data);
        $(options.elem).html(elem);
        form.render();
        if(options.btn){
            that.btnEvent();
        }
        if(options.select){
            that.selectEvent();
        }
    };


    Class.prototype.btnEvent = function(){
        var that = this,options = that.config;
        $(options.elem).on("click",'*[' + BTN_EVENT_NAME +']',function(){
            var event = $(this).attr('paper-event'),
                _recursive = function(elem){
                if(elem.attr(MODE_INDEX) || elem.attr(MODE_INDEX) == 0){
                    var data = options.data[elem.attr(MODE_INDEX)];
                    eventObj.event.call(this,'tool',data)
                }else{
                    if(elem.parentNode != $(options.elem) && elem!= $(options.elem)) {
                        _recursive(elem.parent());
                    }
                }
            };
            _recursive($(this));


        })
    };

    Class.prototype.selectEvent = function(){

    };




    //核心入口
    paperList.render = function(options){
        var inst = new Class(options);
        return thisList.call(inst);
    };


    exports(MOD_NAME, paperList);
});


