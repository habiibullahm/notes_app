const nodemailer = require("nodemailer");

module.exports = async (email, subject, content) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "Lepojutsuu22@gmail.com",
      pass: "Naraciriha231998",
    },
  });
  let info = await transporter.sendMail({
    from: '"Notes App" <no-reply@lektur.com>',
    to: email,
    subject: subject,
    text: "",
    html: content,
  });
};