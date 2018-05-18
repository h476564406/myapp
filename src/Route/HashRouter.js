/* <a href="#/index?index=1">index</a> */
function HashRouter(beforeFun = null) {
    this.beforeFun = beforeFun;
    this.init();
}
HashRouter.prototype = {
    _routers: {},
    register(path, component = '') {
        path = path.replace(/\s*/g, '');
        this._routers[path] = {
            name: path,
            component,
        };
    },
    _processUrl(url) {
        const urlDetails = url.split('?');
        const params = [];
        if (urlDetails.length > 1) {
            const query = urlDetails[1].split('&');
            query.forEach(value => {
                params.push(value);
            });
        }
        return {
            name: urlDetails[0].slice(1),
            params,
        };
    },
    init() {
        window.addEventListener('load', () => {
            this._urlChange();
        });
        window.addEventListener('hashchange', () => {
            this._urlChange();
        });
    },
    _urlChange() {
        const path = this._processUrl(window.location.hash).name;
        if (!this._routers[path]) {
            return null;
        }
        this._refresh(path);
    },
    _refresh(path) {
        const self = this;
        // if (self.beforeFun) {
        //     self.beforeFun({
        //         pathInfo: self._routers[path],
        //         next: function() {
        //             self._asyncLoad(self._routers[path].asyncJs, path);
        //         },
        //     });
        // } else {
        global.require(`../components/${self._routers[path].component}`);
        // }
    },
    // 切换之前一些处理
    // beforeHook: function(callback) {
    //     if (Object.prototype.toString.call(callback) === '[object Function]') {
    //         this.beforeFun = callback;
    //     } else {
    //         console.log('路由切换前钩子函数不正确');
    //     }
    // },
    // 路由异步懒加载js文件
    // _asyncLoad(file, path) {
    //     const self = this;
    //     console.log(`开始异步下载js文件${file}`);
    //     const _body = document.getElementsByTagName('body')[0];
    //     const scriptEle = document.createElement('script');
    //     scriptEle.type = 'text/javascript';
    //     scriptEle.src = file;
    //     scriptEle.onload = function() {
    //         console.log(`下载${file}完成`);
    //     };
    //     _body.appendChild(scriptEle);
    // },
};
// spaRouters.beforeHook(function(transition) {
//     setTimeout(function() {
//         transition.next('some params');
//     }, 3000);
// });
export default HashRouter;
