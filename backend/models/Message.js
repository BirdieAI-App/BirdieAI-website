import mongoose from "mongoose";
import Thread from "./Thread.js";

const messageSchema = new mongoose.Schema({
  threadID: {
    // the id associated from Thread collections
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Thread",
  },
  userID: { //to be used later for free user rule check
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  content:{
    type: String,
    required: true,
  },
  messageID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  feedback: {
    type: String,
    enum: ["like", "dislike", "none"],
    default: "none",
  },
  role: {
    type:String,
    enum:["Bot", "User"],
    required: true,
  }
},
  {
    //add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ✅ Custom validation to ensure Bot messages reference a User message
messageSchema.pre("validate", function (next) {
  if (this.role === "Bot" && !this.messageID) {
    return next(new Error("Bot messages must have a messageID referencing the user's message."));
  }
  next();
});

// update the 'updatedAt' field in Thread collection when a new message is saved
messageSchema.pre("save", async function (next) {
  const message = this;
  const timestamps = message.createdAt;
  try {
    await Thread.updateOne(
      { _id: message.threadID },
      { $set: { updatedAt: timestamps } }
    );
    next();
  } catch (err) {
    console.log("Unexpected error occured while updating 'updatedAt' field in Thread collection: ", err);
    return next(err);
  }
});


const Message = mongoose.model("Message", messageSchema);
export default Message;