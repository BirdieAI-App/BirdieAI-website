import express from 'express';
import User from '../models/User.js';
import authenticateJWT from '../passport/authenticateJWT.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { validateRequest, checkRequiredKeys } from '../utils/requestValidation.js';

const userRoute = express.Router();

userRoute.route('/:userId')
    //GET request: getting a user with a given userID
    .get(authenticateJWT, asyncErrorHandler(async (req, res) => {
        const userId = req.params.userId;
        console.log("in /users/:userId route (GET) user with userId = " + JSON.stringify(userId));
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User with id: " + userId + " does not exist in database");
        }
        return res.status(200).json(user);

    }))
    //PUT request: Update a user with a given userId
    .put(authenticateJWT, asyncErrorHandler(async (req, res) => {
        const userid = req.params.userId;
        console.log("in /users/:userId route (PUT) to update user with id: " + userid);
        //validate body request
        for (const bodyProp in req.body) {
            if (bodyProp === 'accountData') {
                for (const accountProp in req.body.accountData) {
                    if (!validAccountDataProps.includes(accountProp)) {
                        return res.status(400).send("user /PUT request formatted incorrectly. Props:" +
                            accountProp + " does not exist in the user schema"
                        );
                    }
                }
            } else if (bodyProp == 'profileData') {
                for (const profileProp in req.body.profileData) {
                    if (!validProfileDataProps.includes(profileProp)) {
                        return res.status(400).send("user /PUT request formatted incorrectly.Props: " +
                            profileProp + " doesnot exist in the user schema"
                        );
                    }
                }
            } else {
                return res.status(400).send('users /PUT request formatted incorrectly. ' +
                    "Only the following props are allowed in top-level:" +
                    "'accountData', 'profileData'"
                );
            }
        }
        let updateData = {};

        if (req.body.accountData) {
            for (const key in req.body.accountData) {
                updateData[`accountData.${key}`] = req.body.accountData[key];
            }
        }
        if (req.body.profileData) {
            for (const key in req.body.profileData) {
                updateData[`profileData.${key}`] = req.body.profileData[key];
            }
        }
        let status = await User.updateOne({ "_id": userid }, { $set: updateData });
        if (status.modifiedCount != 1) {
            console.log("status: " + JSON.stringify(status));
            return res.status(404).send("Account not update. Either no account with user id=" + userid + " exist, or no value in the account was chagne");
        }
        return res.status(200).send("successfully modified the account");

    }))

userRoute.route('/')
    //GET request: getting all users in the database
    .get(authenticateJWT, asyncErrorHandler(async (req, res) => {
        console.log("in /users route (GET) all user in database.");
        let users = await User.find();
        return res.status(200).json(users);

    }))
    //POST request: saving a new user into database
    .post(validateRequest(User.schema), asyncErrorHandler(async (req, res) => {
        console.log("in /users route (POST) saving a new user into database.");
        //validate body of the request
        // const validAccountDataProps = [email, password];
        // const validProfileDataProps = [stripeCustomerId, firstName, lastName, subscriptionTier];
        // for (const bodyProp in req.body) {
        //     if (bodyProp === 'accountData') {
        //         for (const accountProp in req.body.accountData) {
        //             if (!validAccountDataProps.includes(accountProp)) {
        //                 return res.status(400).send("user /POST request formatted incorrectly. Props:" +
        //                     accountProp + " does not exist in the user schema"
        //                 );
        //             }
        //         }
        //     } else if (bodyProp == 'profileData') {
        //         for (const profileProp in req.body.profileData) {
        //             if (!validProfileDataProps.includes(profileProp)) {
        //                 return res.status(400).send("user /POST request formatted incorrectly.Props: " +
        //                     profileProp + " doesnot exist in the user schema"
        //                 );
        //             }
        //         }
        //     } else {
        //         return res.status(400).send('users /POST request formatted incorrectly. ' +
        //             "Only the following props are allowed in top-level:" +
        //             "'accountData', 'profileData'"
        //         );
        //     }
        // }
        let user = await User.findOne({ "accountData.email": req.body.accountData.email });
        if (user) {//checking for user availability ---- user existed
            return res.status(400).send("email: " + req.body.accountData.email + " already existed in databsae");
        }
        //user has not been used. Good to add
        let newUserData = {}
        if (req.body.accountData) {
            for (let key in req.body.accountData) {
                newUserData[`accountData.${key}`] = req.body.accountData[key];
            }
        }

        if (req.body.profileData) {
            for (let key in req.body.profileData) {
                newUserData[`profileData.${key}`] = req.body.profileData[key];
            }
        }
        let newUser = await new User(newUserData).save();
        return res.status(200).json(newUser);
    }))

export default userRoute;