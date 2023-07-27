const Joi = require("@hapi/joi");

module.exports = function loginValidator(req, res, next){
    try{
        const {email, password} = req.body;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email(),
            password: Joi.string().min(6).max(100).required()
        })
        const {error} = Schema.validate({email, password});
        if(error){
            throw error;
            return;
        }
        next();
    }catch(err){
        return res.json({error: err});
    }
}