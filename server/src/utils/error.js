// 1xx 开头的状态码用于 auth 模块
exports.AuthErrStatus = {
  USER_OR_PASS_ERR: 1001,
  USER_ALREADY_LOGGEDIN: 1002,
  USER_EXIT_ERR: 1003,
  USER_NOTEXIT_ERR: 1004,
  PHONE_EXIT_ERR: 1005
};

const AuthErrMap = {
  1001: '用户名或密码错误',
  1002: '用户已登录',
  1003: '用户名或手机号已注册',
  1004: '用户名与手机号不匹配',
  1005: '该手机号已被绑定'
};

// 5xx 开头用于通用模块
exports.CommonErrStatus = {
  SERVER_ERR: 5001,
  TOKEN_ERR: 5002,
  PARAM_ERR: 5003,
  CREATE_ERR: 5004,
  UPDATE_ERR: 5005
};

const CommonErrMap = {
  5001: '服务器错误',
  5002: 'Token 错误或过期',
  5003: '参数错误',
  5004: '创建失败',
  5005: '更新失败'
};

exports.ErrStatusMap = {
  ...AuthErrMap,
  ...CommonErrMap
};
