const passport = require('passport');
const session = require('express-session');
const User = require('../models/User.js')


const configPassport = (app) =>{
    passport.serializeUser((user, done) => {
        console.log("In serializeUser.");
        console.log("Contents of user param: " + JSON.stringify(user));
        done(null,user._id);
    });

    passport.deserializeUser(async (userId, done) => {
        console.log("In deserializeUser.");
        let thisUser;
        try {
          thisUser = await User.findOne({"_id": userId});
          console.log("User with id " + userId + 
            " found in DB. User object will be available in server routes as req.user.")
          done(null,thisUser);
        } catch (err) {
          done(err);
        }
      });

      app
        .use(
            session({
                secret: process.env.SESSION_SECRET, 
                resave: false,
                saveUninitialized: false,
                cookie: {maxAge: 1000 * 60}
            })
        )
        .use(passport.initialize())
        .use(passport.session());
}

module.exports = configPassport;