//////////////////////////////////////////////////////////////////////////
//ROUTES FOR AUTHENTICATING USERS
//////////////////////////////////////////////////////////////////////////
const express = require('express');
const authRoute = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const CLIENT_ID = process.env.GOOGLE_ID;
const User = require('../models/User')

//CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

// authRoute.get('/auth/google/callback', passport.authenticate( 'google', { failureRedirect: '/' }),
//   (req, res) => {
//     console.log("auth/google/callback reached.");
//     res.redirect('/'); //sends user back to login screen; 
//                       //req.isAuthenticated() indicates status
//   }
// );

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.
authRoute.get('/auth/logout', (req, res) => {

});

//TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.
authRoute.get('/auth/test', (req, res) => {

});

//LOGIN route: Attempts to log in user using local strategy
// authRoute.post('/auth/login', passport.authenticate('local', { failWithError: true }),(req, res) => {

// });

authRoute
  .route("/auth/google")
  .post(async (req, res, next) => {
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