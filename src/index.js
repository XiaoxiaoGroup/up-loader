import {noop, extend, addEvent} from './lib/util'
import isSupportFormData from './lib/isSupportFormData'
import NginHtml5 from './lib/nginHtml5'
import NginIFrame from './lib/nginIFrame'

var uploader = null;
var defaultOpts = {
    fileInput: null,				//html file控件
	url: '',						//ajax地址
    paramName: 'file',
    dataType: 'json',               //响应数据格式
	fileList: [],					//过滤后的文件数组
	filter: function(files) {		//选择文件组的过滤方法
		return files;
	},
	onSelect: noop,		            //文件选择后
	onFinish: noop,		            //文件删除后
	onProgress: noop,		        //文件上传进度
	onSuccess: noop,		        //文件上传成功时
	onFailure: noop,		        //文件上传失败时,
	onComplete: noop		        //文件全部上传完毕时
};

function init(opts) {
    var instance = {
        opts: extend(defaultOpts, opts)
    };
    
    if (isSupportFormData()) {
        // 如果支持FormData则使用Html5引擎
        instance.ngin = new NginHtml5(instance.opts);
    } else {
        // 不支持则使用IFrame引擎
        instance.ngin = new NginIFrame(instance.opts);
    }
        
    //文件选择控件选择
    if (instance.opts.fileInput) {
        addEvent(instance.opts.fileInput, 'change', function(e) {
            instance.ngin.getFiles(e);
        });
    }
    
    // 上传文件
    instance.upload = function() {
        this.ngin.uploadFiles();
    };

    return instance;
}

export default {
    init: init
}