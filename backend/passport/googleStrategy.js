import GoogleStrategy from 'passport-google-oauth2';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

// Use VERCEL_URL for preview/production on Vercel when CALLBACK_URL not set
const getCallbackUrl = () => {
    const base = process.env.CALLBACK_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    return base ? `${base.replace(/\/$/, '')}/call/auth/google/callback` : null;
};

const callbackURL = getCallbackUrl();
if (!callbackURL || !process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
    console.warn('Google OAuth: missing CALLBACK_URL/VERCEL_URL, GOOGLE_ID, or GOOGLE_SECRET');
}

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: callbackURL || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/call/auth/google/callback`
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
        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.accountData.email
            },
            process.env.JWT_SIGNING_SECRET,
            {
                expiresIn: '1h'
            }
        )
        return done(null, {...user, token});
    }
);

export default googleStrategy;