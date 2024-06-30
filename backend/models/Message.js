const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
    threadID:{// the id associated from Thread collections
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Thread'
    },
    messageID:{//messageID returns from OpenAI
        type: String,
        required: true,
        unique: true
    },
    prompt:{
        type: String,
        required: true
    },
    response: String,
    create_at: {
        type:Date,
        default: Date.now
    },
    message_total_token:{//number of token returns from OpenAI
        type: Number, 
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;