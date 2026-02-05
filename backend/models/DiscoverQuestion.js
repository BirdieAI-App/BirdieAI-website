import mongoose from "mongoose";

const discoverQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const DiscoverQuestion = mongoose.model("DiscoverQuestion", discoverQuestionSchema);
export default DiscoverQuestion;
