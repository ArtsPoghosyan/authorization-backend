const UserModel = require("../../models/UserModel");

module.exports = async function checkEmail(req, res, next){
    try{
        const {email} = req.body;

        const exsits = await UserModel.getUserByEmail(email);

        if(exsits){
            return res.json({message: 'already there is user by this email'});
        }

        next();
    }catch(err){
        return res.json({error: err});
    }
}