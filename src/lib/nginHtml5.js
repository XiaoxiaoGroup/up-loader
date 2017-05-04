import {addEvent, genId, forEach} from './util'

export default function NginHtml5(opts) {
    this.getFiles = function (e) {
		// 获取文件列表对象
		var files = e.target.files || e.dataTransfer.files;
        // 过滤文件
        files = opts.filter(files);
        // 设置唯一索引
        forEach(files, function (file) {
            file.index = genId();
        });
		//继续添加文件
		opts.fileList = opts.fileList.concat([].slice.call(files));
        //执行选择回调
		opts.onSelect(files);
		return this;
    }
    this.deleteFile = function(fileDelete) {
        var index = opts.fileList.indexOf(fileDelete);
        if (!~index) {
            return this;
        }
        opts.fileList.splice(index, 1);
		return this;
    }
    this.uploadFiles = function(e) {
        var self = this;
		forEach(opts.fileList, function (file, i) {
            var data = new FormData();
            for (var j in opts.data) {
                if (opts.data.hasOwnProperty(j)) {
                    data.append(j, opts.data[j]);
                }
            }
            data.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                var result;
                if (xhr.status < 200 || xhr >= 300) {
                    return opts.onFailure(file, new Error('cannot post ' + opts.url + ' ' + xhr.status));
                }
                result = xhr.responseText || xhr.response;
                if (opts.dataType == 'json' && result) {
                    result = JSON.parse(result);
                }
                opts.onSuccess(file, result);
                self.deleteFile(file);
                opts.onFinish(file);
                if (!opts.fileList.length) {
                    //全部完毕
                    opts.onComplete();
                }
            }
            xhr.onerror = function (e) {
                opts.onFailure(file, e);
                opts.onFinish(file);
            }
            xhr.upload.onprogress = function (e) {
                opts.onProgress(file, e.loaded, e.total);
            }
            xhr.open('post', opts.url, true);
            xhr.send(data);
		});
    }
}