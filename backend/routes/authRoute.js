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

// Helper function to get cookie options based on environment and request
const getCookieOptions = (req) => {
  const host = req?.headers?.host || '';
  const isVercelPreview = host.includes('vercel.app');
  const isLocalhost = host.includes('localhost');
  const isProduction = process.env.NODE_ENV === 'production';

  // On Vercel preview: don't set domain so cookie uses current host
  // On localhost: no domain
  // On production (birdieapp.co): set domain for subdomain sharing
  let domain;
  if (!isVercelPreview && !isLocalhost && process.env.FRONTEND_URL) {
    domain = extractDomain(process.env.FRONTEND_URL);
  }

  return {
    httpOnly: true,
    secure: isProduction && !isLocalhost,
    sameSite: isLocalhost || isVercelPreview ? 'Lax' : 'None',
    maxAge: 60 * 60 * 1000, // 1 hour
    path: '/',
    ...(domain && { domain })
  };
};

// ---------------------------------------------------------------------------------------------------
authRoute.get('/logout', (req, res) => {
  console.log('/auth/logout reached. Logging out');
  const cookieOptions = getCookieOptions(req);
  res.clearCookie('BirdieJWT', cookieOptions);
  const redirectUrl = (req?.headers?.host && req.headers.host.includes('vercel.app'))
    ? `https://${req.headers.host}/chat`
    : `${process.env.FRONTEND_URL}/chat`;
  return res.status(200).json({redirect: true, url: redirectUrl});
});

//Log in user using local strategy
authRoute.post('/login', passport.authenticate('local', { failWithError: true, session: false }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    const { _doc, token } = req.user;
    console.log(`User with Id: ${_doc._id} signed in on ${new Date()}`)
    const cookieOptions = getCookieOptions(req);
    res.cookie('BirdieJWT', token, cookieOptions);
    const redirectUrl = (req?.headers?.host && req.headers.host.includes('vercel.app'))
      ? `https://${req.headers.host}/chat`
      : `${process.env.FRONTEND_URL}/chat`;
    return res.status(200).json({redirect: true, url: redirectUrl})
  },
  (err, req, res, next) => {
    return res.status(401).json({ message: err.message })
  });

//Login user using google Strategy
authRoute.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
    return res.status(503).json({ message: 'Google sign-in is not configured' });
  }
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});
authRoute.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log("/auth/google/callback reached.");
    const { _doc, token } = req.user;
    console.log(`User with Id: ${_doc._id} signed in on ${new Date()}`)
    const cookieOptions = getCookieOptions(req);
    res.cookie('BirdieJWT', token, cookieOptions);
    const redirectUrl = (req?.headers?.host && req.headers.host.includes('vercel.app'))
      ? `https://${req.headers.host}/chat`
      : `${process.env.FRONTEND_URL}/chat`;
    res.redirect(redirectUrl);
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