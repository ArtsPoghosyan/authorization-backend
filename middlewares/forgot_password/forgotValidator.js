const Joi = require("@hapi/joi");

module.exports = function forgotValidator(req, res, next){
    try{
        const {email} = req.body;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email()
        })
        const {error} = Schema.validate({email});
        if(error){
            throw error;
        }
        next();
    }catch(err){
        return res.json({error: err});
    }
}