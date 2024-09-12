const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const { RespError, RespData } = require('../../utils/resp');
const { CommonErrStatus, AuthErrStatus } = require('../../utils/error');
const { Query } = require('../../utils/query');
const { secretKey } = require('../../utils/authenticate');
const better_chat = new Redis();

const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql = `SELECT * FROM user WHERE username = ?`;
    const results = await Query(sql, [username]);
    if (results.length !== 0) {
      // 获取到用户信息
      const payload = {
        id: results[0].id,
        avatar: results[0].avatar,
        username: results[0].username,
        password: results[0].password,
        name: results[0].name,
        phone: results[0].phone,
        salt: results[0].salt
      };
      // 加盐
      const M = payload.salt.slice(0, 3) + password + payload.salt.slice(3);
      const hash = crypto.createHash('md5').update(M).digest('hex');
      if (hash !== payload.password) {
        return RespError(res, AuthErrStatus.USER_OR_PASS_ERR);
      }
      // 生成 jwt，之后 payload 会携带在请求头的 req.user 中（前提是通过了中间件）
      const token = jwt.sign(payload, secretKey);
      const data = {
        token: token,
        info: {
          id: results[0].id,
          avatar: results[0].avatar,
          username: results[0].username,
          name: results[0].name,
          phone: results[0].phone,
          created_at: new Date(results[0].created_at)
            .toLocaleString('zh-CN', { hour12: false })
            .replace(/\//g, '-'),
          signature: results[0].signature
        }
      };
      // 检查 Redis 缓存中的 Token
      const redisToken = await better_chat.get(`token:${payload.username}`);
      if (redisToken) {
        return RespError(res, AuthErrStatus.USER_ALREADY_LOGGEDIN);
      }
      // 登录成功去改变好友表中的状态
      const sql = `UPDATE friend SET online_status = ? WHERE username = ?`;
      await Query(sql, ['online', username]);
      // 保存 token 到 redis 缓存中, 有效期为 14 天
      await better_chat.ser(`token:${payload.username}`, token, 'EX', 60 * 60 * 24 * 14);
      return RespData(res, data);
    } else {
      return RespError(res, AuthErrStatus.USER_OR_PASS_ERR);
    }
  } catch (err) {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

module.exports = {
  login
};
