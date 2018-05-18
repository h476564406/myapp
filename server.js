const express = require('express');
const clientFileList = require('./dist/clientFileList.json');
const { render } = require('./dist/bundle_server');

const app = express();
let css = '';
clientFileList.css.forEach(element => {
    css += ` <link rel="stylesheet" href="/dist/${element}">`;
}, this);
let scripts = '';
clientFileList.js.forEach(element => {
    scripts += `<script src="/dist/${element}"></script>`;
}, this);
console.log('scripts', scripts);
console.log('css', css);

// 其它请求路径返回对应的本地文件
app.use('/dist', express.static('./dist'));

// 调用构建出的 bundle_server.js 中暴露出的渲染函数，再拼接下 HTML 模版，形成完整的 HTML 文件
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(
        `<html>
            <head>
                <meta charset="UTF-8">
                ${css}
            </head>
            <body>
                <div id="app">${render()}</div>
                <!--导入 Webpack 输出的用于浏览器端渲染的 JS 文件-->
                ${scripts}
            </body>
         </html>`,
    );
});

app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(
        `<html>
            <head>
                <meta charset="UTF-8">
                ${css}
            </head>
            <body>
                <div id="app"></div>
                ${scripts}
            </body>
         </html>`,
    );
});
app.listen(3000, () => {
    console.log('app listening on port 3000!');
});
