import {extend, genId, addEvent, forEach} from './util'

export default function NginIFrame(opts) {
    var self = this;
    this.getFiles = function (e) {
        var target = e.target || e.srcElement;
        var id = target.getAttribute('id');
        var iframeId = '_stfileuploader' + genId();
        var formId = '_form' + iframeId;
        var ifm = createIframe(iframeId);
        var form = createForm(ifm, formId);
        var clone = target.cloneNode(true);
        
        target.removeAttribute('id');
        clone.setAttribute(id);
        target.parentNode.insertBefore(clone, target);
        target.setAttribute('name', opts.paramName);
        form.appendChild(target);
        // 创建数据域
        createField(form, opts.data);
		// //继续添加文件
        var files = [{
            iframeId: iframeId,
            formId: formId,
            name: target.value.replace(/.*\\/, '')
        }];
        // 过滤文件
        files = opts.filter(files);
        // 设置唯一索引
        forEach(files, function(file) {
            file.index = genId();
        });
		opts.fileList = opts.fileList.concat(files);
        //执行选择回调
		opts.onSelect(files);
		return this;
    }
    this.deleteFile = function(fileDelete) {
        // IE8及以下数组不支持indexOf，手动实现
        var index = -1;
        forEach(opts.fileList, function (file, i) {
            if (file === fileDelete) {
                index = i;
            }
        });
        if (!~index) {
            return this;
        }
        var deletedFile = opts.fileList.splice(index, 1)[0];
        if (deletedFile) {
            // 删除iframe和form
            document.body.removeChild(document.getElementById(deletedFile.iframeId));
            document.body.removeChild(document.getElementById(deletedFile.formId));
        }
		return this;
    }
    this.uploadFiles = function(e) {
        var self = this;
		forEach(opts.fileList, function (file, i) {
            var ifm = document.getElementById(file.iframeId);
            addEvent(ifm, 'load', function() {
                try {
                    // ie67不支持contentDocument,所以改用了contentWindow
                    var result = ifm.contentWindow.document.body.innerHTML, eval2 = eval;
                    // 如果配置dataType为json则解析json,否则直接返回字符串
                    if (opts.dataType == 'json') {
                        if (typeof JSON != 'undefined' && JSON.parse) {
                            result = JSON.parse(result);
                        } else {
                            result = eval2('(' + result + ')');
                        }
                    }
                    opts.onSuccess(file, result);
                    self.deleteFile(file);
                } catch (error) {
                    opts.onFailure(file, error);
                }
                opts.onFinish(deletedFile);
                if (!opts.fileList.length) {
                    // 全部完毕
                    opts.onComplete();
                }
            });
            document.getElementById(file.formId).submit();
		});
    }
    this.destroy = function() {
        console.log('destroied');
    }
    
    /**
     * 创建iframe
     */
    function createIframe(id) {
        // ie 67 8? 下设置name无效，取代的是submitName
        // http://stackoverflow.com/questions/2138564/dynamic-iframe-ie-name-issue
        var ifm = /MSIE (6|7|8)/.test(navigator.userAgent) ? 
            document.createElement('<iframe name="' + id + '">') : 
            document.createElement('iframe');
        ifm.setAttribute('src', 'javascript:false;');
        ifm.setAttribute('id', id);
        ifm.setAttribute('name', id);
        ifm.style.display = 'none';
        document.body.appendChild(ifm);
        return ifm;
    }
    
    /**
     * 创建form
     */
    function createForm(ifm, id) {
        var form = document.createElement('form');
        form.setAttribute('id', id);
        form.setAttribute('method', 'post');
        form.setAttribute('action', opts.url);
        form.setAttribute('enctype', 'multipart/form-data');
        // 兼容ie67
        form.setAttribute('encoding', 'multipart/form-data');
        form.setAttribute('target', ifm.name);
        form.style.display = 'none';
        document.body.appendChild(form);
        return form;
    }
    
    /**
     * 创建数据域
     */
    function createField(form, data) {
        for (var j in data) {
            if (data.hasOwnProperty(j)) {
                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', j);
                input.setAttribute('value', data[j]);
                form.appendChild(input);
            }
        }
    }
}