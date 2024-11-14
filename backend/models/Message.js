const mongoose = require("mongoose");
const Thread = require("./Thread");

//
const messageSchema = new mongoose.Schema({
  threadID: {
    // the id associated from Thread collections
    // type: mongoose.Schema.Types.ObjectId, -> This will associated to ObjectID in Thread Table
    type: String,
    required: true,
    ref: "Thread",
  },
  userID:{ //to be used later for free user rule check
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  messageID: {
    //messageID returns from OpenAI
    type: String,
    required: true,
    unique: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: String,
  message_total_token: {
    //number of token returns from OpenAI
    type: Number,
    required: true,
  },
},
  {
    //add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// update the 'updatedAt' field in Thread collection when a new message is saved
messageSchema.pre("save", async function (next) {
  const message = this;
  const timestamps = message.createdAt;
  try {
    await Thread.updateOne(
      { threadID: message.threadID },
      { $set: { updatedAt: timestamps } }
    );
    next();
  } catch (err) {
    console.log("Unexpected error occured while updating 'updatedAt' field in Thread collection: ", err);
    return next(err);
  }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
