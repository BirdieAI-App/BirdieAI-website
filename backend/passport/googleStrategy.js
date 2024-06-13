import GoogleStrategy from "passport-google-oauth2";
import User from "../models/User.js";

const googleStrategy = new GoogleStrategy.Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.DEPLOY_URL + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("User authenticated through Google. In passport callback.");
        //Our convention is to build userId from displayName and provider
        const userId = `${profile.username}@${profile.provider}`;
        //See if document with this unique userId exists in database
        let currentUser = await User.findOne({ "accountData.email": userId });
        if (!currentUser) {
            //Add this user to the database
            currentUser = await new User({
                accountData: { email: userId },
                identityData: {
                    displayName: profile.displayName,
                    profilePic: profile.photos[0].value,
                },
            }).save();
        }
        return done(null, currentUser);
    }
);

export default googleStrategy;
