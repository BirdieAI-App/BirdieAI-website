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

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it's new or has been modified
    if (!user.isModified('accountData.password')) return next();

    try {
        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.accountData.password, saltRounds);

        // Replace the plain password with the hashed one
        user.accountData.password = hashedPassword;
        console.log(`hashed password: ${hashedPassword}`)
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.accountData.password);
};

const User = mongoose.model('User', userSchema);
export default User;