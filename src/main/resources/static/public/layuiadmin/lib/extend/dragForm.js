layui.define(['form','laytpl','layer'], function(exports){
    "use strict";
    var $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer,
        form = layui.form,
        hint = layui.hint(),
        MOD_NAME = 'dragForm',//组件名称
        VIEW_FORM_NAME = 'dragFormView',//视图区表单名称
        ATTR_FORM_NAME = 'dragFormAttr',//属性区表单名称
        DRAGINPUT = 'dragInput', COM_EVENT = 'dragForm-com-event',COM_EVENT_NAME = 'addToView',//组件区事件与事件名
        DRAGVIEW = 'dragView', VIEW_EVENT = 'dragForm-view-event',VIEW_EVENT_NAME = 'view',VIEW_DEL_EVENT="dragForm-view-del-event",VIEW_EVENT_DEL_NAME = 'del',//视图区事件与事件名
        DRAGTTR = 'dragAttr', ATTR_ADD_EVENT = "dragForm-attr-add-event",ATTR_EVENT_ADD_NAME = 'addOption', ATTR_DEL_EVENT = "dragForm-attr-del-event",ATTR_EVENT_DEL_NAME = 'delOperation', ATTR_SUBMIT_EVENT = 'dragForm-attr-submit-event',ATTR_EVENT_SUBMIT_NAME = 'submitAttr',//属性区事件与事件名


        //控件区
        COMPONTENTS = ['<div class="layui-row">',
                            '{{# layui.each(d, function(index, item){ }}',
                                '<div class="layui-col-md6 ' + DRAGINPUT +'" ' + COM_EVENT +'="' + COM_EVENT_NAME +'" type="{{item.type}}">' ,
                                    '{{item.name}}',
                                '</div>',
                            '{{# }) }}' ,
                        '</div>'].join(''),
        //视图区
        VIEWS = ['<form class="layui-form" id="' + VIEW_FORM_NAME +'" lay-filter="' + VIEW_FORM_NAME +'">',
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
        ATTR = ['<form class="layui-form" id="' + ATTR_FORM_NAME + '" lay-filter="' + ATTR_FORM_NAME + '">',
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
            type:[{name:'输入框',type:'text'},{name:'下拉框',type:'select'},{name:'复选框',type:'checkbox'},{name:'单选框',type:'radio'},{name:'文本域',type:'textarea'}]
        };
        Class.prototype.render = function(){
            var that = this,
                options = that.config;

            options.comElemOrgin = document.getElementById(options.comElem.replace("#",""));
            options.viewElemOrgin = document.getElementById(options.viewElem.replace("#",""));
            options.attrElemOrgin = document.getElementById(options.attrElem.replace("#",""));
            options.comElem = $(options.comElem);
            options.viewElem = $(options.viewElem);
            options.attrElem = $(options.attrElem);


            //如果是设计模式，则判断三个ID是否存在，存在则渲染，否则返回
            if(options.design){
                if(!options.comElem[0] || !options.viewElem[0] || !options.attrElem[0]){
                    return that;
                }else{
                    that.renderCom();
                    that.renderView();

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
                str = "",
                _getStr = function(i,data){
                    str += '<div class="layui-col-md6" ' + COM_EVENT +'="' + COM_EVENT_NAME +'" type="' + data.type +'">';
                    str += data.name;
                    str += '</div>'
                };
            str += '<div class="layui-row">';
            for(var i = 0 ; i < options.type.length ; i++){
                _getStr(i,options.type[i]);
            };
            str += '</div>';
            options.comElemOrgin.innerHTML = str;

        };
        //视图区渲染
        Class.prototype.renderView = function(){
            var that = this,
                options = that.config,
                str = '',
                _getStr = function(i,data){

                    str += '<div class="layui-row"><div class="layui-col-md10" index="' + i +'" ' + VIEW_EVENT +'="' + VIEW_EVENT_NAME + '" onselectstart="return false"><div class="layui-form-item">';

                    str +=  '<label class="layui-form-label">';
                    if(data.required){
                        str += '<span style="color:red">*</span>';
                    }
                    str += '<span>' + data.name + '</span>';
                    str += '</label>';

                    str += '<div class="layui-input-block">';
                    if(data.type == 'select'){
                        str += '<select name="' + data.field + '"';
                        str += data.required?' required lay-verify="required">':'>';
                        str += '<option value="">' + data.placeholder + '</option>';
                        for(var j = 0 ; j < data.option.length ; j++){
                            str += '<option value="' + data.option[j] +'">' + data.option[j] +'</option>';
                        }
                        str += '</select>';
                    }else if(data.type == 'textarea'){

                        str += '<textarea name="' + data.field + '" ';
                        str += data.required?' required lay-verify="required"':'';
                        str += data.placeholder?' placeholder="' + data.placeholder + '"':'';
                        str += ' autocomplete="off" class="layui-textarea"></textarea>';

                    }else if(data.type == 'checkbox' || data.type == 'radio'){
                        for(var m = 0 ; m < data.option.length ; m++){
                            str += '<input type="' + data.type +  '"';
                            str += (data.type == "checkbox")?' name="' + data.field +'[]"':' name="' + data.field + '"';
                            str += ' title="' + data.option[m] +'"';
                            str += (data.type == "checkbox")?' lay-skin="primary">':'>';
                        }
                    }else{
                        str += '<input type="' + data.type + '" name="' + data.field + '" ';
                        str += data.required?' required lay-verify="required"':'';
                        str += data.placeholder?' placeholder="' + data.placeholder + '"':'';
                        str += ' autocomplete="off" class="layui-input">';
                    }
                    str += '</div>';
                    str += '</div></div>';
                    str += '<div class="layui-col-md2" style="height: 58px;line-height: 58px;">';
                    str += '<button class="layui-btn layui-btn-danger layui-btn-sm" type="button" ' + VIEW_DEL_EVENT +'="' + VIEW_EVENT_DEL_NAME +'" index="' + i +'">删除</button>';
                    str += '</div>';
                    str += '</div>';
                };
            that.dataSort();
            str += '<form class="layui-form">';
            for(var i = 0 ; i < options.data.length ; i++){
                _getStr(i,options.data[i])
            }
            str += '</form>';
            options.viewElemOrgin.innerHTML = str;
            // //借助layui.form重新渲染视图区
            form.render();

        };
        //属性区渲染
        Class.prototype.renderAttr = function(i){
            var that = this,
                options = that.config,
                str = "",
                _getStr = function(data){
                    //名称
                    str += '<div class="layui-form-item"><label class="layui-form-label">名称：</label><div class="layui-input-block"><input type="text" name="name" required  lay-verify="required" placeholder="请输入名称" autocomplete="off" class="layui-input" value="' + data.name +'"></div></div>';
                    //checkbox和radio没有是否必填和提示语
                    if(data.type != 'checkbox' && data.type != 'radio'){
                        //是否必填
                        str += '<div class="layui-form-item"><label class="layui-form-label">是否必填：</label><div class="layui-input-block">';
                        str += '<input type="checkbox" name="required" lay-skin="switch" value="true" lay-text="是|否"';
                        str += data.required?"checked>":">";
                        str += '</div></div>';
                        //提示语
                        str +=  '<div class="layui-form-item"><label class="layui-form-label">提示语：</label><div class="layui-input-block">';
                        str += '<input type="text" name="placeholder" placeholder="请输入提示语" autocomplete="off" class="layui-input" value="' + data.placeholder +'">';
                        str += '</div></div>';
                    }
                    //checkbox、radio和select有可选项
                    if(data.type == 'checkbox' || data.type == 'radio' || data.type == 'select'){
                        str += '<div class="layui-form-item"><label class="layui-form-label">可选项</label><div class="layui-input-block"><button class="layui-btn layui-btn-sm" type="button" ' + ATTR_ADD_EVENT +'="' + ATTR_EVENT_ADD_NAME +'">添加</button></div></div>';
                        if(data.option.length !=0){
                            for(var i = 0 ; i < data.option.length ;i++){
                                str += '<div class="layui-form-item"><label class="layui-form-label"></label><div class="layui-input-inline"><input type="text" name="option[]" value="' + data.option[i] +'" autocomplete="off" class="layui-input"></div><button class="layui-btn layui-btn-danger layui-btn-sm" ' + ATTR_DEL_EVENT +'="' + ATTR_EVENT_DEL_NAME + '" type="button">删除</button></div>';
                            }
                        }else{
                            str += '<div class="layui-form-item"><label class="layui-form-label"></label><div class="layui-input-inline"><input type="text" name="option[]" value="请输入选项" autocomplete="off" class="layui-input"></div><button class="layui-btn layui-btn-danger layui-btn-sm" ' + ATTR_DEL_EVENT +'="' + ATTR_EVENT_DEL_NAME + '" type="button">删除</button></div>';
                        }
                    }

                    //保存属性按钮
                    str += '<div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn layui-btn-sm" type="button" ' + ATTR_SUBMIT_EVENT + '="' + ATTR_EVENT_SUBMIT_NAME + '">保存属性</button></div></div>';
                };
            str += '<form class="layui-form" id="' + ATTR_FORM_NAME + '" lay-filter="' + ATTR_FORM_NAME + '">';
            _getStr(options.data[i]);
            str += '</form>';
            // var attrElem = laytpl(ATTR).render(options.data[i]);
            // options.attrElem.html(attrElem);
            options.attrElemOrgin.innerHTML = str;
            form.render(null,ATTR_FORM_NAME);
        };




        //事件处理
        //组件区事件
        Class.prototype.comEvents = function(){
            var that = this,options = that.config;
            that.addEventHandler(options.comElemOrgin,COM_EVENT,'mouseover', function(e){
                this.style.backgroundColor = '#e2e2e2';
                this.style.cursor = 'pointer';
            });
            that.addEventHandler(options.comElemOrgin,COM_EVENT,'mouseout', function(e){
                this.style.backgroundColor = '';
            });
            that.addEventHandler(options.comElemOrgin,COM_EVENT,'click', function(e){
                var othis = this,type = othis.getAttribute("type");
                options.data.push({
                    type: type,
                    name: type,
                    required: false,
                    placeholder: "",
                    option: new Array(),
                    soRt: options.data.length,
                    field: ""
                });
                //每次数据更新后，重新渲染视图区
                that.renderView();
            });
        };
        //视图区事件
        Class.prototype.viewEvents = function(){
            var that = this,
                options = that.config,
                _flag = true;//拖动事件标志位
            //视图区禁用浏览器自带事件
            options.viewElemOrgin.oncontextmenu = function(e){
                return false;
            };

            that.addEventHandler(options.viewElemOrgin,VIEW_EVENT,'mouseover', function(e){
                this.parentNode.style.backgroundColor = "#e2e2e2";
                this.parentNode.style.cursor = 'pointer';
            });
            that.addEventHandler(options.viewElemOrgin,VIEW_EVENT,'mouseout', function(e){
                this.parentNode.style.backgroundColor = "";
            });
            that.addEventHandler(options.viewElemOrgin,VIEW_DEL_EVENT,'click', function(e){
                var i = this.getAttribute("index");
                options.data.splice(i,1);
                //重新渲染视图区
                that.renderView();
                //清空属性区
                options.attrElemOrgin.innerHTML = "";
            });

            that.addEventHandler(options.viewElemOrgin,VIEW_EVENT,'dblclick', function(e){
                that.setCss(this.parentNode.parentNode.childNodes,'border',"");
                this.parentNode.style.border = "1px dashed red";
                var i = this.getAttribute("index");
                that.renderAttr(i);
            });

            that.addEventHandler(options.viewElemOrgin,VIEW_EVENT,'mousedown',function(e){
                if(_flag && e.which == 3){
                    var _i = this.getAttribute("index"),
                        _PLACEHOLDER = that.strToDom('<div class="layui-row" style="height: ' + this.parentNode.offsetHeight +'px;border: 1px dashed grey;">');
                    that.newIndex = _i;//获取当前点击得元素索引,添加到操作的实例上，在元素落下时，这个值会改变
                    that.dragData = options.data[_i];//获取当前点击元素对应的数据，方便操作结束后插入数据
                    that.placeholder = _PLACEHOLDER;//占位div
                    that.mouseX = e.pageX;//当前鼠标落下的位置
                    that.mouseY = e.pageY;

                    that.posotionY = $(this).parent().position().top + $(this).parent().scrollTop();

                    // that.dragDom = this.parentNode.setAttribute("style","position:absolute;left:" + that.posotionX +"px;top:" + that.posotionY +"px;z-index:800;width:" + $(this).parent().width() +"px;background-color:#e2e2e2 ;!important");


                }
            });

            // options.viewElem.on('mousedown','*[' + VIEW_EVENT +']',function(e) {
            //     if(_flag){
            //         var _index = $(this).attr("index"),
            //             _viewElemOrgin = document.getElementById(options.viewElem.selector.replace("#","")).children[0],
            //             _PLACEHOLDER = that.strToDom('<div class="layui-row" style="height: ' + $(this).parent().height() +'px;border: 1px dashed grey;">');
            //
            //         //拖拽事件中可能所需的数据
            //         that.newIndex = _index;
            //         that.dragData = options.data[_index];
            //         that.dragDom = that.JQdomToStr($(this).parent().clone(true));
            //         that.placeholder = _PLACEHOLDER;
            //         that.mouseX = e.pageX;
            //         that.mouseY = e.pageY;
            //         that.posotionY = $(this).parent().position().top + $(this).parent().scrollTop();
            //         that.posotionX = $(this).parent().position().left + $(this).parent().scrollLeft();
            //
            //         that.dragDom.setAttribute("style","position:absolute;left:" + that.posotionX +"px;top:" + that.posotionY +"px;z-index:800;width:" + $(this).parent().width() +"px;background-color:#e2e2e2 ;!important");
            //
            //     //鼠标右键落下
            //     if(e.which == 3){
            //             //TODO 拖拽事件优化
            //             that.rangeX = [options.viewElem.offset().left,options.viewElem.offset().left + options.viewElem.width()];
            //             that.rangeY = [options.viewElem.offset().top ,options.viewElem.offset().top + options.viewElem.height()];
            //             options.data.splice(_index,1);
            //             _flag = false;
            //             _viewElemOrgin.insertBefore(_PLACEHOLDER,_viewElemOrgin.children[_index]);
            //             $(this).parent().remove();
            //             var otherPosition = options.viewElem.children("form").children("div");
            //             that.centerPosition = new Array();
            //             for(var i = 0 ; i < otherPosition.length-1 ; i++){
            //                 if(i == 0){
            //                     that.centerPosition.push([options.viewElem.children("form").offset().top,that.calculateCenter(otherPosition[i])]);
            //                 };
            //                 that.centerPosition.push([that.calculateCenter(otherPosition[i]),that.calculateCenter(otherPosition[i+1])]);
            //             }
            //
            //             _viewElemOrgin.appendChild(that.dragDom);
            //
            //             //设置可编辑区样式
            //             options.viewElem.css("border","5px solid red");
            //
            //             $(document).on("mousemove",function (e) {
            //                 that.calculate(e);
            //             });
            //             $(document).on("mouseup",function (e) {
            //                 options.data.splice(that.newIndex,0,that.dragData);
            //                 $(that.placeholder).remove();
            //                 $(that.dragDom).remove();
            //                 //重新渲染视图区
            //                 that.renderView();
            //                 //清空属性区
            //                 options.attrElem.html("");
            //                 //标志位置空
            //                 _flag = true;
            //                 //清空监听事件
            //                 $(document).off("mousemove");
            //                 $(document).off("mouseup");
            //                 //移除可编辑区样式
            //                 options.viewElem.css("border","");
            //                 //清空不必要的缓存
            //                 delete that.newIndex;
            //                 delete that.dragData;
            //                 delete that.dragDom;
            //                 delete that.placeholder;
            //                 delete that.mouseX;
            //                 delete that.mouseY;
            //                 delete that.posotionY;
            //                 delete that.posotionX;
            //                 delete that.centerPosition;
            //                 delete that.rangeY;
            //                 delete that.rangeX;
            //
            //             })
            //     }
            //     }
            //     return false;
            // });
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
                var data = _dataReset($("#" + ATTR_FORM_NAME +"").serializeArray());
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
            // options.data.sort(function (a, b) { return a.soRt - b.soRt });
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
        Class.prototype.JQdomToStr = function(dom){
            //TODO 脱离layui框架的约束
            // var str = dom.html();
            var str = dom.prop("outerHTML");
            var div = document.createElement("div");
            if(typeof str == "string")
                div.innerHTML = str ;
            return div.childNodes[0].cloneNode(true);
        };

        //重写事件委托，并兼容IE
        Class.prototype.addEventHandler = function(target,selector,type,fn){
        var _eventfn = function(e){
            var e = e || window.event;
            var t = e.target || e.srcElement;
            var _recursive = function(elem){
                if(elem.getAttribute(selector)){
                    fn.call(elem,e);
                }else{
                    if(elem.parentNode != target && elem!= target) {
                        _recursive(elem.parentNode);
                    }
                }
            };
            _recursive(t);
        };
        if(target.addEventListener){
            target.addEventListener(type,_eventfn);
        }else{
            target.attachEvent("on"+type,_eventfn);
        };
    };
        //批量设置子元素样式
        Class.prototype.setCss = function(nodeList,css,value){
        for(var i = 0 ; i < nodeList.length ;i++){
            nodeList[i].style[css] = value;
        }
    };

        //计算拖拽DIV当前位置
        Class.prototype.calculate = function(e){
            var that = this,
                options = that.config,
                _viewElemOrgin = document.getElementById(options.viewElem.selector.replace("#","")).children[0],
                nowX = e.pageX,
                nowY = e.pageY,
                x = that.posotionX + nowX - that.mouseX,
                y = that.posotionY + nowY - that.mouseY;

            if(nowX > that.rangeX[0] && nowX < that.rangeX[1] && nowY > that.rangeY[0] && nowY < that.rangeY[1]){
                for(var i = 0 ; i < that.centerPosition.length ; i++){
                    if(that.centerPosition[i][0] < nowY && that.centerPosition[i][1] > nowY){
                        _viewElemOrgin.insertBefore(that.placeholder,_viewElemOrgin.children[i]);

                        //BUG fixed 数据刷新时，组件会错位，原因：占位div也占了一个索引，鼠标在占位div上下移动时，
                        //在div之上则没问题，在div之下，则刷新数据时，默认将数据插入了靠后的索引位置上。因为数据数组并没有占位的数据
                        if(that.placeholder != _viewElemOrgin.children[i]){
                            that.newIndex = i-1;
                        }else{
                            that.newIndex = i;
                        }

                    }
                }
                that.dragDom.style.left = x + "px";
                that.dragDom.style.top = y + "px";
            }
        };
        //当前视图区每个div的中心点
        Class.prototype.calculateCenter = function(item){
            return $(item).offset().top + $(item).scrollTop() + $(item).height()/2
        };




        //核心入口
        dragForm.render = function(options){
            var inst = new Class(options);
            return thisForm.call(inst);
        };


    exports(MOD_NAME, dragForm);
});


