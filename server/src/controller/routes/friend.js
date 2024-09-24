const express = require('express');
const router = express.Router();
const friend = require('../../service/friend/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
  router.get('/friendList', authenticate.authenticateToken, friend.getFriendList);
  router.get('/friend_id', authenticate.authenticateToken, friend.getFriendById);
  router.get('/groupList', authenticate.authenticateToken, friend.getFriendGroupList);
  router.post('/addFriend', authenticate.authenticateToken, friend.addFriend);
  router.post('/createFriendGroup', authenticate.authenticateToken, friend.createFriendGroup);
  return router;
};
