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
        console.log("Starting authentication process...");
        let user;
        try {
            console.log("Searching for user with email:", email);
            user = await User.findOne({ "accountData.email": email });
            
            if (user) {
                console.log("User Found! Stored hash:", user.accountData.password);
                console.log("Attempting to compare provided password...");
                
                try {
                    // Add timeout for bcrypt comparison
                    const comparePromise = bcrypt.compare(password, user.accountData.password);
                    const match = await Promise.race([
                        comparePromise,
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('bcrypt comparison timeout')), 5000)
                        )
                    ]);

                    console.log("bcrypt comparison completed with result:", match);
                    
                    if (match) {
                        console.log("Password matched! Creating JWT...");
                        const token = jwt.sign(
                            {
                                id: user._id.toString(),
                                email: user.accountData.email
                            },
                            process.env.JWT_SIGNING_SECRET,
                            {
                                expiresIn: '1h'
                            }
                        );
                        console.log("JWT created successfully");
                        return done(null, { ...user, token });
                    } else {
                        console.log("Password NOT matched!");
                        return done(new Error("Incorrect email or password"));
                    }
                } catch (bcryptError) {
                    console.error("Error during bcrypt comparison:", bcryptError);
                    return done(bcryptError);
                }
            } else {
                console.log("User NOT FOUND!");
                return done(new Error("Incorrect email or password"));
            }
        } catch (err) {
            console.error("Error in authentication process:", err);
            return done(err);
        }
    }
);

export default localStrategy;