// libraries import
import express from 'express';
import passport from 'passport';
import authenticateJWT from '../passport/authenticateJWT.js';

const authRoute = express.Router();
// const extractDomain = (url) => {
//   const { hostname } = new URL(url);
//   return hostname === 'localhost' ? undefined : hostname;;
// };

const extractDomain = (url) => {
  const { hostname } = new URL(url);
  
  // Return undefined for localhost
  if (hostname === 'localhost') {
    return undefined;
  }
  
  // For production: get the base domain (e.g., birdieapp.co from www.birdieapp.co)
  const parts = hostname.split('.');
  if (parts.length > 1) {
    // Get just the last two parts of the domain
    return parts.slice(-2).join('.');
  }
  
  return hostname;
};

// Helper function to get cookie options based on environment
const getCookieOptions = () => {
  const domain = extractDomain(process.env.FRONTEND_URL);
  const isLocalhost = !domain; // domain is undefined for localhost
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    // For production (cross-origin): secure must be true when sameSite is 'None'
    // For localhost: secure must be false (localhost uses HTTP, not HTTPS)
    secure: isProduction && !isLocalhost,
    sameSite: isLocalhost ? 'Lax' : 'None', // Use 'Lax' for localhost, 'None' for cross-origin
    maxAge: 60 * 60 * 1000, // 1 hour
    path: '/',
    ...(domain && { domain }) // Only set domain if it's not undefined
  };
};

// ---------------------------------------------------------------------------------------------------
authRoute.get('/logout', (req, res) => {
  console.log('/auth/logout reached. Logging out');
  // Clear the JWT cookie with the same settings as when it was set
  const cookieOptions = getCookieOptions();
  res.clearCookie('BirdieJWT', cookieOptions);
  return res.status(200).json({redirect: true, url: `${process.env.FRONTEND_URL}/chat`})
});

//Log in user using local strategy
authRoute.post('/login', passport.authenticate('local', { failWithError: true, session: false }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    const { _doc, token } = req.user;
    console.log(`User with Id: ${_doc._id} signed in on ${new Date()}`)
    const cookieOptions = getCookieOptions();
    console.log("Setting cookie with options:", cookieOptions)
    res.cookie('BirdieJWT', token, cookieOptions);
    return res.status(200).json({redirect: true, url: `${process.env.FRONTEND_URL}/chat`})
  },
  (err, req, res, next) => {
    return res.status(401).json({ message: err.message })
  });

//Login user using google Strategy
authRoute.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRoute.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log("/auth/google/callback reached.");
    const { _doc, token } = req.user;
    console.log(`User with Id: ${_doc._id} signed in on ${new Date()}`)
    const cookieOptions = getCookieOptions();
    console.log("Setting cookie with options:", cookieOptions)
    res.cookie('BirdieJWT', token, cookieOptions);
    // if(process.env.CALLBACK_URL.includes('localhost')) return res.status(200).send("login Successfully!!")
    res.redirect(`${process.env.FRONTEND_URL}/chat`)
  }
);

authRoute.get('/test', authenticateJWT, (req, res) => {
  console.log('/auth/test reached.');
  console.log('Decoded token:', req.user);

  return res.status(200).json({
    isAuthenticated: true,
    user: req.user, // This contains the user data encoded in the token
  });
});

export default authRoute;