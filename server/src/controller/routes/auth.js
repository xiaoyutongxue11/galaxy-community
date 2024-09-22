const express = require('express');
const router = express.Router();
const auth = require('../../service/auth/index');

module.exports = () => {
  router.post('/login', auth.login);
  router.post('/logout', auth.logout);
  router.post('/register', auth.register);
  router.post('/forgetPassword', auth.forgetPassword);
  router.ws('/userChannel', auth.initUserNotification);
  return router;
};
