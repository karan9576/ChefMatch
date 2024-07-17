const nodeMailer = require('nodemailer');

require("dotenv").config();


//sending mail using nodemailer

function mail(mail , content){
let transportmail = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
  });
  
  let mailContent = {
    from: 'chefmatchofficial@gmail.com',
    
    to: [mail],
    subject: 'Test Mail',
    text: 'This is from coding comics', // Plain text version
    html: `
        ${content}
        <br>
        <p>Best regards,</p>
        <p>ChefMatch Team</p>
        <p><strong style="font-size: 24px; font-weight: bold;"><span style="color: violet;">C</span>hef<span style="color: violet;">M</span>atch</strong><br>
       <strong> Connecting Cooks and Customers with Culinary Delight<br>
        BH-12, E-404, 314 , ITER, Bhubaneswar-751030, Odisha, India<br>
        <strong>Website:</strong> [your website link here]<br>
        <strong>Contact:</strong><br>
        9576600246 (Karan Kumar)<br>
        6297496905 (Pradyumna Roy)</p></strong>
        <p>If you no longer wish to receive these emails, you may <a href="#">unsubscribe</a> at any time.</p>
    `, // HTML version with signature
    // attachments: [
    //     {
    //         // Provide the file path
            
    //     }
    // ]
  };
  
  transportmail.sendMail(mailContent, function (err, val) {
    if (err) {
        console.log(err);
    } else {
        console.log(val.response, 'sent Mail...');
    }
  })
};
   module.exports=mail;