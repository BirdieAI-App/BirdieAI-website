const express = require('express');
const OpenAIPrompt = require('../models/OpenAIPrompt');

const openAIPromptRoute = express.Router();

openAIPromptRoute.route('/openai')
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

openAIPromptRoute.route('/openai/lastest')
    //GET request: get lastest OpenAIPrompt
    .get(async (req, res) => {
        console.log("in /openai/lastest route (GET) getting lastest OpenAIPrompt from database.");
        try {
            const prompt = await OpenAIPrompt.findOne().sort({ createdAt: -1 });
            if (!prompt) {
                return res.status(404).send("No prompt found in the database");
            }
            return res.status(201).json(prompt);
        } catch (err) {
            return res.status(500).send("Unexpected error occured when getting lastest OpenAIPrompt: " + err);
        }
    });

module.exports = openAIPromptRoute;