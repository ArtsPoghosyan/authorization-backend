const TokenModel = require("../../models/TokenModel");
const bcrypt = require("bcrypt");
const IP = require("ip");

module.exports = async function authorizationAccept(req, res, next){
    try{
        const {token} = req.cookies;
        if(token){
            const userToken = await TokenModel.getInfoByToken(token);
            if(userToken){
                if(bcrypt.compareSync(IP.address(), userToken.userIp)){
                    return next();
                }else{
                    res.clearCookie("token");
                    return res.json({message: "you are don't original user"});
                }
            }
            res.clearCookie("token");
        }
        return res.json({message: "user not loggned"});
    }catch(err){
        return res.json({error: err});
    }
}