function FileListPlugin() {
    // 使用配置（options）设置插件实例
}

FileListPlugin.prototype.apply = compiler => {
    compiler.plugin('emit', (compilation, callback) => {
        // console.log(compiler.hooks);
        // console.log('compilation', compilation.assets);
        // console.log('compilation', compilation.chunks);
        const fileList = Object.keys(compilation.assets);
        const js = [];
        const css = [];
        fileList.forEach(fileName => {
            const fileType = fileName.substring(fileName.lastIndexOf('.'));
            if (fileType === '.js') {
                js.push(fileName);
            } else if (fileType === '.css') {
                css.push(fileName);
            }
        });
        const clientFileList = JSON.stringify({
            js,
            css,
        });
        // console.log(compilation.assets['index.html'].source());
        // 把它作为一个新的文件资源插入到 webpack 构建中：
        compilation.assets['clientFileList.json'] = {
            source() {
                return clientFileList;
            },
            size() {
                return clientFileList.length;
            },
        };
        callback();
    });
};

module.exports = FileListPlugin;
