import Dep from './Dep';
// 数据监听器 对数据对象的所有属性进行监听，发生变化了，通知订阅者
export function Observer(data) {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
        return false;
    }
    Object.keys(data).forEach(property => {
        this.defineReactive(data, property, data[property]);
    });
}
export function observe(value) {
    if (!value || Object.prototype.toString.call(value) !== '[object Object]') {
        return;
    }
    return new Observer(value);
}
Observer.prototype = {
    // 对data里的每个属性进行监听， 直到每个属性的子属性值为基本变量数据
    defineReactive(data, property, value) {
        const dep = new Dep(property);
        // 如果不这么做，在访问子属性的时候子属性没办法被劫持，那么就无法触发watcher
        // 让子属性也能被get劫持，并且和父属性挂在一个watcher上
        observe(value);
        Object.defineProperty(data, property, {
            enumerable: true,
            configurable: false,
            get() {
                // 如果有属性在模板中出现，在模版解析过程中，会设置一个未与任何属性绑定的待用new Watcher
                if (Dep.readyWatcher) {
                    // 1.watcher会遍历取得最后的值，将属性值的每一个子属性注册到同一个watcher中
                    // 属性相关的一个watcher可能对应多个dep, 属性的子属性变化，watcher会收到通知， 并且因为在同一个实例中，能对父属性进行处理。
                    // watcher.depIds[dep.id] = dep;
                    // data.user.name  两个 dep1 user, dep2 name
                    // 2.可能模板中多处用到了某个属性user, user可以被多个 watcher订阅。
                    // 一个属性可能对应多个watcher
                    // dep.addWatcher(watcher);
                    // 往dep中注册watcher， dep通知watcher更新
                    dep.connect(Dep.readyWatcher);
                }
                return value;
            },
            set(newValue) {
                if (newValue === value) {
                    return;
                }
                value = newValue;
                // 如果该属性赋值的是对象，要监听这个对象。
                // 赋值情况下才会被监听，data.child = {},改变对象的属性不会被监听data.child.property = ''
                // childObj = observe(newValue);
                // 通知订阅者
                // console.log('dep', dep.name, dep);
                dep.notify();
            },
        });
    },
};
