const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "User",
  },
  status:{
    //status: userTier on Creation of Thread
    type: String,
    enum: ['Free', 'Monthly', 'Quarter', 'Annually'],
    default: 'Free' 
  },
  threadID: {
    //thread ID returns from OpenAI
    type: String,
    requried: true,
    unique: true,
  },
  title: {
    type: String,
    require: true,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  file_ID: [String],
  modified_thread: {
    type: Boolean,
    default: false,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
});

const Thread = mongoose.model("Thread", threadSchema);
module.exports = Thread;
