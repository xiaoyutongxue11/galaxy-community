const { Query } = require('./query');

// 通知对方（传入receiver_username或者receiver_id）
const NotificationUser = async data => {
  let receiver_username = data.receiver_username;
  if (!receiver_username) {
    const sql = `SELECT username FROM user WHERE id=?`;
    const results = await Query(sql, [data.receiver_id]);
    receiver_username = results[0].username;
  }
  if (LoginRooms[receiver_username]) {
    // WebSocket通常发送文本数据
    LoginRooms[receiver_username].ws.send(JSON.stringify(data));
  }
};

module.exports = {
  NotificationUser
};
