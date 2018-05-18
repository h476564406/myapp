import Watcher from './Watcher';
// 给每个指令绑定回调函数。如果属性更改，则触发updater.

export const CompileUtil = {
    text(node, vm, property) {
        this.bindWatcherAndCallback(node, vm, property, 'text');
    },
    html(node, vm, property) {
        this.bindWatcherAndCallback(node, vm, property, 'html');
    },
    class(node, vm, property) {
        this.bindWatcherAndCallback(node, vm, property, 'class');
    },
    // 可输入元素的value
    model(node, vm, property) {
        this.bindWatcherAndCallback(node, vm, property, 'model');
        const value = this._getVMVal(vm, property);
        // 当 <input> 或 <textarea> 元素的值更改时
        // switch change
        node.addEventListener('input', e => {
            const newValue = e.target.value;
            if (value === newValue) {
                return;
            }
            this._setVMVal(vm, property, newValue);
        });
    },
    // 根据初始化的data渲染视图
    bindWatcherAndCallback(node, vm, property, directive) {
        const updater = {
            textUpdater(value) {
                // 不可以这么做，nodevalue只能对文本节点设值，但是模版里可能会直接在元素节点上挂在V-text
                // node.nodeValue = value;
                // 不可以这么做，文本节点没有innerText undefined
                // node.innerText = value;
                const text = node.textContent;
                if (CompileUtil.brace) {
                    node.textContent = text.replace(CompileUtil.brace, value);
                } else {
                    node.textContent = value;
                }
                CompileUtil.brace = '';
            },
            htmlUpdater(value) {
                node.innerHTML = value || '';
            },
            classUpdater(newClass) {
                const { className } = node;
                const value = String(newClass) ? newClass : '';
                node.className = className ? ' ' : `${value}`;
            },
            modelUpdater(value) {
                node.value = value || '';
            },
        };
        const updaterFn = updater[`${directive}Updater`];
        // 第一次渲染 view, 此时Dep.readyWatcher还不存在，this._getVMVal只是得到值。
        updaterFn && updaterFn(this._getVMVal(vm, property));
        // 连接watcher和deps, 并触发访问属性的get函数
        new Watcher(vm, property, value => {
            updaterFn && updaterFn(value);
        });
    },
    eventHandler(node, vm, property, directive) {
        const eventType = directive.split(':')[1]; // on:click
        const fn = vm.$options.methods && vm.$options.methods[property];
        // 如果第一个值是对象, 则返回第二个操作数
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    _getVMVal(vm, property) {
        let value = vm;
        property.split('.').forEach(element => {
            value = value[element];
        });
        return value;
    },
    _setVMVal(vm, property, value) {
        let val = vm;
        const properties = property.split('.');
        properties.forEach((k, i) => {
            // 未到最后一级，调用每一级属性的访问函数get
            if (i < properties.length - 1) {
                val = val[k];
            } else {
                // 当属性存的是基本数据类型，赋值给val[k], 调用set，从而通知watcherd调用更新函数
                val[k] = value;
            }
        });
    },
};
