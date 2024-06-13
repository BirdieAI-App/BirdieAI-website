const mongoose = require('mongoose')


const conversationSchema = mongoose.Schema({
    userID:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    creationTime: {
        type: Date,
        default:Date.now
    },
    lastUpdateTime:{
        type: Date,
        default: Date.now
    },

});

const Chat = mongoose.model('Chat', conversationSchema);
module.exports = Chat;