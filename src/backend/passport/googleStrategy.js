import GoogleStrategy from 'passport-google-oauth2';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        console.log("User authenticated through Google. In passport callback.");
        const userId = profile.email
        // See if document with this unique userId exists in database 
        let user = await User.findOne({ "accountData.email": userId });
        if (!user) { //Add this user to the database
            user = await new User({
                accountData: { 
                    email: userId 
                },
                profileData:{
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    subscriptionTier: 'Free'
                }
            }).save();
        }
        const token = jwt.sign({
                id: user._id.toString(),
                email: user.accountData.email
            },
            "BirdieAI",
            {
                expiresIn: '1h'
            }
        )

        return done(null, user);
    }
);

export default googleStrategy;
