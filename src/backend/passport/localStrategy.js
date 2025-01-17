import passportLocal from 'passport-local';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

const localStrategy = new passportLocal.Strategy({ 
    usernameField: "email",
    passwordField: "password",
    passReqToCallback : true
},
    async (req, email, password, done) => {
        console.log("User authenticated through localStrategy");
        let currentUser;
        try {
            currentUser = await User.findOne({ "accountData.email": email });
            if (currentUser) {
                const match = await currentUser.comparePassword(password);
                if (match) {
                    const token = jwt.sign({
                        id: currentUser._id.toString(),
                        email: currentUser.accountData.email
                    },
                        "BirdieAI",
                        {
                            expiresIn: '1h'
                        }
                    )
                    return done(null, {
                        id: currentUser._id.toString(),
                        token
                    });
                } else {
                    return done(null, false, {message: "Incorrect email or password"})
                }
            } else { //userId not found in DB
                return done(null, false, {message: "Incorrect email or password"})
            }
        } catch (err) {
            return done(err);
        }
    }
);

export default localStrategy;