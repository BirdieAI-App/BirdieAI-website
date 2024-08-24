const express = require('express');
const User = require('../models/User.js');

const userRoute = express.Router();
const validAccountDataProps=['email', "password", "securityQuestion", "securityAnswer"]
const validProfileDataProps=['firstName','lastName', 'subscriptionTier', 'creationTime']

userRoute.route('/users/:userId')
    //GET request: getting a user with a given userID
    .get(async(req,res)=>{
        const userId = req.params.userId;
        console.log("in /users/:userId route (GET) user with userId = " + JSON.stringify(userId));
        try{
            let user = await User.findById(userId);
            if(!user){
                return res.status(404).send("User with id: "+ userId+" does not exist in database");
            }
            return res.status(200).json(user);
        }catch(err){
            return res.status(500).send("Unexpected error occured when getting user "+ req.params.userId+ ": "+ err);
        }
    })
    //PUT request: Update a user with a given userId
    .put(async(req,res) => {
        const userid = req.params.userId;
        console.log("in /users/:userId route (PUT) to update user with id: "+ userid);
        //validate body request
        for(const bodyProp in req.body){
            if(bodyProp === 'accountData'){
                for(const accountProp in req.body.accountData){
                    if(!validAccountDataProps.includes(accountProp)){
                        return res.status(400).send("user /PUT request formatted incorrectly. Props:"+
                            accountProp + " does not exist in the user schema"
                        );
                    }
                }
            }else if(bodyProp == 'profileData'){
                for(const profileProp in req.body.profileData){
                    if(!validProfileDataProps.includes(profileProp)){
                        return res.status(400).send("user /PUT request formatted incorrectly.Props: "+
                            profileProp + " doesnot exist in the user schema"
                        );
                    }
                }
            }else{
                return res.status(400).send('users /PUT request formatted incorrectly. ' +
                    "Only the following props are allowed in top-level:" +
                    "'accountData', 'profileData'"
                );
            }
        }
        try{
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
                let status = await User.updateOne({"_id": userid},{$set: updateData});
                if(status.modifiedCount != 1){
                    console.log("status: " + JSON.stringify(status));
                    return res.status(404).send("Account not update. Either no account with user id="+ userid+" exist, or no value in the account was chagne");
                }
                return res.status(200).send("successfully modified the account");
        }catch(err){
            return res.status(500).send("Unexpected error occured when updating user data: "+err);
        }
    })
    //DELETE request: delete an existing user with a given Id
    .delete(async(req, res)=>{
        const userId = req.params.userId;
        console.log("in /users route (DELETE) user with userId = " + JSON.stringify(userId));
        try{
            let status = await User.deleteOne({"_id": userId});
            if (status.deletedCount != 1) {
                return res.status(404).send("No user account " +req.params.userId + " was found. Account could not be deleted.");
              }
            return res.status(200).send("User account " + req.params.userId + " was successfully deleted.");
        }catch(err){
            return res.status(500).send("Unexpected error occured when deleting user "+ req.params.userId+ ": "+ err);
        }
    })

userRoute.route('/users')
    //GET request: getting all users in the database
    .get(async(req,res)=>{
        console.log("in /users route (GET) all user in database.");
        try{
            let users = await User.find();
            return res.status(200).json(users);
        }catch(err){
            return res.status(500).send("Unexpected error occured when getting the users in database: "+ err);
        }
    })
    //POST request: saving a new user into database
    .post(async(req,res)=>{
        console.log("in /users route (POST) saving a new user into database.");
        //validate body of the request
        console.log(req.body);
        for(const bodyProp in req.body){
            if(bodyProp === 'accountData'){
                for(const accountProp in req.body.accountData){
                    if(!validAccountDataProps.includes(accountProp)){
                        return res.status(400).send("user /POST request formatted incorrectly. Props:"+
                            accountProp + " does not exist in the user schema"
                        );
                    }
                }
            }else if(bodyProp == 'profileData'){
                for(const profileProp in req.body.profileData){
                    if(!validProfileDataProps.includes(profileProp)){
                        return res.status(400).send("user /POST request formatted incorrectly.Props: "+
                            profileProp + " doesnot exist in the user schema"
                        );
                    }
                }
            }else{
                return res.status(400).send('users /POST request formatted incorrectly. ' +
                    "Only the following props are allowed in top-level:" +
                    "'accountData', 'profileData'"
                );
            }
        }
        try{
            console.log("in /users route (POST) new user to database")
            let user = await User.findOne({"accountData.email": req.body.accountData.email});
            if(user){//checking for user availability ---- user existed
                return res.status(400).send("email: "+ req.body.accountData.email + " already existed in databsae");
            }
            //user has not been used. Good to add
            let newUserData = {}
            if(req.body.accountData){
                for(let key in req.body.accountData){
                    newUserData[`accountData.${key}`] = req.body.accountData[key];
                }
            }

            if(req.body.profileData){
                for(let key in req.body.profileData){
                    newUserData[`profileData.${key}`] = req.body.profileData[key];
                }
            }
            let newUser = await new User(newUserData).save();
            return res.status(200).json(newUser);
        }catch(err){
            return res.status(500).send("Unexpected error occured when saving user to database: "+ err);
        }
    })

module.exports = userRoute;