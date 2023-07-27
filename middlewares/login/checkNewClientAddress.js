const UserModel = require("../../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const IP = require("ip");

const {JWT_SECRET} = process.env;

module.exports = async function checkNewClientAddress(user, req, res, next){
    const {key} = req.body; 
    const auth = JSON.parse(user.dataValues.auth);
    const ip = IP.address();

    try{
        if(auth.succesAddress.some((evt)=> bcrypt.compareSync(ip, evt))){ // can is be OR can't be
            return next(user.dataValues);  
        }

        const thisKey = auth.lognnedKeys.filter((evt)=> evt.key === key);
        if(thisKey){
            if(jwt.verify(thisKey[0].expiresToken, JWT_SECRET)){
                await UserModel.loginSucces(user.dataValues.id, {...auth, succesAddress: [...auth.succesAddress, bcrypt.hashSync(ip, 8)], lognnedKeys: auth.lognnedKeys.filter((evt)=> evt.key !== key)});
                return next(user.dataValues);
            }
            await UserModel.loginSucces(user.dataValues.id, {...auth, succesAddress: auth.succesAddress, lognnedKeys: auth.lognnedKeys.filter((evt)=> evt.key !== key)});
            return res.json({messsage: "token time has passed"})
        }

        return res.send({messsage: "key doesn't right"});
    }catch(err){
        if(err.expiredAt){
            try{
                await UserModel.loginSucces(user.dataValues.id, {...auth, succesAddress: auth.succesAddress, lognnedKeys: auth.lognnedKeys.filter((evt)=> evt.key !== key)});
                return res.json({messsage: "token time has passed"})
            }catch(error){
                return res.json({error});
            } 
        }
        return res.json({error: err});
    }
}