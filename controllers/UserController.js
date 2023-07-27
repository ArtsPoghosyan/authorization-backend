const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const IP = require("ip");
const generator = require('generate-password');

const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");
const {transporter, confirmOptions, forgotOptions} = require("../services/nodemailer");

const {JWT_SECRET} = process.env;

class UserController{
    static login = async ({id}, req, res, next)=>{
        try{
            const token = jwt.sign({id}, JWT_SECRET);
            await TokenModel.addToken({userId: id, userToken: token, userIp: bcrypt.hashSync(IP.address(), 8)});
            res.cookie('token', token);
            return res.json({cookies: req.cookies, message: "login is succesfull"});
        }catch(err){
            next(err);
        }
    }
    static register = async (req, res, next)=>{
        try{
            const {password, email} = req.body;
            const activateKey = jwt.sign({email}, JWT_SECRET);
            await UserModel.createUser({...req.body, password: bcrypt.hashSync(password, 8), activateKey, auth: {succesAddress: [bcrypt.hashSync(IP.address(), 8)], lognnedKeys: []}});
            await transporter.sendMail(confirmOptions(email, activateKey));
            return res.json({message: 'register is succesfully'});
        }catch(err){
            next(err);
        }
    }
    static logout = async (req, res, next)=>{
        try{
            const {token} = req.cookies;
            const {id} = jwt.decode(token);
            await TokenModel.removeToken(id);
            res.clearCookie("token");
            return res.json({message: 'logout is succesfully'});
        }catch(err){
            next(err);
        }
    }
    static removeUser = async (req, res, next)=>{
        try{
            const {token} = req.cookies;
            const {id} = jwt.decode(token);
            await UserModel.removeUser(id);
            await TokenModel.removeToken(id);
            res.clearCookie("token");
            return res.json({message: 'delete is succesfully'});
        }catch(err){
            next(err);
        }
    }
    static confirmEmail = async(req, res, next)=>{
        try{
            const {activateKey} = req.params;
            const {email} = jwt.verify(activateKey, JWT_SECRET);
            const user = await UserModel.getUserByEmail(email);
            if(!user){
                return res.json({message: "user don't registered"});
            }
            if(user.dataValues.isActive){
                return res.json({message: "this user already was confirmed"});
            }
            if(user.dataValues.activateKey === activateKey){
                await UserModel.confirmUser(user.dataValues.id);
                return res.json({message: "user successfully is confirm"});
            }
            return res.json({message: "verification failed"}); // OR return res.json({message: "this user already confirmed"});
        }catch(err){
            next(err);
        }
    }
    static forgot = async({id, email}, req, res, next)=>{
        try{
            const newPassword = generator.generate({length: 12, numbers: true, symbols: true});

            await transporter.sendMail(forgotOptions(email, newPassword));
            const hashPassword = bcrypt.hashSync(newPassword, 8);
            await UserModel.changePassword(id, hashPassword);
            return res.json({message: "password succesfully changed and send to e-mail"});
        }catch(err){
            next(err);
        }
    }
    static receiveNewKey = async(req, res, next)=>{
        try{
            const {email} = req.body;
            const user = await UserModel.getUserByEmail(email);
            if(!user){
                return res.json({message: "user don't registered"});
            }
            if(!user.dataValues.isActive){
                await transporter.sendMail(confirmOptions(email, user.dataValues.activateKey));
                return res.json({message: "new key already send to e-mail"});
            }
            return res.json({message: "verification failed"}); // OR return res.json({message: "this user already was confirmed"});
        }catch(err){
            next(err);
        }
    }
}

module.exports = UserController;