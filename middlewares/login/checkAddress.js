const UserModel = require("../../models/UserModel");
const {transporter, loginKeyOptions} = require("../../services/nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const IP = require("ip");

const {JWT_SECRET} = process.env;

module.exports = async function checkAddress(user, req, res, next){
    try{
        const ip = IP.address();
        const auth = JSON.parse(user.dataValues.auth);

        if(auth.succesAddress.some((evt)=> bcrypt.compareSync(ip, evt))){
            return next(user);  
        }

        const key = (Math.random() + "").substring(2, 8);
        const expiresToken = jwt.sign({ip, key}, JWT_SECRET, {expiresIn: "30min"});

        await transporter.sendMail(loginKeyOptions(user.dataValues.email, key));
        await UserModel.loginSucces(user.dataValues.id, {...auth, lognnedKeys: [...auth.lognnedKeys, {key, expiresToken}]});

        return res.send({messsage: "key for lognned already send to e-mail"});
    }catch(err){
        return res.json({error: err});
    }
}