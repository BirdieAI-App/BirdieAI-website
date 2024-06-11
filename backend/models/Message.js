const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    ConversationID:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Conversation'
    },
    message:{
        type:String,
        required: true
    },
    sender:String,
    timestamp: {
        type:Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;