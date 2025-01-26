import mongoose from 'mongoose'

const threadSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    require: true,
  }
},
  {
    //add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Thread = mongoose.model("Thread", threadSchema);
export default Thread;