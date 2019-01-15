layui.define(['laytpl','layer','form','table'], function(exports){
    "use strict";
    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        laytpl = layui.laytpl,
        layer = layui.layer,
        hint = layui.hint(),
        MOD_NAME = 'paperList',//组件名称
        eventName = {
            tool:{},
            select:{},
            allSelect:{}
        },
        eventObj = {
            event:function(name,data,fn){
                var filter = name.substring(name.indexOf('(')+1,name.indexOf(')'));
                var toolName = name.substring(0,name.indexOf('('));
                if(typeof fn === 'function'){
                    eventName[toolName][filter]= fn;
                };
                if(data){
                    if(typeof eventName[toolName][filter] === 'function'){
                        eventName[toolName][filter](data)
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
            config: {
                checkName: 'LAY_PAPER_CHECKED', //是否选中状态的字段名
                indexName: 'LAY_PAPER_INDEX' //下标索引名
            },
            cache:{},
            index:0,
            on: function(events, callback){
                return eventObj.event.call(this,events,'',callback)
            }
        },
        //操作当前实例
        thisList = function(){
            var that = this,
                options = that.config,//来自Class构造器 的 config（因为在render核心入口中，已经call回来了）
                id = options.id || options.index;

            if(id){
                thisList.that[id] = that; //记录当前实例对象
                thisList.config[id] = options; //记录当前实例配置项
            }
            return {
                reload: function(options){
                    that.reload.call(that, options);
                },
                config: options
            }
        },
        getThisPaperListConfig = function(id){
            var config = thisList.config[id];
            if(!config) hint.error('The ID option was not found in the paperList instance');
            return config || null;
        },
        //构造器
        Class = function(options){
            var that = this;

            that.index = ++paperList.index;//全局自增变量，记录当前是第几个paperList;

            //将外部传入options、当前构造器的config、外部暴露的接口中config
            //整合进当前的构造器中
            that.config = $.extend({}, that.config, paperList.config, options);
            that.render();
        };

    //记录所有实例
    thisList.that = {}; //记录所有实例对象
    thisList.config = {}; //记录所有实例配置项

    //构造器配置属性
    Class.prototype.config = {
        data:new Array(),
        select:false,//是否开启选择
        btn:false,//是否挂载了按钮
        batchBar:false//是否挂载了头部按钮
    };

    Class.prototype.render = function(){
        var that = this,
            options = that.config,
            _barElem = "",//头部渲染字符串
            _str = '',//主体字符
            _com = 12,//判断栅格系统
            _select = ['<form class="layui-form" >','<input type="checkbox" lay-skin="primary" lay-filter="',SELECT_EVENT_NAME,'"> ','</form>'].join('');//每行select按钮

            //将id转化为DOM节点
            options.elem = $(options.elem);
            //装载配置中的ID,如果id已存在则直接使用，不存在则获取，否则使用内置的index（为reload方法做准备）
            options.id = options.id || options.elem.attr('id') || that.index;

        if(!options.elem[0] || !$(options.contentElem)[0]){
            return false;
        }

        //多选头部
        if(options.select){
            _com = _com - 1;
            _barElem += ['<div class="layui-row" style="margin-left: 10px;">',
                '<div style="border: 1px solid #d2d2d2;padding: 2px 14px; width: 60px;float: left;margin-right: 15px;border-radius: 3px">',
                '<form class="layui-form" >',
                '<input type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="' + SELECTALL_EVENT_NAME +'">',
                '</form>',
                '</div>',
                //判断头部按钮是否挂载了别的元素
                $(options.batchBarElem)[0]?'<div style="float: left;">' + $(options.batchBarElem)[0].innerHTML +'</div>':'',
                '</div>'].join('');
        }


        for(var i = 0 ; i < options.data.length ;i++){
            options.data[i].INDEX = i;
            options.data[i][options.checkName] = false;
            var str = ['<div class="layui-row" ' + MODE_INDEX +'=' + i +' style="border: 1px solid #dddddd;border-radius: 3px;padding: 14px;margin: 10px;box-shadow:0 0 3px #d2d2d2;">',
                options.select?'<div class="layui-col-md1 layui-col-xs1 layui-col-sm1">' + _select +'</div>':'',
                '<div class="layui-col-md' + _com + ' layui-col-sm' + _com +' layui-col-xs' + _com +'">',
                $(options.contentElem)[0].innerHTML,//主体内容模板
                '</div>',
                '</div>'].join('');
            _str += laytpl(str).render(options.data[i]);
        }

        $(options.elem).html((options.select?_barElem:'') + _str);
        form.render();

        //装载当前操作的实例是第几个实例
        options.index = that.index;
        options.checkNum = 0;
        that.key = options.id || options.index;
        paperList.cache[that.key] = options.data;

        that.btnEvent();
        if(options.select){
            that.selectEvent();
        }

    };

    //按钮事件监听，只要带paper-event

    Class.prototype.btnEvent = function(){
        var that = this,options = that.config;
        options.elem.off().on("click",'*[' + BTN_EVENT_NAME +']',function(){
            var that = this,
                event = $(this).attr(BTN_EVENT_NAME),
                _recursive = function(elem){
                    if(elem.attr(MODE_INDEX) || parseInt(elem.attr(MODE_INDEX)) == 0){
                        var obj = {
                            data:paperList.cache[elem.parent().attr("id")][parseInt(elem.attr(MODE_INDEX))],
                            event:event,
                            elem:that,
                            INDEX:parseInt(elem.attr(MODE_INDEX))
                        };
                        eventObj.event.call(this,'tool(' + options.id +')',obj)
                    }else{
                        if(elem.parentNode != options.elem && elem!= options.elem) {
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
                // console.log(elem);
                if(elem.attr(MODE_INDEX) || elem.attr(MODE_INDEX) == 0){
                    callback({filter:elem.parent().attr("id"),index:parseInt(elem.attr(MODE_INDEX))})
                }else{
                    if(elem.parentNode != options.elem && elem!= options.elem) {
                        mer(elem.parent());
                    }
                }
            };
            mer(e);
        };
        //单独选择监听
        form.on('checkbox(' + SELECT_EVENT_NAME +')', function(data){
            var _selectBar = "";
            _recursive($(data.elem),function(d){
                paperList.cache[d.filter][d.index][options.checkName] = data.elem.checked;
                var obj = {
                    elem:data.elem,
                    value:data.value,
                    othis:data.othis,
                    data:paperList.cache[d.filter][d.index]
                };
                if(data.elem.checked){
                    thisList.config[d.filter].checkNum++
                }else{
                    thisList.config[d.filter].checkNum--
                }
                if(data.elem.checked && (thisList.config[d.filter].checkNum == paperList.cache[d.filter].length)){
                    _selectBar = ['<form class="layui-form" >','<input checked type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="' + SELECTALL_EVENT_NAME +'"> ','</form>'].join('');
                }else{
                    _selectBar = ['<form class="layui-form" >','<input type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="' + SELECTALL_EVENT_NAME +'"> ','</form>'].join('');
                };
                $("#" + d.filter).find(".layui-form *[lay-filter=" + SELECTALL_EVENT_NAME +"]").parent().parent()[0].innerHTML = _selectBar;
                form.render();
                eventObj.event.call(this,'select(' + d.filter +')',obj)
            })
        });
        //全选监听
        form.on('checkbox(' + SELECTALL_EVENT_NAME +')', function(data){
            var _select = "",
                elem = $(data.elem).parent().parent().parent(),
                filter = elem.parent().attr("id");
            if(data.elem.checked){
                _select = ['<form class="layui-form" >','<input checked type="checkbox" lay-skin="primary" lay-filter="',SELECT_EVENT_NAME,'"> ','</form>'].join('');
                thisList.config[filter].checkNum = paperList.cache[filter].length
            }else{
                _select = ['<form class="layui-form" >','<input type="checkbox" lay-skin="primary" lay-filter="',SELECT_EVENT_NAME,'"> ','</form>'].join('');
                thisList.config[filter].checkNum = 0;
            }
            elem.siblings().find(".layui-form *[lay-filter=" + SELECT_EVENT_NAME +"]").each(function(index,item){
                item.parentNode.parentNode.innerHTML = _select;
                paperList.cache[filter][index][options.checkName] = data.elem.checked;
            });
            form.render();

            eventObj.event.call(this,'allSelect(' + filter +')',{status:data.elem.checked,data:paperList.cache[filter]});

        });
    };

    paperList.checkStatus = function(filter){
        var _i = new Array();
        paperList.cache[filter].forEach(function(item,index){
            if(item[paperList.config.checkName]){
                _i.push(item)
            }
        });
        return _i;
    };

    Class.prototype.reload = function(options){
        var that = this;
        if(that.config.data && that.config.data.constructor === Array) delete that.config.data;
        that.config = $.extend({}, that.config, options);
        that.render();
    };

    paperList.reload = function(id, options){
        options = options || {};

        var config = getThisPaperListConfig(id); //获取当前实例配置项
        if(!config) return;
        if(options.data && options.data.constructor === Array) delete config.data;
        return paperList.render($.extend(true, {}, config, options));
    };

    //核心入口
    paperList.render = function(options){
        var inst = new Class(options);
        return thisList.call(inst);
    };


    exports(MOD_NAME, paperList);
});


