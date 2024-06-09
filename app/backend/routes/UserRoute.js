const express = require('express');
const User = require('../models/User.js');

const userRoute = express.Router();
userRoute.route('/users/:userId')
    //GET request: getting a user with a given userID
    .get()


userRoute.route('/users')
    //POST request: saving a new user into database
    .post(async(req,res)=>{
        if(!req.body.accountData.email){
            return res.status(404).send("Unable to save new user to database due to missing email");
        }
        if(!req.body.accountData.password){
            return res.status(404).send("Unable to save new user to database due to missing password");
        }
        if(!req.body.profileData.displayName){
            return res.status(404).send("Unable to save new user to database due to missing name");
        }
        try{
            console.log("in /users route (POST) new user to database")
            let user = await User.findOne({"accountData.username": req.body.accountData.username});
            if(user){//checking for user availability ---- user existed
                return res.status(400).send("Username: "+ req.body.accountData.username + " already existed in databsae");
            }
            //user has not been used. Good to add
            let newUser = await new User({
                accountData:{
                    email: req.body.accountData.email,
                    password: req.body.accountData.password,
                    securityQuestion: req.body.accountData.securityQuestion,
                    securityAnswer: req.body.accountData.securityAnswer
                },
                profileData:{
                    subscriptionTier: req.body.profileData.subscriptionTier,
                    firstName: req.body.profileData.firstName,
                    lastName: req.body.profileData.lastName,
                    creationTime: req.body.profileData.creationTime
                }
            }).save();
            return res.status(200).json(newUser);
        }catch(err){
            return res.status(500).send("Unexpected error occured when saving user to database: "+ err);
        }
    })

module.exports = userRoute;