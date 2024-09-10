/* global process */

/**
 * 定义全局登录用户空间
 */
global.LoginRooms = {};

// 引入 app 并启动服务
const expressWs = require('express-ws');
const app = require('./controller/app');
const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

const http = require('http');
// 创建 http 服务实例
const server = http.createServer(app);
// 设置最大传输文件大小 5G
expressWs(app, server, { wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 } });
