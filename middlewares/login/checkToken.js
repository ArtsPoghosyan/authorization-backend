const TokenModel = require("../../models/TokenModel");
// const bcrypt = require("bcrypt");
// const IP = require("ip");

module.exports = async function checkToken(user, req, res, next){
    try{
        const tokenVerify = await TokenModel.getInfoByUserId(user.id);

        if(tokenVerify){
            
            // if(bcrypt.compareSync(IP.address(), tokenVerify.dataValues.userIp)){
            //     await TokenModel.removeToken(user.id);  
            // }else{
            //     return res.json({message: "you are don't original user"});
            // }

            await TokenModel.removeToken(user.id);
        }
        next(user);
    }catch(err){
        return res.json({error: err});
    }
}