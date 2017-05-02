import {addEvent, genId, forEach} from './util'

export default function NginHtml5(opts) {
    console.log('当前引擎为：HTML5');
    this.getFiles = function (e) {
		// 获取文件列表对象
		var files = e.target.files || e.dataTransfer.files;
        // 过滤文件
        files = opts.filter(files);
        // 设置唯一索引
        forEach(files, function (file) {
            file.index = genId();
            console.log(file.id);
        });
		//继续添加文件
		opts.fileList = opts.fileList.concat([].slice.call(files));
        //执行选择回调
		opts.onSelect(files);
		return this;
    }
    this.deleteFile = function(fileDelete) {
        var arrFile = [];

		for (var i = 0, file; file = opts.fileList[i]; i++) {
			if (file != fileDelete) {
				arrFile.push(file);
			} else {
				opts.onFinish(fileDelete);
			}
		}
		opts.fileList = arrFile;
		return this;
    }
    this.uploadFiles = function(e) {
        var self = this;
		for (var i = 0, file; file = opts.fileList[i]; i++) {
			(function(file) {
                var data = new FormData();
                for (var j in opts.data) {
                    if (opts.data.hasOwnProperty(j)) {
                        data.append(j, opts.data[j]);
                    }
                }
                data.append('file', file);
                var xhr = new XMLHttpRequest();
                xhr.onload = function(result) {
                    opts.onSuccess(file, this.responseText);
                    self.deleteFile(file);
                    if (!opts.fileList.length) {
                        //全部完毕
                        opts.onComplete();
                    }
                }
                xhr.onerror = function (e) {
                    opts.onFailure(file, e)
                }
                xhr.upload.onprogress = function (e) {
                    opts.onProgress(file, e.loaded, e.total);
                }
                xhr.open('post', opts.url, true);
                xhr.send(data);
			})(file);
		}
    }
}