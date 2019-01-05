layui.define(['laytpl','layer','form','table'], function(exports){
    "use strict";
    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        laytpl = layui.laytpl,
        layer = layui.layer,
        hint = layui.hint(),
        MOD_NAME = 'paperList',//组件名称
        eventName = {},
        selectStatus = [],
        eventObj = {
            event:function(name,data,fn){
                if(typeof fn === 'function'){
                    eventName[name] = fn;
                };
                if(data){
                    if(typeof eventName[name] === 'function'){
                       eventName[name](data)
                    }
                    if(name == 'select'){
                        if(data.elem.checked){
                            selectStatus.push(data.linedata)
                        }else{
                            selectStatus.forEach(function(item,index){
                                if(item.INDEX == data.linedata.INDEX){
                                    selectStatus.splice(index,1)
                                }
                            })
                        }
                    }
                }
            }
        },
        BTN_EVENT_NAME = 'paper-event',
        SELECT_EVENT_NAME = 'paper-select',
        SELECTALL_EVENT_NAME = 'paper-selectAll',
        MODE_INDEX = 'paper-index',
        //外部接口,当前暴露：render方法、on方法、getStatus方法
        paperList = {
            on: function(events, callback){
                return eventObj.event.call(this,events,'',callback)
            },
            getStatus:function(){
                return selectStatus
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
        select:false,//是否开启选择
        btn:false,//是否挂载了按钮
        batchBar:false,//是否挂载了头部按钮
        table:false
    };

    Class.prototype.render = function(){
        var that = this,
            options = that.config,
            str = '',//主体字符
            elem = '',//拼接后将要渲染的字符
            barElem = '',//头部字符
            _com = 12,//判断栅格系统
            _select = ['<form class="layui-form" >','<input type="checkbox" lay-skin="primary" lay-filter="',SELECT_EVENT_NAME,'"> ','</form>'].join('');

        if(!$(options.elem)[0] || !$(options.contentElem)[0]){
            return false;
        }
        //多选头部
        if(options.select){
            _com = _com - 1;
            barElem += ['<div class="layui-row" style="margin-left: 10px;">',
                        '<div style="border: 1px solid #d2d2d2;padding: 2px 14px; width: 60px;float: left;margin-right: 15px;border-radius: 3px">',
                            '<form class="layui-form" >',
                                '<input type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="' + SELECTALL_EVENT_NAME +'">',
                            '</form>',
                        '</div>',
                        $(options.batchBarElem)[0]?'<div style="float: left;">' + $(options.batchBarElem)[0].innerHTML +'</div>':'',
                    '</div>'].join('');
        }

        //主体内容渲染
        var content = $(options.contentElem)[0].innerHTML;
        for(var i = 0 ; i < options.data.length ;i++){
            options.data[i].INDEX = i;
            str = ['<div class="layui-row" ' + MODE_INDEX +'=' + i +' style="border: 1px solid #dddddd;border-radius: 3px;padding: 14px;margin: 10px;box-shadow:0 0 3px #d2d2d2;">',
                options.select?'<div class="layui-col-md1 layui-col-xs1 layui-col-sm1">' + _select +'</div>':'',
                '<div class="layui-col-md' + _com + ' layui-col-sm' + _com +' layui-col-xs' + _com +'">',
                    content,
                '</div>',
                '</div>'].join('');
            elem += laytpl(str).render(options.data[i]);
        }
        $(options.elem).html((options.select?barElem:'') + elem);
        form.render();

        // if(options.btn){
            that.btnEvent();
        // }
        if(options.select){
            that.selectEvent();
        }
        //手动释放内存
        str = '',elem = '',barElem = '',_com = 12,_select = '';
    };

    //按钮事件监听，只要带paper-event

    Class.prototype.btnEvent = function(){
        var that = this,options = that.config;
        $(options.elem).on("click",'*[' + BTN_EVENT_NAME +']',function(){
            var event = $(this).attr('paper-event'),
                _recursive = function(elem){
                if(elem.attr(MODE_INDEX) || elem.attr(MODE_INDEX) == 0){
                    var obj = {
                        data:options.data[elem.attr(MODE_INDEX)],
                        event:event,
                        INDEX:parseInt(elem.attr(MODE_INDEX))
                    };
                    eventObj.event.call(this,'tool',obj)
                }else{
                    if(elem.parentNode != $(options.elem) && elem!= $(options.elem)) {
                        _recursive(elem.parent());
                    }
                }
            };
            _recursive($(this));
        })
    };

    //选择监听
    Class.prototype.selectEvent = function(){
        var that = this,options = that.config;
        var _recursive = function(e,callback){
                var mer = function(elem){
                    if(elem.attr(MODE_INDEX) || elem.attr(MODE_INDEX) == 0){
                        callback(parseInt(elem.attr(MODE_INDEX)))
                    }else{
                        if(elem.parentNode != $(options.elem) && elem!= $(options.elem)) {
                            mer(elem.parent());
                        }
                    }
                };
                mer(e);
            };
        //单独选择监听
        form.on('checkbox(' + SELECT_EVENT_NAME +')', function(data){
            _recursive($(data.elem),function(d){
                var obj = {
                    elem:data.elem,
                    value:data.value,
                    othis:data.othis,
                    linedata:options.data[d]
                };
                if(data.elem.checked && (selectStatus.length + 1) == options.data.length ){
                    var _select = ['<form class="layui-form" >','<input checked type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="' + SELECTALL_EVENT_NAME +'"> ','</form>'].join('');
                    $(options.elem).find(".layui-form *[lay-filter=" + SELECTALL_EVENT_NAME +"]").each(function(index,item){
                        item.parentNode.innerHTML = _select;
                    });
                }else if(!data.elem.checked && selectStatus.length  == options.data.length){
                    var _unSelect = ['<form class="layui-form" >','<input type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="' + SELECTALL_EVENT_NAME +'">','</form>'].join('');
                    $(options.elem).find(".layui-form *[lay-filter=" + SELECTALL_EVENT_NAME +"]").each(function(index,item){
                        item.parentNode.innerHTML = _unSelect;
                    });
                };
                form.render();
                eventObj.event.call(this,'select',obj)
            });
        });
        //全选监听
        form.on('checkbox(' + SELECTALL_EVENT_NAME +')', function(data){
            var _select = ['<form class="layui-form" >','<input checked type="checkbox" lay-skin="primary" lay-filter="',SELECT_EVENT_NAME,'"> ','</form>'].join('');
            var _unSelect = ['<form class="layui-form" >','<input type="checkbox" lay-skin="primary" lay-filter="',SELECT_EVENT_NAME,'"> ','</form>'].join('');
            if(data.elem.checked){
                $(options.elem).find(".layui-form *[lay-filter=" + SELECT_EVENT_NAME +"]").each(function(index,item){
                    item.parentNode.innerHTML = _select;
                });
                form.render();
                options.data.forEach(function(item,index){
                    selectStatus.push(item);
                });
                eventObj.event.call(this,'batchBar',options.data);

            }else{
                $(options.elem).find(".layui-form *[lay-filter=" + SELECT_EVENT_NAME +"]").each(function(index,item){
                    item.parentNode.innerHTML = _unSelect;
                });
                form.render();
                selectStatus = [];
                eventObj.event.call(this,'batchBar',[]);

            }
        });
    };


    //核心入口
    paperList.render = function(options){
        var inst = new Class(options);
        return thisList.call(inst);
    };


    exports(MOD_NAME, paperList);
});


