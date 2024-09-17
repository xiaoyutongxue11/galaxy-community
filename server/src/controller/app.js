// 创建 express 实例并处理相关路由
const express = require('express');
const app = express();
const expressWs = require('express-ws');
expressWs(app);

// 处理跨域
const cors = (req, res, next) => {
  // 设置允许跨域的域名
  res.header('Access-Control-Allow-Origin', '*');
  // 设置允许的请求头类型
  res.header('Access-Control-Allow-Headers', '*');
  // 是否允许携带凭据（如cookies）跨域
  res.header('Access-Control-Allow-Credentials', true);
  // 设置允许的请求方式
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // 设置预检请求的时间
  if (req.method.toLowerCase() === 'options') {
    res.sendStatus(200);
  } else next();
};

// 静态文件访问的中间件，利用 express 托管静态文件，将文件存储在指定目录（这里是uploads）
const staticDownload = (req, res, next) => {
  // 设置允许跨域的域名
  res.header('Access-Control-Allow-Origin', '*');
  // 设置允许的请求头类型
  res.header('Access-Control-Allow-Headers', '*');
  // 是否允许携带凭据（如cookies）跨域
  res.header('Access-Control-Allow-Credentials', true);
  // 设置允许的请求方式
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // 设置预检请求的时间
  if (req.method.toLowerCase() === 'options') {
    res.sendStatus(200);
  } else next();
};

app.use('/uploads', staticDownload, express.static('uploads'));

// 处理 HTTP 请求题中的参数，将请求体解析成 JSON 对象或者 URL-encoded 格式，并限制请求体大小为 100mb
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// 注册路由
const indexRouter = require('./routes/auth')();
app.use('', cors); // 防止浏览器的预检请求导致控制台报跨域错误
app.use('/api/chat/auth', cors, indexRouter);
module.exports = app;
