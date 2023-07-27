const express = require('express');
const UserController = require('../controllers/UserController');
const checkEmail = require("../middlewares/register/checkEmail");
const registerValidator = require("../middlewares/register/registerValidator");
const loginValidator = require("../middlewares/login/loginValidator");
const checkUser = require("../middlewares/login/checkUser");
const checkAddress = require("../middlewares/login/checkAddress");
const checkNewClientAddress = require("../middlewares/login/checkNewClientAddress");
const checkToken = require("../middlewares/login/checkToken");
const forgotValidator = require("../middlewares/forgot_password/forgotValidator");
const authorizationIgnore = require("../middlewares/authorization/authorizationIgnore");
const authorizationAccept = require("../middlewares/authorization/authorizationAccept");
const check = require('../middlewares/forgot_password/check');
const router = express.Router();

/* POST users listing. */

router.post('/login', authorizationIgnore, loginValidator, checkUser, checkAddress, checkToken, UserController.login);
router.post('/login-other-client', authorizationIgnore, loginValidator, checkUser, checkNewClientAddress, checkToken, UserController.login);

router.post('/register', authorizationIgnore, registerValidator, checkEmail, UserController.register);
router.post('/forgot-password', authorizationIgnore, forgotValidator, check, UserController.forgot);

router.get('/logout', authorizationAccept, UserController.logout);
router.get('/remove', authorizationAccept, UserController.removeUser);

router.get('/confirm/email/:activateKey', authorizationIgnore, UserController.confirmEmail);
router.post('/receive-new-key', authorizationIgnore, UserController.receiveNewKey);

module.exports = router;