import Dep from './Dep';
// 数据观察者，订阅者，在数据变化的时候会收到发布器的通知, 执行v-指令绑定的相应回调函数
const watcherHouse = [];
function Watcher(vm, property, callback) {
    this.vm = vm;
    this.callback = callback;
    // 属性值可能是函数值和其他值。
    this.property = property;
    this.depIds = {};
    this.get = this.triggerPropertiesGet(property);
    this.value = this._connectDeps();
}
Watcher.prototype = {
    _connectDeps() {
        Dep.readyWatcher = this;
        // 如果属性不是函数，则遍历取得最后的值。在这个过程中，通过访问每个属性触发了defineProperty中的get.
        // 如果属性是函数，则调用这个函数， 返回执行结果。
        this.get.call(this.vm, this.vm);
        watcherHouse.push(Dep.readyWatcher);
        // console.log('watcherHouse', watcherHouse);
        Dep.readyWatcher = null;
    },
    addNewDep(dep) {
        // 如果没有监控过，才监控该属性
        //  如果一个computed方法里用了child.child1.user和child.child1.info，那么child child1不会在第二次重复添加
        if (!this.depIds[dep.id]) {
            dep.addWatcher(this);
            this.depIds[dep.id] = dep;
        }
    },
    triggerPropertiesGet(property) {
        const properties = property.split('.');
        // value = this.vm
        return function (value) {
            for (let i = 0, len = properties.length; i < len; i += 1) {
                // vm.getHelloWorld()里this.property 触发了访问属性中的get函数，从而将两个dep绑定到了当前的watcher
                value = value[properties[i]];
            }
            return value;
        };
    },
    update() {
        const newValue = this.get.call(this.vm, this.vm);
        const oldValue = this.value;
        if (newValue !== oldValue) {
            this.value = newValue;
            this.callback.call(this.vm, newValue, oldValue);
        }
    },
};
export default Watcher;
