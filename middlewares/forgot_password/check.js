const UserModel = require("../../models/UserModel");
// const bcrypt = require("bcrypt");
// const IP = require("ip");

module.exports = async function check(req, res, next){
    try{
        const {email} = req.body;

        const user = await UserModel.getUserByEmail(email);

        if(!user){
            return res.json({message: "not found user"});
        }

        if(!user.dataValues.isActive){
            return res.json({message: "your account doesn't active please active it"});
        }

        // const auth = JSON.parse(user.dataValues.auth);
        // const ip = IP.address();
        // if(auth.some((evt)=> bcrypt.compareSync(ip,evt))){
        //     return next(user);
        // }
        return next(user.dataValues);
    }catch(err){
        return res.json({error: err});
    }
}