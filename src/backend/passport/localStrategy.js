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
        let user;
        try {
            user = await User.findOne({ "accountData.email": email });
            if (user) {
                const match = await user.comparePassword(password);
                if (match) {
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