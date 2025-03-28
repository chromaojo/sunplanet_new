
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
        user: "felixtemidayoojo@gmail.com",
        pass: "gzem yewg pkzg zqyo"
    }
});


const sendIt = (xyz)=>{
    transporter.sendMail(xyz);
    console.log('Email Message Sent');
}


module.exports = {transporter, sendIt};