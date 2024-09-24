const { CommonErrStatus } = require('../../utils/error');
const { NotificationUser } = require('../../utils/notification');
const { Query } = require('../../utils/query');
const { RespError, RespSuccess, RespData } = require('../../utils/resp');
const { v4: uuidv4 } = require('uuid');

/**
 * 添加好友
 * 1、将好友添加到自己的好友列表
 * 2、将自己插入到对方的好友列表
 */
const addFriendRecord = async friend_info => {
  try {
    const sql = `INSERT INTO friend SET ?`;
    const results = await Query(sql, friend_info);
    if (results.affectedRows === 1) return '添加成功';
    else throw new Error('添加失败');
  } catch {
    throw new Error('添加失败');
  }
};
const addFriend = async (req, res) => {
  // 获取发送方信息
  const sender = req.user;
  const { id, username, avatar } = req.body;
  if (!(sender && id && username && avatar)) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const uuid = uuidv4();
    // 获取发送方的默认分组，方便将好友插入到默认分组中
    const sql_get_group = `SELECT id FROM friend_group WHERE user_id=?`;
    // 将好友添加到自己的好友列表并通知对方更新好友列表
    const results_receiver = await Query(sql_get_group, [sender.id]);
    const info_receiver = {
      user_id: id,
      username,
      avatar,
      online_status: LoginRooms[username] ? 'online' : 'offline',
      remark: username,
      group_id: results_receiver[0].id, // 接收方所在的分组就是发送发的默认分组
      room: uuid
    };
    await addFriendRecord(info_receiver);
    NotificationUser({ receiver_username: username, name: 'friendList' });
    // 将自己添加到好友的好友列表，并通知自己更新自己的好友列表
    const results_sender = await Query(sql_get_group, [id]);
    const info_sender = {
      user_id: sender.id,
      username: sender.username,
      avatar: sender.avatar,
      online_status: LoginRooms[sender.username] ? 'online' : 'offline',
      remark: sender.name,
      group_id: results_sender[0].id,
      room: uuid
    };
    await addFriendRecord(info_sender);
    NotificationUser({ receiver_username: sender.username, name: 'friendList' });
    return RespSuccess(res);
  } catch {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/** 通过分组 id 查询好友信息 */
const getFriendByGroup = async group_id => {
  try {
    const sql = `SELECT * FROM friend WHERE group_id=?`;
    const results = await Query(sql, [group_id]);
    return results;
  } catch {
    throw new Error('查询失败');
  }
};

/** 查询某个用户的所有好友（数组平铺） */
const getFriendBuyUser = async user_id => {
  try {
    const friends = [];
    // 通过用户 id 查询该用户的所有好友分组
    const sql = `SELECT id FROM friend_group WHERE user_id=?`;
    const results = await Query(sql, [user_id]);
    for (const group of results) {
      const results = await getFriendByGroup(group.id);
      friends.push(...results);
    }
    return friends;
  } catch {
    throw new Error('查询失败');
  }
};
/**
 * 获取好友列表的基本逻辑
 * 1、根据当前用户的 id 获取其好友分组的 id 和 name
 * 2、查询各个分组下的好友，最后拼接在一起返回
 */
const getFriendList = async (req, res) => {
  try {
    const sender = req.user;
    const sql = `SELECT id,name FROM friend_group WHERE user_id=?`;
    // 获取当前用户的所有分组
    const results = await Query(sql, [sender.id]);
    const friendList = [];
    if (results.length !== 0) {
      // 获取每个分组下的好友
      for (const result of results) {
        const groupFriends = { name: result.name, online_counts: 0, friend: [] };
        const friends = await getFriendByGroup(result.id);
        // 求在线好友数量
        for (const friend of friends) {
          groupFriends.friend.push(friend);
          if (friend.online_status === 'online') {
            groupFriends.online_counts++;
          }
        }
        friendList.push(groupFriends);
      }
    }
    return RespData(res, friendList);
  } catch {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 根据好友 id 获取好友信息的基本逻辑
 * 1、既要获取完整的好友个人信息，又要获取好友所在的分组
 * 2、需要联表查询
 */
const getFriendById = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql = `SELECT 
				f.id AS friend_id,
				f.user_id AS friend_user_id,
				f.online_status,
				f.remark,
				f.group_id,
				fg.name AS group_name,
				f.room,
				f.unread_msg_count,
				u.username,
				u.avatar,
				u.phone,
				u.name,
				u.signature
			FROM
				friend AS f
			JOIN
				user AS u ON f.user_id = u.id
			JOIN
				friend_group AS fg ON f.group_id = fg.id
			WHERE
				f.id = ?`;
    const results = await Query(sql, [id]);
    if (results.length !== 0) {
      return RespData(res, results[0]);
    }
  } catch {
    return RespData(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 获取用户的好友分组列表
 */
const getFriendGroupList = async (req, res) => {
  const user_id = req.user.id;
  if (!user_id) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql = `SELECT * FROM friend_group WHERE user_id=?`;
    const results = await Query(sql, [user_id]);
    return RespData(res, results);
  } catch {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 查询用户
 * 1、根据用户名查询到用户表中查询，模糊查询
 * 2、在查询的数据中，判断是否存在已经是好友的现象
 * 3、将好友和非好友分开，非好友才能添加
 */
const searchUser = async (req, res) => {
  const sender = req.user;
  const { username } = req.query;
  if (!(sender && username)) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql_get_user = `SELECT * FROM user WHERE username LIKE ?`;
    const results_user = await Query(sql_get_user, [`%${username}%`]);
    // 获取当前用户的所有好友
    const friends = await getFriendBuyUser(sender.id);
    const searchList = [];
    if (results_user.length !== 0) {
      for (const userInfo of results_user) {
        let flag = false;
        if (userInfo.username === sender.username) {
          continue;
        }
        for (const friend of friends) {
          if (friend.username === userInfo.username) {
            flag = true;
            break;
          }
        }
        const { name, username, id, avatar } = userInfo;
        searchList.push({
          name,
          username,
          id,
          avatar,
          status: flag //是否是好友
        });
      }
    }
    return RespData(res, searchList);
  } catch {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

/**
 * 创建好友分组
 */
const createFriendGroup = async (req, res) => {
  const friend_group = req.body;
  if (!friend_group) {
    return RespError(res, CommonErrStatus.PARAM_ERR);
  }
  try {
    const sql = `INSERT INTO friend_group SET ?`;
    const results = await Query(sql, friend_group);
    if (results.affectedRows === 1) {
      return RespSuccess(res);
    }
  } catch {
    return RespError(res, CommonErrStatus.SERVER_ERR);
  }
};

module.exports = {
  addFriend,
  getFriendList,
  createFriendGroup,
  getFriendGroupList,
  getFriendById,
  searchUser
};
