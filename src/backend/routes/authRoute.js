// libraries import
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import authenticateJWT from '../passport/authenticateJWT.js';

const authRoute = express.Router();
const extractDomain = (url) => {
  const { hostname } = new URL(url);
  return hostname;
};


authRoute.get('/auth/logout', (req, res) => {
  console.log('/auth/logout reached. Logging out');
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,  // Ensure it's the same settings as when you set the cookie
      secure: true,    // Ensure cookies set over HTTPS are cleared
      sameSite: 'None', // Match the sameSite setting
    });
    return res.status(200).json({message:"Logout Successfully"})

//Log in user using local strategy
authRoute.post('/auth/login', passport.authenticate('local', { failWithError: true, session: false }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    const {_id,token} = req.user;
    console.log(`User with Id: ${_id} signed in on ${new Date()}`)
    let domain = extractDomain(process.env.CALLBACK_URL);
    res.cookie('jwt', token, {
      httpOnly: true,       // Prevents JavaScript access (XSS protection)
      secure: true,         // Ensures the cookie is only sent over HTTPS
      sameSite: 'None',   // Prevents CSRF
      maxAge: 60 * 60 * 1000, // 1 hour
      path:'/',
      domain: domain
    });
    if(process.env.CALLBACK_URL.includes('localhost')) return res.status(200).send('Login Sucessfully')
    res.redirect(`${process.env.FRONTEND_URL}/chat`)
  },
  (err, req, res, next) => {
    return res.status(401).send(err.message)
  });


authRoute.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
authRoute.get('/auth/google/callback', passport.authenticate( 'google', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log("/auth/google/callback reached.");
    const {_id,token} = req.user;
    console.log(`User with Id: ${_id} signed in on ${new Date()}`)
    let domain = extractDomain(process.env.CALLBACK_URL);
    res.cookie('jwt', token, {
      httpOnly: true,       // Prevents JavaScript access (XSS protection)
      secure: true,         // Ensures the cookie is only sent over HTTPS
      sameSite: 'None',   // Prevents CSRF
      maxAge: 60 * 60 * 1000, // 1 hour
      path:'/',
      domain: domain
    });
    if(process.env.CALLBACK_URL.includes('localhost')) return res.status(200).send('Login Sucessfully')
    res.redirect(`${process.env.FRONTEND_URL}/chat`)
  }
);

authRoute.get('/auth/test', authenticateJWT, (req, res)=>{
  console.log('/auth/test reached.');
  console.log('Decoded token:', req.user);

  return res.status(200).json({
    isAuthenticated: true,
    user: req.user, // This contains the user data encoded in the token
  });
});

export default authRoute;