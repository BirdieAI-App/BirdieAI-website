const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    accountData:{
        email:{
            type: String,
            unique: true,
            validate: {
                validator: function(v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        },
        password:{
            type:String, // have it as String for now, then later on set it a binary encryption
            // turn off for now to test sign in with google
            // reuiqred: true
        }
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