const nodemailer = require("nodemailer");

const {NODE_MAILER_USER, NODE_MAILER_PASSWORD} = process.env;

try{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: NODE_MAILER_USER,
          pass: NODE_MAILER_PASSWORD
        }
    });
    console.log("NodeMailer Connected");
    
    module.exports = {transporter, confirmOptions, loginKeyOptions, forgotOptions};
}catch(err){
    console.log(err);
}


function confirmOptions(to, activateKey){
    return {
        from: NODE_MAILER_USER, // sender address
        to, // list of receivers
        subject: "Send Activate Key", // Subject line
        text: `Active Key`, // plain text body
        html: `<a href="http://localhost:3000/auth/confirm/email/${activateKey}">http://localhost:3000/auth/confirm/email/${activateKey}</a>` // html body
    };
}

function loginKeyOptions(to, loginKey){
    return {
        from: NODE_MAILER_USER, // sender address
        to, // list of receivers
        subject: "Send logined Key", // Subject line
        text: `Logined Key`, // plain text body
        html: `<h1>Your Login Key - ${loginKey}</h1> <p>Experince - 30min</p>` // html body
    };
}

function forgotOptions(to, newPassword){
    return {
        from: NODE_MAILER_USER, // sender address
        to, // list of receivers
        subject: "Send new password", // Subject line
        text: `New Password`, // plain text body
        html: `<h1>Your new Password - ${newPassword}</h1>` // html body
    };
}