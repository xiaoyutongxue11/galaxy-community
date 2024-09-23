const express = require('express');
const router = express.Router();
const friend = require('../../service/friend/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
  router.get('/friendList', authenticate.authenticateToken, friend.getFriendList);
  router.post('/addFriend', authenticate.authenticateToken, friend.addFriend);
  router.post('/createFriendGroup', authenticate.authenticateToken, friend.createFriendGroup);
  return router;
};
