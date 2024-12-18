import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


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
export default User;