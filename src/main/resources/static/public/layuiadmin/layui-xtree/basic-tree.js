function layuiBasicTree(options) {
    var _this = this;
    _this._containerid = options.elem;
    _this._container = document.getElementById(options.elem);
    _this._options = options;
    _this.Loading(options);
}

//封装IE8 Class选择
layuiBasicTree.prototype.getByClassName = function (cn) {
    if (document.getElementsByClassName) return this._container.getElementsByClassName(cn);
    var _xlist = this._container.childNodes;
    var _xtemp = new Array();
    for (var i = 0; i < _xlist.length; i++) {
        var _xchild = _xlist[i];
        var _xclassNames = _xchild.getAttribute('class').split(' ');
        for (var j = 0; j < _xclassNames.length; j++) {
            if (_xclassNames[j] == cn) {
                _xtemp.push(_xchild);
                break;
            }
        }
    }
    return _xtemp;
};

//加载特效，且获取数据
layuiBasicTree.prototype.Loading = function (options) {
    var _this = this;
    _this.xloading = document.createElement("span"); //创建加载对象
    _this.xloading.setAttribute('class', 'layui-icon layui-anim layui-anim-rotate layui-anim-loop');
    _this.xloading.innerHTML = '&#xe63e;';
    _this.xloading.style.fontSize = "50px";
    _this.xloading.style.color = "#009688";
    _this.xloading.style.fontWeight = "bold";
    _this.xloading.style.marginLeft = _this._container.offsetWidth / 2 - 25 + 'px';
    _this.xloading.style.marginTop = _this._container.offsetHeight / 2 - 50 + 'px';
    _this._container.innerHTML = '';
    _this._container.appendChild(_this.xloading); //加载显示
    if (typeof (options.data) == 'object') {
        _this._dataJson = options.data;
        _this.Initial(options);
        return;
    }
};

//data验证后的数据初始化
layuiBasicTree.prototype.Initial = function (o) {
    var _this = this;
    _this._form = o.form; //layui from对象
    _this._domStr = "";  //结构字符串
    if (o.icon == null) o.icon = {
        open: 'layui-icon-triangle-d',
        close: 'layui-icon-triangle-r',
        end: 'layui-icon-note'
    };//默认图标样式
    _this._iconOpen = o.icon.open != null ? o.icon.open : 'layui-icon-triangle-d';
    _this._iconClose = o.icon.close != null ? o.icon.close : 'layui-icon-triangle-r';
    _this._iconEnd = o.icon.end != null ? o.icon.end : 'layui-icon-note';
    _this._disableClick = o.disableClick != null ? o.disableClick : false;
    _this._click = o.click != null ? o.click : function () {
    };
    _this._operateRender = o.operateRender != null ? o.operateRender : function () {
        return ""
    };
    // 渲染页面
    _this._domStr = _this.dataBind(_this._dataJson, '');
    _this.Rendering();
};

layuiBasicTree.prototype.dataBind = function (data, n) {
    var _this = this;
    var nodeHtml = '';
    if (data && data instanceof Array) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].children && data[i].children instanceof Array && data[i].children.length > 0) {
                var d = _this.dataBind(data[i].children, n + '<span style="margin:0 10px;">|</span>');
                nodeHtml += '<li><span style="color:#dfdfdf;">' + n + '</span><i class="layui-lyb-node layui-icon ' + _this._iconOpen + '" style="font-size: 18px;cursor: pointer;margin:0 2px;"></i><a style="cursor: pointer;" class="openClick" tree-data=\'' + JSON.stringify(data[i]) + '\'><span style="margin-left: 5px;">' + data[i].title + '</span></a><span style="float: right;">' + _this._operateRender(data[i]) + '</span>' + d + '</li>';
            } else {
                nodeHtml += '<li><span style="color:#dfdfdf;">' + n + '</span><span style="margin:0 2px;">—</span><a style="cursor: pointer;" class="openClick" tree-data=\'' + JSON.stringify(data[i]) + '\'><span style="margin-left: 5px;">' + data[i].title + '</span></a><span style="float: right;">' + _this._operateRender(data[i]) + '</span></li>';
            }
        }
    }
    return '<ul class="layui-lyb-item">' + nodeHtml + '</ul>';
};

layuiBasicTree.prototype.Rendering = function () {
    var _this = this;
    _this._container.innerHTML = _this._domStr;
    _this._domStr = "";

    /**
     * 点击事件
     */
    if(!_this._disableClick){
        var aNode = _this.getByClassName('openClick');
        for (var i = 0; i < aNode.length; i++) {
            aNode[i].onclick = function (e) {
                var aList = _this._container.getElementsByTagName('a');
                for (var k = 0; k < aList.length; k++) {
                    aList[k].style.fontWeight = '';
                    aList[k].style.color = '#2F4056';
                }

                this.style.fontWeight = 'bold';
                this.style.color = '#009688';

                try {
                    var obj = JSON.parse(this.getAttribute('tree-data'));
                    _this._click(obj);
                } catch (e) {
                    _this._click();
                }
            }
        }
    }

    /**
     * 展开或关闭事件
     */
    var lybNode = _this.getByClassName('layui-lyb-node');
    for (var i = 0; i < lybNode.length; i++) {
        lybNode[i].onclick = function (e) {
            var state = true;
            if (this.className && this.className.indexOf(_this._iconOpen) > -1) {
                state = false;
            }
            var d = this.parentNode.childNodes;
            for (var j = 0; j < d.length; j++) {
                if (d[j].nodeName == 'UL') {
                    if (state) {
                        this.classList.remove(_this._iconClose);
                        this.classList.add(_this._iconOpen);
                        d[j].style.display = 'block';
                    } else {
                        this.classList.remove(_this._iconOpen);
                        this.classList.add(_this._iconClose);
                        d[j].style.display = 'none';
                    }
                }
            }
        };
    }
};