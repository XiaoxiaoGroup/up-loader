export function noop() {}

/**
 * 合并对象
 */
export function merge(dest, src) {
    var r = {};
    for (var i in dest) {
        if (dest.hasOwnProperty(i)) {
            r[i] = dest[i];
        }
    }
    for (var i in src) {
        if (src.hasOwnProperty(i)) {
            r[i] = src[i];
        }
    }
    return r;
}

/**
 * 兼容低版本ie和现代浏览器的事件绑定方法
 * @param {Element|ElementArray} el 目标元素
 * @param {String} type 事件名称
 * @param {Function} fn 事件处理函数
 */
export function addEvent(el, type, fn) {
    (function() {
        if (document.addEventListener) {
            return function(el, type, fn) {
                if (el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                } else {
                    el.addEventListener(type, fn, false);
                }
            };
        } else {
            return function(el, type, fn) {
                if (el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                } else {
                    el.attachEvent('on' + type, function() {
                        return fn.call(el, window.event);
                    });
                }
            };
        }
    })()(el, type, fn);
}

/**
 * 生成不重复id
 */
var id = 0;
export function genId() {
    return id++;
}

/**
 * 遍历方法
 * @param {Array} arr 
 * @param {Function} handler 
 */
export function forEach(arr, handler) {
    for (var i = 0; i < arr.length; i++) {
        var signal = handler(arr[i], i);
        if (signal !== undefined) {
            if (signal) {
                continue;
            } else {
                break;
            }
        }
    }
}
