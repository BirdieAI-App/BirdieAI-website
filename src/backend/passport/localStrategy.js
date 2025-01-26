import passportLocal from 'passport-local';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

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
                console.log("User Found!!!!.......... Comparing password")
                const match = await bcrypt.compare(password, user.accountData.password);
                if (match) {
                    console.log("Password matched!")
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
                    console.log("Password NOT matched!")
                    const error = new Error("Incorrect email or password")
                    return done(error)
                }
            } else { //user with email not found in DB
                console.log("User NOT FOUND!")
                const error = new Error("Incorrect email or password")
                return done(error)
            }
        } catch (err) {
            console.log(err.message)
            return done(err);
        }
    }
);

export default localStrategy;