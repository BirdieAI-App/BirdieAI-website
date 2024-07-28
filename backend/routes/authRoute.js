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

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your preferred email service
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "birdieai.dev@gmail.com",
    pass: "Birdie2024+",
  },
});

// utils
const sendVerificationEmail = async function (email, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/call` : 'https://www.birdieapp.co/call';
  const verificationLink = `${baseURL}/auth/verify-email?token=${token}`;
  console.log(verificationLink);

  const mailOptions = {
    from: "birdieai.dev@gmail.com",
    to: "ong_t1@denison.edu",
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
  } catch (err) {
    console.log(err);
  }
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
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).send('Email and User ID are required');
    }

    sendVerificationEmail(email, userId);

    res.send('Verification email sent');
});

authRoute
  .get('/auth/verify-email', async (req,res) => {
    const token = req.query.token;

    if (!token) {
      return res.status(400).send('Verification token is missing');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).send('Invalid or expired token');
      }

      // Activate the user's account, e.g., update the user record in the database
      console.log('User verified:', decoded.userId);

      res.send('Email successfully verified');
    });
});


module.exports = authRoute;