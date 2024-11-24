const mongoose = require("mongoose");
const { default: OpenAI } = require("openai");

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
module.exports = OpenAIPrompt;