const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    ThreadId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Thread'
    },
    OPEN_AI_MESSAGE_ID:{
        type: String,
        required: true
    },
    prompt:String,
    response: String,
    timestamp: {
        type:Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;