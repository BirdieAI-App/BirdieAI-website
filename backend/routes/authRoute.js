//////////////////////////////////////////////////////////////////////////
//ROUTES FOR AUTHENTICATING USERS WITH PASSPORT
//////////////////////////////////////////////////////////////////////////

import passport from 'passport';
import express from 'express';
const authRoute = express.Router();

authRoute.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

//CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

authRoute.get('/auth/google/callback', passport.authenticate( 'google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("auth/google/callback reached.");
    res.redirect('/'); //sends user back to login screen; 
                      //req.isAuthenticated() indicates status
  }
);

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.
authRoute.get('/auth/logout', (req, res) => {

});

//TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.
authRoute.get('/auth/test', (req, res) => {

});

//LOGIN route: Attempts to log in user using local strategy
authRoute.post('/auth/login', passport.authenticate('local', { failWithError: true }),(req, res) => {

});


export default authRoute;