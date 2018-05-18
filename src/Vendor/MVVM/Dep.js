// 属性的id, watcher中用dep.id来判断是否已经监听某属性
let id = 0;
function Dep(name) {
    id += 1;
    this.id = id;
    this.name = name;
    this.watchers = [];
}
Dep.target = null;
Dep.prototype = {
    connect() {
        Dep.readyWatcher.addNewDep(this);
    },
    notify() {
        this.watchers.forEach(watcher => {
            console.log(watcher);
            watcher.update();
        });
    },
    addWatcher(sub) {
        this.watchers.push(sub);
    },
    removeWatcher(sub) {
        const index = this.watchers.indexOf(sub);
        if (index !== -1) {
            this.watchers.splice(index, 1);
        }
    },
};
export default Dep;
