const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    accountData:{
        username: {
            type:String,
            unique: true,
            required: true
        },
        password:{
            type:String, // have it as String for now, then later on set it a binary encryption
            reuiqred: true
        }
    },
    profileData:{
        name:{
            type: String,
            required: true
        }, 
        subscriptionTier:{
            type:String,
            enum: ['Free', 'Paid'],
            default: 'Free'
        },
        email:{
            type: String,
            validate: {
                validator: function(v) {
                    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        },
        creationDate:{
            type: Date,
            default: Date.now
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;