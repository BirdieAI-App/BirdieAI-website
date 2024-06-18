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
    let thisUser;
    const { email, password } = req.body;
    // console.log(req.body);
    try {
      thisUser = await User.findOne({ "accountData.email": email });
      if (thisUser) {
        const genSalt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(thisUser.accountData.password, genSalt);
        const match = await bcrypt.compare(password, hashPassword);
        if (match) {
          res.status(200).send("Login successful");
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

module.exports = authRoute;