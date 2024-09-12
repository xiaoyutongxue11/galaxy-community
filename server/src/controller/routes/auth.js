const express = require('express');
const router = express.Router();
const auth = require('../../service/auth/index');

module.exports = () => {
  router.post('/login', auth.login);
  return router;
};
