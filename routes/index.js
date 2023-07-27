const express = require('express');
const authRouter = require("./auth"); 
const router = express.Router();
const IP = require('ip');

/* GET home page. */
router.get('/', function(req, res, next) {
  const ipAddress = IP.address();
  return res.json({ipAddress});
});

router.use('/auth', authRouter);

module.exports = router;
