

layui.define(['form','laytpl','layer'], function(exports){
    "use strict";
    var $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer,
        form = layui.form,
        hint = layui.hint(),
        MOD_NAME = 'dragForm',
        DRAGINPUT = 'dragInput', COM_EVENT = 'dragForm-com-event',COM_EVENT_NAME = 'addToView',
        DRAGVIEW = 'dragView', VIEW_EVENT = 'dragForm-view-event',VIEW_EVENT_NAME = 'view',VIEW_DEL_EVENT="dragForm-view-del-event",VIEW_EVENT_DEL_NAME = 'del',
        DRAGTTR = 'dragAttr', ATTR_ADD_EVENT = "dragForm-attr-add-event",ATTR_EVENT_ADD_NAME = 'addOption', ATTR_DEL_EVENT = "dragForm-attr-del-event",ATTR_EVENT_DEL_NAME = 'delOperation',
        ATTR_SUBMIT_EVENT = 'dragForm-attr-submit-event',ATTR_EVENT_SUBMIT_NAME = 'submitAttr',

        //控件区
        COMPONTENTS = ['<div class="layui-row">',
                            '{{# layui.each(d, function(index, item){ }}',
                                '<div class="layui-col-md6 ' + DRAGINPUT +'" ' + COM_EVENT +'="' + COM_EVENT_NAME +'" type="{{item.type}}">' ,
                                    '{{item.name}}',
                                '</div>',
                            '{{# }) }}' ,
                        '</div>'].join(''),

        //视图区
        //TODO 优化渲染、可自定义校验
        VIEWS = ['<form class="layui-form" id="dragFormView" lay-filter="dragFormView">',
                    '{{# layui.each(d, function(index, item){ }}',
                        '<div class="layui-row">',
                            '<div class="layui-col-md10 ' + DRAGVIEW +'"index="{{index}}" ' + VIEW_EVENT +'="' + VIEW_EVENT_NAME + '" onselectstart="return false">',
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
                            '<div class="layui-col-md2" style="height: 58px;line-height: 58px;">',
                                '<button class="layui-btn layui-btn-danger layui-btn-sm" type="button" ' + VIEW_DEL_EVENT +'="' + VIEW_EVENT_DEL_NAME +'" index="{{index}}">删除</button>',
                            '</div>',
                        '</div>',
                    '{{# }) }}',
                        '<div class="layui-row">',
                                '<div class="layui-form-item">',
                                    '<div class="layui-input-block">',
                                        '<button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>',
                                    '</div>',
                                '</div>',
                        '</div>',
        '</form>'].join(''),

        //属性区
        //TODO 优化渲染、可自定义提交按钮
        ATTR = ['<form class="layui-form" id="configView" lay-filter="configView">',
                    '<div class="layui-form-item">',
                        '<label class="layui-form-label">名称：</label>',
                        '<div class="layui-input-block">',
                            '<input type="text" name="name" required  lay-verify="required" placeholder="请输入名称" autocomplete="off" class="layui-input" value="{{d.name}}">',
                        '</div>',
                    '</div>',
                    '{{# if(d.type != 3 && d.type != 4){ }}',
                        '<div class="layui-form-item">',
                            '<label class="layui-form-label">是否必填：</label>',
                            '<div class="layui-input-block">',
                                '<input type="checkbox" name="required" lay-skin="switch" value="true" lay-text="是|否" {{d.required?"checked":""}}>',
                            '</div>',
                        '</div>',
                    '{{# } }}',
                    '{{# if(d.placeholder){ }}',
                        '<div class="layui-form-item">',
                            '<label class="layui-form-label">提示语：</label>',
                            '<div class="layui-input-block">',
                                '<input type="text" name="placeholder" placeholder="请输入提示语" autocomplete="off" class="layui-input" value="{{d.placeholder}}">',
                            '</div>',
                        '</div>',
                    '{{# } }}',
                    '{{# if(d.option){ }}',
                        '<div id="test" >',
                            '<div class="layui-form-item">',
                                '<label class="layui-form-label">可选项</label>',
                                '<div class="layui-input-block">',
                                    '<button class="layui-btn layui-btn-sm" type="button" ' + ATTR_ADD_EVENT +'="' + ATTR_EVENT_ADD_NAME +'">添加</button>',
                                '</div>',
                            '</div>',
                            '{{# layui.each(d.option,function(index,item){ }}',
                            '<div class="layui-form-item">',
                                '<label class="layui-form-label"></label>',
                                '<div class="layui-input-inline">',
                                    ' <input type="text" name="option[]" value="{{item}}" autocomplete="off" class="layui-input">',
                                '</div>',
                            '<button class="layui-btn layui-btn-danger layui-btn-sm" ' + ATTR_DEL_EVENT +'="' + ATTR_EVENT_DEL_NAME + '" type="button">删除</button>',
                            '</div>',
                            '{{# }) }}',
                        '</div>',
                    '{{# } }}',
                    '<div class="layui-form-item">',
                        '<div class="layui-input-block">',
                            '<button class="layui-btn layui-btn-sm" type="button" ' + ATTR_SUBMIT_EVENT + '="' + ATTR_EVENT_SUBMIT_NAME + '">保存属性</button>',
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
                    hint.error('The viewElem ID was not found in the dragForm');
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

                    that.comEvents();
                    that.viewEvents();
                    that.attrEvents();
                }
            }else{
                //如果不是设计模式，则判断显示内容ID是否存在，存在则渲染，否则返回
                if(!options.viewElem[0]){
                    return that;
                }else{
                    that.renderView();
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
        //视图区渲染
        Class.prototype.renderView = function(){
            var that = this, options = that.config;
            that.dataSort();
            var viewElem = laytpl(VIEWS).render(options.data);
            options.viewElem.html(viewElem);
            //借助layui.form重新渲染视图区
            form.render(null,'dragFormView');

        };
        //属性区渲染
        Class.prototype.renderAttr = function(i){
            var that = this, options = that.config;
            var attrElem = laytpl(ATTR).render(options.data[i]);
            options.attrElem.html(attrElem);
            form.render(null,'configView');
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
                //只进行数据的添加，渲染交给laytpl
                //注意：必填属性默认为false。复选框、单选框没有必填的属性，为保证数据格式统一，仅在数据中添加了此属性，在实际的运用中并未适使用此属性
                switch (i) {
                    case 1:
                        options.data.push({
                            type: 1,
                            name: "输入框",
                            required: false,
                            placeholder: "请输入",
                            soRt: options.data.length,
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
                            soRt: options.data.length,
                            field: ""
                        });
                        break;
                    case 3:
                        options.data.push({
                            type: 3,
                            name: "复选框",
                            option: new Array(),
                            required: false,
                            soRt: options.data.length,
                            field: ""
                        });
                        break;
                    case 4:
                        options.data.push({
                            type: 4,
                            name: "单选框",
                            option: new Array(),
                            required: false,
                            soRt: options.data.length,
                            field: ""
                        });
                        break;
                    case 5:
                        options.data.push({
                            type: 5,
                            name: "文本域",
                            placeholder: "请输入",
                            required: false,
                            soRt: options.data.length,
                            field: ""
                        });
                        break;
                    default:
                        layer.msg("找不到对应的类型");
                        break;
                };
                //每次数据更新后，重新渲染视图区
                that.renderView();
            });
        };
        //视图区事件
        Class.prototype.viewEvents = function(){

            var that = this,options = that.config;

            options.viewElem.on('mouseover', '.'+ DRAGVIEW, function(e){
                $(this).parent().css("background-color", "#e2e2e2");
                e.stopPropagation();
            });
            options.viewElem.on('mouseout', '.'+ DRAGVIEW, function(e){
                $(this).parent().css("background-color", "");
                e.stopPropagation();
            });
            //视图区删除事件
            options.viewElem.on('click',  '*[' + VIEW_DEL_EVENT +']', function(e){
                var i = $(this).attr("index");
                options.data.splice(i,1);
                //重新渲染视图区
                that.renderView();
                //清空属性区
                options.attrElem.html("");
                e.stopPropagation();
            });
            options.viewElem.on('dblclick','*[' + VIEW_EVENT +']', function(e){
                $(this).parent().addClass("layui-bg-blue");
                $(this).parent().siblings().removeClass("layui-bg-blue");
                var i = $(this).attr("index");
                that.renderAttr(i);
                e.stopPropagation();
            });
            options.viewElem.bind('contextmenu',function(e) {
                console.log("a")

                return false;
            });

        };
        //属性区事件
        Class.prototype.attrEvents = function(){
            var that = this,options = that.config,
            _OPTIONS =  ['<div class="layui-form-item">',
                '<label class="layui-form-label"></label>',
                '<div class="layui-input-inline">',
                '<input type="text" name="option[]"  autocomplete="off" class="layui-input">',
                '</div>',
                '<button class="layui-btn layui-btn-danger layui-btn-sm" ' + ATTR_DEL_EVENT +'="' + ATTR_EVENT_DEL_NAME + '" type="button">删除</button>',
                '</div>'].join(''),


            _dataReset = function(formArr){
                var obj = {
                    option:new Array()
                };
                for(var i = 0 ; i < formArr.length ; i++){
                    if(/option/ig.test(formArr[i].name)){
                        obj.option.push(formArr[i].value)
                    }else{
                        obj[formArr[i].name] = formArr[i].value
                    }
                }
                if(obj.option.length == 0){
                    delete obj.option
                }
                return obj;
            };

            options.attrElem.on('click',  '*[' + ATTR_ADD_EVENT +']', function(e){
                document.getElementById("test").appendChild(that.strToDom(_OPTIONS));
                e.stopPropagation();
            });
            options.attrElem.on('click',  '*[' + ATTR_DEL_EVENT +']', function(e){
                $(this).parent().remove();
                e.stopPropagation();
            });
            options.attrElem.on('click',  '*[' + ATTR_SUBMIT_EVENT +']', function(e){
                var data = _dataReset($("#configView").serializeArray());
                var index = $(".layui-bg-blue").find(".dragView").attr("index");
                if(data.required){
                    data.required = true;
                }else{
                    data.required = false;
                }
                for(var i in data){
                    options.data[index][i] = data[i];
                };
                that.renderView();
                options.viewElem.find("form").children().eq(index).addClass("layui-bg-blue");
                e.stopPropagation();
            });

        };

        //工具类
        //数据排序
        Class.prototype.dataSort = function(){
            //TODO 排序有BUG
            var that = this,
                options = that.config;
            var len = options.data.length;
            //先进行一次排序，防止数据库返回数据乱序
            //在对sort进行重新赋值，删除表单某一个组件时，sort会断层
            options.data.sort(function (a, b) { return a.soRt - b.soRt });
            for(var i = 0 ; i < len ;i++){
                options.data[i].soRt = i;
            }
        };
        //jq 中append在IE可能会失效，故将str字符串转化为dom节点
        Class.prototype.strToDom = function(str){
            var div = document.createElement("div");
            if(typeof str == "string")
                div.innerHTML = str;
            return div.childNodes[0].cloneNode(true);
        };

        //核心入口
        dragForm.render = function(options){
            var inst = new Class(options);
            return thisForm.call(inst);
        };


    exports(MOD_NAME, dragForm);
});


