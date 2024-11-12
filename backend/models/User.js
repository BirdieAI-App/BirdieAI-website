const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    accountData:{
        email: {
            type: String,
            unique: true,
        },
        password:String
    },
    profileData:{
        stripeCustomerId: String,
        firstName: String,
        lastName: String,
        DOB: Date,
        subscriptionTier:{
            type:String,
            enum: ['Free', 'Monthly', 'Quarterly', 'Annually'],
            default: 'Free'
        },
        creationTime:{
            type: Date,
            default: Date.now
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;