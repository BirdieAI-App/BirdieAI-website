const mongoose = require('mongoose')


const chatSchema = mongoose.Schema({
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

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;