const authService = require('../services/authService');
const { jwtDecode } = require("jwt-decode");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { UserModel} = require('../models/User');
const nodemailer = require('nodemailer');
const { set } = require('mongoose');

exports.login = async (req, res) => {
  try {
    const { email, password, clientId } = req.body;
    let userData;
    if (clientId) {
      userData = await authService.authenticateUserWithGoogle(clientId);
    } else {
     if(!req.body.time){
        var time = Date();
        time.setHours(time.getHours() + 1);
      }
      else{
        var time = Date();
        time.setHours(time.getHours() + req.body.time); 
      }
      
      userData = await authService.authenticateUser(email, password, time);
    }
    res.json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.generateToken = async (req, res) => {
  try {
    const { token } = req.params;
    const info = jwtDecode(token);
    res.json(info);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.forgetPasswordRedirect = async (req, res) => {
  const to = req.body.email;
  const url = process.env.URL_APP;
  const emailVerrify = await UserModel.findOne({ email: to });
  console.log(emailVerrify);
  if (!emailVerrify) {

   return res.status(400).json({ error: 'Email not found' });
  
  }
  const emailToken = jwt.sign({ email: to }, JWT_SECRET);
  // Create a transporter object using SMTP transport.
  let transporter = nodemailer.createTransport({
    service: 'gmail', // or use another email service
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  var text = `Hi ${to},\nThere was a request to change your password!\nIf you did not make this request then please ignore this email.\nOtherwise, please click this link to change your password: http://localhost:3000/reset-password/${emailToken}`
  var line1 = `Hi ${to},`
  var line2 = `There was a request to change your password!`
  var line3 = `If you did not make this request then please ignore this email.`
  var line4 = `Otherwise, please click this link to change your password: ${url}/resetPassword/${emailToken}`

  // Set up email data
  let mailOptions = {
      from: "no-reply@bidfinder.ddns.net",
      to: to,
      subject: "Password reset",
      text: text,
      html: `
      <p>${line1}</p>
      <p>${line2}</p>
      <p>${line3}</p>
      <p>${line4}</p>
      <img src="cid:unique@icon.cid" alt="Icon" />`,
      attachments: [
          {
              filename: 'icon.png',
              path: 'logo.png',
              cid: 'unique@icon.cid'
          }
      ]
  };

  // Send mail with defined transport object
  try {
      let info = await transporter.sendMail(mailOptions);

      res.status(200).send(`Email sent: ${info.response}`);
  } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const email = jwtDecode(token).email;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, { password: password }, { new: true });
    return res.status(200).json({ message: 'Password updated successfully'});
  } catch (error) {
    res.status(400).json({ error: 'Failed to update password' });
  }
};