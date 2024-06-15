const passportLocal = require('passport-local');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const localStrategy = new passportLocal.Strategy({passReqToCallback: true},
    async (req, email, password, done) => {
      let thisUser;
      try {
        thisUser = await User.findOne({"accountData.id": email});
        if (thisUser) {
          const match = await bcrypt.compare(password,thisUser.accountData.password);
          if  (match) {
            return done(null, thisUser);
          } else {
            req.authError = "The password is incorrect. Please try again" + 
                             " or reset your password.";
            return done(null, false)
          }
        } else { //userId not found in DB
          req.authError = "There is no account with email " + email + 
                          ". Please try again.";
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  );
  
module.exports = localStrategy;