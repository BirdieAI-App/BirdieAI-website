import mongoose from "mongoose";

const OpenAIPromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  }
);

const OpenAIPrompt = mongoose.model("OpenAIPrompt", OpenAIPromptSchema);
export default OpenAIPrompt;