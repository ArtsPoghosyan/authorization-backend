const UserModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = async function checkUser(req, res, next){
    try{
        const {email, password} = req.body;

        const user = await UserModel.getUserByEmail(email);

        if(!user){
            return res.json({message: "not found email or password"});
        }

        if(!user.dataValues.isActive){
            return res.json({message: "you don't confirmed your email"});
        }

        if(!bcrypt.compareSync(password, user.dataValues.password)){
            return res.json({message: "not found email or password"});
        }
        next(user);
    }catch(err){
        return res.json({error: err});
    }
}