import express from 'express';
import OpenAIPrompt from '../models/OpenAIPrompt.js';

const openAIPromptRoute = express.Router();

openAIPromptRoute.route('/')
    //POST request: save a new OpenAIPrompt
    .post(async (req, res) => {
        console.log("in /openai route (POST) saving a new OpenAIPrompt into database.");
        const prompt = req.body.prompt;
        try {
            const newPrompt = new OpenAIPrompt({ prompt });
            await newPrompt.save();
            return res.status(201).json(newPrompt);
        } catch (err) {
            return res.status(500).send("Unexpected error occured when saving OpenAIPrompt: " + err);
        }
    });

export default openAIPromptRoute;