const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    accountData:{
        email: {
            type: String,
            unique: true,
            // validate: {
            //     validator: function(v) {
            //         const regex = /^(?=.{6,30}$)(?!.*\.\.)(?!^\.)[a-zA-Z0-9.]*[a-zA-Z0-9]$/;
            //         return regex.test(v);
            //     },
            //     message: props => `${props.value} is not a valid email address!`
            // }
        },
        password:String
    },
    profileData:{
        firstName: String,
        lastName: String,
        DOB: Date,
        subscriptionTier:{
            type:String,
            enum: ['Free', 'Paid'],
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