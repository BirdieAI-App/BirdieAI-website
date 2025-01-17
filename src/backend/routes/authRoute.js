// libraries import
import express from 'express';
import passport from 'passport';

const authRoute = express.Router();

authRoute.get('/auth/logout', (req, res) => {
  console.log('/auth/logout reached. Logging out');
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,  // Ensure it's the same settings as when you set the cookie
      secure: true,    // Ensure cookies set over HTTPS are cleared
      sameSite: 'Strict', // Match the sameSite setting
    });
    return res.redirect(`${process.env.FRONTEND_URL}/api/auth/signin`)
});

//Log in user using local strategy
authRoute.post('/auth/login', passport.authenticate('local', { failWithError: true, session: false }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    const {id,token} = req.user;
    console.log(`User with Id: ${id} signed in on ${new Date()}`)
    res.cookie('jwt', token, {
      httpOnly: true,       // Prevents JavaScript access (XSS protection)
      secure: true,         // Ensures the cookie is only sent over HTTPS
      sameSite: 'Strict',   // Prevents CSRF
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.redirect(`${process.env.FRONTEND_URL}/chat?id=${id}`)
  },
  (err, req, res, next) => {
    return res.status(401).send(err.message)
  });


authRoute.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
authRoute.get('/auth/google/callback', passport.authenticate( 'google', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log("/auth/google/callback reached.");
    const {id,token} = req.user;
    console.log(`User with Id: ${id} signed in on ${new Date()}`)
    res.cookie('jwt', token, {
      httpOnly: true,       // Prevents JavaScript access (XSS protection)
      secure: true,         // Ensures the cookie is only sent over HTTPS
      sameSite: 'Strict',   // Prevents CSRF
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.redirect(`${process.env.FRONTEND_URL}/chat?id=${id}`)
  }
);

authRoute.get('/auth/test', (req, res)=>{
  console.log("/auth/test reached.");
  const isAuth = req.isAuthenticated();
  if (isAuth) {
      console.log("User is authenticated");
      console.log("User record tied to session: " + JSON.stringify(req.user));
  } else {
      //User is not authenticated
      console.log("User is not authenticated");
  }
  //Return JSON object to client with results.
  res.json({isAuthenticated: isAuth, user: req.user});
});

export default authRoute;