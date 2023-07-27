const Joi = require("@hapi/joi");

module.exports = function registerValidator(req, res, next){
    try{
        const {name, email, password} = req.body;
        const Schema = Joi.object({
            name: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(10).max(100).required().email(),
            password: Joi.string().min(6).max(100).required()
        })
        const {error} = Schema.validate({name, email, password});
        if(error){
            throw error;
            return;
        }
        next();
    }catch(err){
        return res.json({error: err});
    }
}