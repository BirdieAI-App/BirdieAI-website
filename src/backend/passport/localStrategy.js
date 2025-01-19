import passportLocal from 'passport-local';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

const localStrategy = new passportLocal.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},
    async (req, email, password, done) => {
        console.log("User authenticated through localStrategy");
        let user;
        try {
            user = await User.findOne({ "accountData.email": email });
            if (user) {
                const match = await user.comparePassword(password);
                if (match) {
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
                    return done(null, { ...user, token });
                } else {
                    const error = new Error("Incorrect email or password")
                    return done(error)
                }
            } else { //user with email not found in DB
                const error = new Error("Incorrect email or password")
                return done(error)
            }
        } catch (err) {
            return done(err);
        }
    }
);

export default localStrategy;