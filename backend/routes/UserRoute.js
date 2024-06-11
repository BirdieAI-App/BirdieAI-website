const express = require('express');
const User = require('../models/User.js');

const userRoute = express.Router();
const validAccountDataProps=['email', "password", "securityQuestion", "securityAnswer"]
const validProfileDataProps=['firstName','lastName', 'subscriptionTier', 'creationTime']

userRoute.route('/users/:userId')
    //GET request: getting a user with a given userID
    .get(async(req,res)=>{

    })
/dashboard

userRoute.route('/users')
    //GET request: getting user based on query
    .get(async(req,res)=>{
        const{email,password} = req.query
        if(!email && !password){
            //getting all user
        }else if(email && password){//for authentication
            //getting user based on email and password
        }
    })
    //POST request: saving a new user into database
    .post(async(req,res)=>{
        //validate body of the request
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