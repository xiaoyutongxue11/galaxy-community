const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

const { RespError, RespData, RespSuccess } = require('../../utils/resp');
const { CommonErrStatus, AuthErrStatus } = require('../../utils/error');
const { Query } = require('../../utils/query');
const { secretKey } = require('../../utils/authenticate');
const { NotificationUser } = require('../../utils/notification');
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
      await better_chat.set(`token:${payload.username}`, token, 'EX', 60 * 60 * 24 * 14);
      return RespData(res, data);
    } else {
      return RespError(res, AuthErrStatus.USER_OR_PASS_ERR);
    }
  } catch (err) {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 登出
 */
const logout = async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql = `UPDATE friend SET online_status = ? WHERE username = ?`;
    await Query(sql, ['offline', username]);
    await better_chat.del(`token:${username}`);
    return RespSuccess(res);
  } catch (err) {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 1、获取前端传来的注册信息
 * 2、判断用户或手机号是否注册
 * 3、未注册则插入 user 表中
 * 4、给新用户添加一个好友分组
 * 5、生成 jwt，把 token 和用户信息返回给前端
 */
const register = async (req, res, next) => {
  const { username, password, phone, avatar } = req.body;
  if (!(username && password && phone)) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql_check = `SELECT * FROM user WHERE username = ? OR phone = ?`;
    const results_check = await Query(sql_check, [username, phone]);
    if (results_check.length !== 0) {
      // 用户名或手机号已存在
      return RespError(res, AuthErrStatus.USER_EXIT_ERR);
    }
    // 加盐（3 个字节的字节码转化成 16 进制字符串，生成一个 6 位的 salt）
    const salt = crypto.randomBytes(3).toString('hex');
    const M = salt.slice(0, 3) + password + salt.slice(3);
    // 将 M 进行 MD5 哈希，得到哈希值
    const hash = crypto.createHash('md5').update(M).digest('hex');
    const user = {
      avatar,
      username,
      password: hash,
      name: username,
      phone,
      signature: '',
      salt
    };
    const sql_set_user = 'INSERT INTO user SET ?';
    const results_set_user = await Query(sql_set_user, [user]);
    if (results_set_user.affectedRows === 1) {
      const sql_get_user = `SELECT * FROM user WHERE username = ?`;
      const results_get_user = await Query(sql_get_user, [username]);
      const info = results_get_user[0];
      const friend_group = {
        user_id: info.id,
        username: username,
        name: '我的好友'
      };
      const sql_set_group = 'INSERT INTO friend_group SET ?';
      await Query(sql_set_group, [friend_group]);
      const payload = { ...info };
      const token = jwt.sign(payload, secretKey);
      const data = { token, info };
      return RespData(res, data);
    }
  } catch (err) {
    console.log(err);
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 忘记密码
 */
const forgetPassword = async (req, res) => {
  const { username, phone, password } = req.body;
  if (!(username && phone && password)) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql_check = `SELECT username,phone,salt FROM user WHERE username = ? AND phone = ?`;
    const results_check = await Query(sql_check, [username, phone]);
    // 判断手机号和用户名是否存在
    if (results_check.length === 0) {
      return RespError(res, AuthErrStatus.USER_NOTEXIT_ERR);
    }
    const salt = results_check[0].salt;
    const M = salt.slice(0, 3) + password + salt.slice(3);
    const hash = crypto.createHash('md5').update(M).digest('hex');
    const sql_set = `UPDATE user SET password = ? WHERE username = ?`;
    const result_set = await Query(sql_set, [hash, username]);
    if (result_set.affectedRows === 1) {
      return RespSuccess(res);
    }
  } catch {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 登录成功后初始化用户的通知管道（websocket链接信息全局存储），用于通知用户好友列表的更新
 */
const initUserNotification = async (ws, req) => {
  const url = req.url.split('?')[1];
  const params = new URLSearchParams(url);
  const curUsername = params.get('username');
  LoginRooms[curUsername] = {
    ws,
    status: false //status：用户是否正在进行视频通话
  };
  // 通知当前登录的所有好友进行好友列表更新
  // 目前是对所有已登录的好友进行通知更新
  // 后续可以优化为：对当前登录的用户的好友且是已登录的好友进行通知
  for (const username in LoginRooms) {
    if (username === curUsername) continue;
    NotificationUser({ receiver_username: username, name: 'friendList' });
  }
  // 监听 websocket 关闭事件（用户关闭页面或者退出登录）
  ws.on('close', () => {
    if (LoginRooms[curUsername]) {
      delete LoginRooms[curUsername];
      // 通知当前登录的所有好友进行好友列表更新
      for (const username in LoginRooms) {
        NotificationUser({ receiver_username: username, name: 'friendList' });
      }
    }
  });
};

module.exports = {
  login,
  logout,
  register,
  forgetPassword,
  initUserNotification
};
