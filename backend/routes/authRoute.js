//////////////////////////////////////////////////////////////////////////
//ROUTES FOR AUTHENTICATING USERS
//////////////////////////////////////////////////////////////////////////
const express = require('express');
const authRoute = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const CLIENT_ID = process.env.GOOGLE_ID;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const VerificationCode = require('../models/VerificationCode');

/* utils */
async function sendVerificationEmail(toEmail,code) {
  const fromEmail = 'dev@birdieapp.co';
  const password = "cigd bcje kxdd stbn"; // Use an app-specific password if you have 2FA enabled
  const subject = `${code} is your verification code`;
  const message = `Verification Code\n\nEnter the following verification code when prompted:\n\n${code}\n\nTo protect your account, do not share this code.`

  // Create a transporter
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: fromEmail,
          pass: password // App-specific password or your Gmail password
      }
  });

  // Email options
  let mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: message
  };

  console.log("Start sending email...")

  // Send email
  try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
  } catch (error) {
      console.error('Error sending email: ', error);
  }
}

/* utils */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* save code to VerificationCode database */
async function saveVerificationCode(email, code) {
  const generatedAt = Date.now();
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes
  const verificationCode = new VerificationCode({ email, code, expiredAt, generatedAt });
  await verificationCode.save();
}

/* verify code */
async function verifyCode(email, code) {
  const record = await VerificationCode.findOne({ email, code });

  if (!record) {
    throw new Error('Invalid code');
  }

  if (new Date() > record.expiresAt) {
    throw new Error('Code has expired');
  }

  // Code is valid
  return true;
}

authRoute.get('/auth/logout', (req, res) => {
  console.log('/auth/logout reached. Logging out');
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error destroying session');
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/'); // Redirect to the login page
    });
  });
});


authRoute
  .route('/auth/login')
  .post(async (req, res, next) => {
    console.log('reach authentication with username and password')
    let thisUser;
    const { email, password } = req.body;
    console.log(`Receive credentials to login ${req.body}`);
    try {
      thisUser = await User.findOne({ "accountData.email": email });
      if (thisUser) {
        const genSalt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(thisUser.accountData.password, genSalt);
        const match = await bcrypt.compare(password, hashPassword);
        if (match) {
          res.status(200).send({_id: thisUser._id, email: email});
        } else {
          req.authError = "The password is incorrect. Please try again" +
            " or reset your password.";
          res.status(401).send(req.authError);
        }
      } else { //userId not found in DB
        req.authError = "There is no account with email " + email +
          ". Please try again.";
        res.status(401).send(req.authError);
      }
    } catch (err) {
      res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
    }
});

authRoute
  .route("/auth/google")
  .post(async (req, res, next) => {
    console.log('reach authentication with google')
    const idToken = req.body.idToken;
    console.log(`Receive credentials to login ${idToken} with Google`);
    try {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];

      // add logic to create user if not exist
      let currentUser = await User.findOne({ "accountData.email": payload["email"] });
      if (!currentUser) {
        // Add this user to the database
        currentUser = await new User({
          accountData: { email: payload["email"] },
          identityData: {
            displayName: payload["name"],
            profilePic: payload["picture"],
          },
        }).save();
      }

      // return 200 response 
      res.status(200).send(currentUser);
    } catch (error) {
      next(error);
    }
})

authRoute
  .post('/auth/send-verification-email', async (req, res) => {
    const { email } = req.body;
    const thisUser = await User.findOne({ "accountData.email": email });
    let userId = '';

    if (thisUser) {
      userId = thisUser._id;
    }

    if (!email || !userId) {
      return res.status(400).send('Email and User ID are required');
    }

    // sendVerificationEmail(email, userId);
    const verificationCode = generateVerificationCode();
    await saveVerificationCode(email,verificationCode);
    await sendVerificationEmail(email,verificationCode);

    res.status(200).send('Verification email sent');
});

authRoute
  .post('/auth/verify-email', async (req,res) => {
    
    const { email,verificationCode } = req.body;
    const thisUser = await User.findOne({ "accountData.email": email });
    console.log(email);
    console.log(verificationCode);

    try {
      const isValid = await verifyCode(email, verificationCode);
      // console.log(isValid);
      if (isValid) {
        res.status(200).send({email: email,userId: thisUser._id});
        // Proceed with user verification
      }
    } catch (error) {
      res.status(401).send(error.message);
      // Handle error (e.g., send an error response to the user)
    }

    // if (!token) {
    //   return res.status(400).send('Verification code is missing');
    // }

    // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //   if (err) {
    //     return res.status(400).send('Invalid or expired token');
    //   }

    //   // Activate the user's account, e.g., update the user record in the database
    //   console.log('User verified:', decoded.userId);

    //   res.send('Email successfully verified');
    // });
});


module.exports = authRoute;