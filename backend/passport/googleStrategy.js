const GoogleStrategy = require('passport-google-oauth2'); 
const User = require ('../models/User.js');

const googleStrategy = new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
        console.log("User authenticated through Google. In passport callback.");
        //Our convention is to build userId from displayName and provider
        const email = profile.email;
        //See if document with this unique userId exists in database 
        let currentUser = await User.findOne({"accountData.email": email});
        if (!currentUser) { //Add this user to the database
            currentUser = await new User({
            accountData: {email: email},
            identityData: {displayName: profile.displayName}
        }).save();
        }
        return done(null, currentUser);
    }
);

module.exports = googleStrategy;
