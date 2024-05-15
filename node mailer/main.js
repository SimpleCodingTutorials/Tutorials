const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service:"hotmail",
  auth:{
    user:"simplecodingtutorials@hotmail.com",
    pass:"123456"
  }
});

// let transporter = nodemailer.createTransport({
//   host: '127.0.0.1',
//   port: 1025,
//   secure: false, // true for 465, false for other ports
//   auth: {
//       user: 'sctbottest@protonmail',
//       pass: '123456'
//   }
// });


let mailOptions = {
  from: "simplecodingtutorials@hotmail.com",
  to: "sctbottest@protonmail.com",
  subject: "Sending Email using Node.js",
  text: "Hi,Attached is the file as part of a NodeMilaer test.",
  attachments: [
    {
      filename:"my-file.zip",
      path:"./file.zip"
    }
  ]
};
transporter.sendMail(mailOptions,function(error,info){
  if(error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});