import { observe } from './Observer';
import Compile from './Compile';
// mvvm入口函数，整合Observer, Watcher, Compile
function MVVM(options) {
    this.$options = options || {};
    this._data = options.data();
    const data = this._data;
    // vm.xxx代理vm._data, 对外开放vm.xxx
    Object.keys(data).forEach(property => this._proxyData(property), this);
    this._initComputed();
    observe(data, this);
    this.$compile = new Compile(options.el || document.body, this);
}
MVVM.prototype = {
    _proxyData(property) {
        Object.defineProperty(this, property, {
            configurable: false,
            enumerable: true,
            get() {
                return this._data[property];
            },
            set(newVal) {
                this._data[property] = newVal;
            },
        });
    },
    _initComputed() {
        const { computed } = this.$options;
        const self = this;
        if (
            computed &&
            Object.prototype.toString.call(computed) === '[object Object]'
        ) {
            Object.keys(computed).forEach(key => {
                // console.log('this', this); // undefined
                if (typeof computed[key] !== 'function') {
                    throw new Error('Must be function!');
                }
                Object.defineProperty(self, key, {
                    get: computed[key],
                    set() {},
                });
            });
        }
    },
};

export default MVVM;
