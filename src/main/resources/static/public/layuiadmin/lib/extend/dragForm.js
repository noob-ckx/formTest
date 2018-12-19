

layui.define(['form','laytpl','layer'], function(exports){
    "use strict";
    var $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer,
        form = layui.form,
        hint = layui.hint(),
        MOD_NAME = 'dragForm',CHECKED = "checked",
        DRAGINPUT = 'dragInput', COM_EVENT = 'dragForm-com-event',COM_EVENT_NAME = 'addToView',
        DRAGVIEW = 'dragView', VIEW_EVENT = 'dragForm-view-event',VIEW_EVENT_NAME = 'view',VIEW_DEL_EVENT="dragForm-view-del-event",VIEW_EVENT_DEL_NAME = 'del',

        //控件区
        COMPONTENTS = ['<div class="layui-row">','{{# layui.each(d, function(index, item){ }}', '<div class="layui-col-md6 ' + DRAGINPUT +'" ' + COM_EVENT +'="' + COM_EVENT_NAME +'" type="{{item.type}}">' , '{{item.name}}','</div>','{{# }) }}' ,'</div>'].join(''),

        //视图区
        VIEWS = ['<form class="layui-form" id="dragFormView" lay-filter="dragFormView">',
            '<div class="layui-row">',
                    '{{# layui.each(d, function(index, item){ }}',
                        '<div class="layui-row ' + DRAGVIEW +'" index="{{index}}" ' + VIEW_EVENT +'="' + VIEW_EVENT_NAME + '">',
                            '<div class="layui-col-md10" >',
                                '{{# if(item.type == 1){ }}',
                                //输入框
                                        '<div class="layui-form-item">',
                                            '<label class="layui-form-label">',
                                                    '{{# if(item.required){ }}',
                                                        '<span style="color:red">*</span>',
                                                    '{{# } }}',
                                                    '<span>{{item.name == ""?"输入框":item.name}}</span>',
                                            '</label>',
                                            '<div class="layui-input-block">',
                                                '<input type="text" name="{{index}}" {{item.required?"required lay-verify=\'required\'":""}}  placeholder="{{item.placeholder}}" autocomplete="off" class="layui-input">',
                                            '</div>',
                                        '</div>',
                                '{{# }else if(item.type == 2){ }}',
                                //下拉框
                                        '<div class="layui-form-item ">',
                                            '<label class="layui-form-label">',
                                                '{{# if(item.required){ }}',
                                                    '<span style="color:red">*</span>',
                                                        '{{# } }}',
                                                    '<span>{{item.name == ""?"选择框":item.name}}</span>',
                                            '</label>',
                                            '<div class="layui-input-block">',
                                                '<select name="{{index}}" {{item.required?"required lay-verify=\'required\'":""}}>',
                                                    '<option value="">{{item.placeholder}}</option>',
                                                    '{{# layui.each(item.option, function(i, o){ }}',
                                                    '<option value="{{i}}">{{o}}</option>',
                                                    '{{# }) }}',
                                                '</select>',
                                            '</div>',
                                        '</div>',
                                '{{# }else if(item.type == 3){ }}',
                                //复选框
                                        '<div class="layui-form-item">',
                                            '<label class="layui-form-label">{{item.name == ""?"复选框":item.name}}</label>',
                                            '<div class="layui-input-block">',
                                                '{{# layui.each(item.option, function(i, o){ }}',
                                                    '<input type="checkbox" name="{{index}}[]" title="{{o}}" lay-skin="primary" >',
                                                '{{# }) }}',
                                            '</div>',
                                        '</div>',
                                '{{# }else if(item.type == 4){ }}',
                                //单选框
                                        '<div class="layui-form-item">',
                                            '<label class="layui-form-label">{{item.name == ""?"单选框":item.name}}</label>',
                                            '<div class="layui-input-block">',
                                                '{{# layui.each(item.option, function(i, o){ }}',
                                                    '<input type="radio" name="{{index}}" value="{{o}}" title="{{o}}">',
                                                '{{# }) }}',
                                            '</div>',
                                        '</div>',
                                '{{# }else if(item.type == 5){ }}',
                                //文本域
                                        '<div class="layui-form-item layui-form-text">',
                                            '<label class="layui-form-label">',
                                                '{{# if(item.required){ }}',
                                                    '<span style="color:red">*</span>',
                                                '{{# } }}',
                                                '<span>{{item.name == ""?"文本域":item.name}}</span>',
                                            '</label>',
                                            '<div class="layui-input-block">',
                                                '<textarea name="{{index}}" placeholder="{{item.placeholder}}" {{item.required?"required lay-verify=\'required\'":""}} class="layui-textarea"></textarea>',
                                            '</div>',
                                        '</div>',
                                '{{# } }}',
                            '</div>',
                            '<div class="layui-col-md2">',
                                '<button class="layui-btn layui-btn-danger layui-btn-sm" type="button" ' + VIEW_DEL_EVENT +'="' + VIEW_EVENT_DEL_NAME +'" index="{{index}}">删除</button>',
                            '</div>',
                        '</div>',
                    '{{# }) }}',
                    '<div class="layui-form-item">',
                        '<div class="layui-input-block">',
                            '<button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>',
                        '</div>',
                    '</div>',
        '</div>',
        '</form>'].join(''),


        //外部接口,当前暴露：render方法
        dragForm = {

        },
        //操作当前实例
        thisForm = function(){
            var that = this,options = that.config;
            //找不到DOM，总体提示
            if(options.design){
                if(!$(options.comElem)[0] || !$(options.attrElem)[0] || !$(options.viewElem)[0]){
                    hint.error('The ID option was not found in the dragForm');
                }
            }else{
                if( !$(options.viewElem)[0]){
                    hint.error('The viewElem ID option was not found in the dragForm');
                }
            }

            return {}
        },
        //构造器
        Class = function(options){
            var that = this;
            //将外部传入options、当前构造器的config、外部暴露的接口中config
            //整合进当前的构造器中
            that.config = $.extend({}, that.config, dragForm.config, options);
            that.render();
        };

        //构造器配置属性
        Class.prototype.config = {
            data:new Array(),
            design:true,//是否为设计模式标志位
            //TODO 类型可由用户自行配置
            type:[{name:'输入框',type:1},{name:'下拉框',type:2},{name:'复选框',type:3},{name:'单选框',type:4},{name:'文本域',type:5}]
        };
        Class.prototype.render = function(){
            var that = this,
                options = that.config;
            options.comElem = $(options.comElem);
            options.viewElem = $(options.viewElem);
            options.attrElem = $(options.attrElem);

            //如果是设计模式，则判断三个ID是否存在，存在则渲染，否则返回
            if(options.design){
                if(!options.comElem[0] || !options.viewElem[0] || !options.attrElem[0]){
                    return that;
                }else{
                    that.renderView();
                    that.renderCom();
                    that.renderAttr();
                    //只有渲染了组件区，才开启组件区的监听事件
                    that.comEvents();
                    that.viewEvents();
                }
            }else{
                //如果不是设计模式，则判断显示内容ID是否存在，存在则渲染，否则返回
                if(!options.viewElem[0]){
                    return that;
                }else{
                    that.renderView();
                    that.viewEvents();
                }
            }
            console.log(options);
        };

        //渲染

        //组件区渲染
        Class.prototype.renderCom = function(){
            var that = this,
                options = that.config,
                comElem = laytpl(COMPONTENTS).render(options.type);
            options.comElem.html(comElem);

        };
        Class.prototype.renderView = function(){
            var that = this, options = that.config,
                viewElem = laytpl(VIEWS).render(options.data);
            options.viewElem.html(viewElem);
            //借助layui.form重新渲染视图区
            form.render();

        };
        Class.prototype.renderAttr = function(){

        };

        //事件处理

        //组件区事件
        Class.prototype.comEvents = function(){
            var that = this,options = that.config;
            options.comElem.on('mouseover', '.'+ DRAGINPUT, function(e){
                $(this).css("background-color", "#e2e2e2");
            });
            options.comElem.on('mouseout', '.'+ DRAGINPUT, function(e){
                $(this).css("background-color", "");
            });
            options.comElem.on('click', '*[' + COM_EVENT +']', function(e){
                var othis = $(this),events = othis.attr(COM_EVENT),i = parseInt(othis.attr("type"));
                console.log(events,i);
                //只进行数据的添加，渲染交给laytpl
                //注意：必填属性默认为false。复选框、单选框没有必填的属性，为保证数据格式统一，仅在数据中添加了此属性，在实际的运用中并未适使用此属性
                switch (i) {
                    case 1:
                        options.data.push({
                            type: 1,
                            name: "输入框",
                            required: false,
                            placeholder: "请输入",
                            soRt: options.data.length + 1,
                            field: ""
                        });
                        break;
                    case 2:
                        options.data.push({
                            type: 2,
                            name: "下拉框",
                            required: false,
                            placeholder: "请选择",
                            option: new Array(),
                            soRt: options.data.length + 1,
                            field: ""
                        });
                        break;
                    case 3:
                        options.data.push({
                            type: 3,
                            name: "复选框",
                            option: new Array(),
                            required: false,
                            soRt: options.data.length + 1,
                            field: ""
                        });
                        break;
                    case 4:
                        options.data.push({
                            type: 4,
                            name: "单选框",
                            option: new Array(),
                            required: false,
                            soRt: options.data.length + 1,
                            field: ""
                        });
                        break;
                    case 5:
                        options.data.push({
                            type: 5,
                            name: "文本域",
                            placeholder: "请输入",
                            required: false,
                            soRt: options.data.length + 1,
                            field: ""
                        });
                        break;
                    default:
                        layer.msg("找不到对应的类型");
                        break;
                };
                //每次数据更新后，重新渲染视图区
                that.renderView();
                console.log(options.data)
            });
        };
        Class.prototype.viewEvents = function(){
            var that = this,options = that.config;
            options.viewElem.on('mouseover', '.'+ DRAGVIEW, function(e){
                $(this).css("background-color", "#e2e2e2");
                e.stopPropagation();
            });
            options.viewElem.on('mouseout', '.'+ DRAGVIEW, function(e){
                $(this).css("background-color", "");
                e.stopPropagation();
            });
            //同一个元素上含有不的事件，但event

            options.viewElem.on('click',  '*[' + VIEW_DEL_EVENT +']', function(e){
                console.log("a");
                e.stopPropagation();

            });
            options.viewElem.on('dblclick','*[' + VIEW_EVENT +']', function(e){
                console.log("b");
                e.stopPropagation();
            });
        };


        //核心入口
        dragForm.render = function(options){
            var inst = new Class(options);
            return thisForm.call(inst);
        };


    exports(MOD_NAME, dragForm);
});


