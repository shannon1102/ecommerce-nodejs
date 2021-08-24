const nodemailer = require("nodemailer");

require('dotenv').config()

let sendEmail = async (payload)=>{
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.AUTH_EMAIL, // generated ethereal user
      pass: process.env.AUTH_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Camera Website" <camerawebsitebn@gmail.com>', // sender address
    //to: "receiverEmail", // list of receivers
    to: [`${process.env.RECV_EMAIL_SALE}`,`${process.env.RECV_EMAIL_BOSS}`],
    subject: "CAmera-Shop website have new inquiry", // Subject line
    html: `
    <h2><b>Inquiry Information</b></h2>
    <div style="margin-left: 30px;">
    <p><b>Cutosmer Name:</b> ${payload.customer_name} <p>
    <p><b>Cutosmer Email:</b> ${payload.email} <p>
    <p><b>Cutosmer Phone</b>: ${payload.phone} <p>
    <p><b>Message:</b> ${payload.message} <p>
    <p><b>Product_name :</b> ${payload.product_name} <p>
    <p><b>Product_id :</b> ${payload.product_id} <p>
    <p><b>Product_link :</b> ${payload.product_link} <p>
    </div>
    <div>
    <p>Giang Minh Viet - High quality products <a href="${process.env.SHOP_WEBSITE_URL}">Click Here</a></p>
    </div>
    `, // html body
  });
}

module.exports = {
    sendEmail
}