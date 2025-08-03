import express from 'express';
import User from '../models/User.js';
import Thread from '../models/Thread.js';
import Message from '../models/Message.js';
import OpenAIPrompt from '../models/OpenAIPrompt.js';
import { checkRequiredKeys, validateRequest } from '../utils/requestValidation.js';
import OpenAI from 'openai';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { content } from '@/tailwind.config.js';

const messageRoute = express.Router();

messageRoute.route('/')
    //GET: getting all mesages existing in database
    .get(asyncErrorHandler(async (req, res) => {
        console.log('in /messages (GET) all messages in database');
        const messages = await Message.find();
        return res.status(200).json(messages);

    }))
    //PUT: saving a new message into database ---- auto update "update_at"
    .put(validateRequest(Message.schema), asyncErrorHandler(async (req, res) => {
        console.log('in /messages (PUT) saving new message into database');
        const { threadID, userID, prompt, feedback } = req.body;
        //-------------------------------------------- VALIDATING REQUEST ---------------------------------------------------------
        // check for required keys
        if (!checkRequiredKeys(userID, "userID", res) ||
            !checkRequiredKeys(prompt, "prompt", res)) {
            return;
        }
        let user;
        let newThread;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })
        if (threadID) {  // Check if thread exists when user Provides
            const thread = await Thread.findById(threadID);
            if (!thread) {
                const message = `Thread with ID=${threadID} does NOT exist in the database.`;
                return res.status(400).json({ message: message });
            }
        }
        // Check if user exists
        user = await User.findById(userID);
        if (!user) {
            const message = `User with ID=${userID} does NOT exist in the database.`;
            return res.status(400).json({ message: message });
        }
        //-------------------------------------------- PROCESSING REQUEST ---------------------------------------------------------
        // 1. counting to see if the total number of message exceed user limit withing 1 day (ONLY APPLY FOR Free tier user)
        // 2. saving the user prompt
        // 3. getting the latest prompt from openAI prompt collection
        // 4. construct the conversation based on threadID
        // 5. get answer from OpenAI
        // 6. save the answer 
        // 7. returns the response

        //Step 1
        if (user.profileData.subscriptionTier === 'Free') {
            const todayTimestamp = new Date().setHours(0, 0, 0, 0);  // Start of today
            const tomorrowTimestamp = todayTimestamp + (24 * 60 * 60 * 1000);  // Add 24 hours in milliseconds
            const dailyMessageCount = await Message.countDocuments({
                userID: userID,
                createdAt: {
                    $gte: todayTimestamp,
                    $lt: tomorrowTimestamp
                }
            });
            if (dailyMessageCount >= 5) {
                return res.status(400).json({ message: "user reached daily message" })
            }
        }

        //Step 3
        const openAIPrompt = await OpenAIPrompt.findOne().sort({ createdAt: -1 });

        // Step 3 construct message and retrieve response from OPEN AI
        // 3a. construct messages from threadHistory
        let chatHistory;
        if (threadID) {
            const messageList = await Message.find({ threadID: threadID, userID: userID });
            const history = messageList.map(msg => [
                { role: 'user', content: msg.prompt },
                { role: 'assistant', content: msg.response }
            ]).flat();
            chatHistory = [...history, { role: 'user', content: prompt }]
        } else {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: "system", content: `I am a highly efficient summarizer. 
                        Here are examples: 'Best vacation in Europe' from 
                        'What are the best vacation spots in Europe?'; 
                        'Discussing project deadline' from 
                        'We need to extend the project deadline by two weeks due to unforeseen issues.' 
                        Now, summarize the following user message within 4 to 5 words into a title:`
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ]
            })
            //Summarize and making the thread title
            const title = response.choices[0].message.content;
            newThread = await new Thread({
                userID: user._id.toString(),
                title: title
            }).save();
            threadID = newThread._id.toString();
            chatHistory = [{ role: 'user', content: prompt }];
        }

        const userPrompt = await new Message({
            threadID: threadID,
            userID: userID,
            content: prompt,
            role: "User"
        }).save();

        //3b. Retrieve response from openAI
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: openAIPrompt.toString() }, ...chatHistory],
        });

        // Step 4 Saving the new Message
        const newMessageBody = {
            threadID: threadID,
            userID: userID,
            content: gptResponse.choices[0].message.content,
            role: "Bot",
            messageID: userPrompt._id.toString()
        }

        //createat user, role 
            //    {
            // threadID: threadID,
            // userID: userID,
            // createdAt: 1:01AM,
            // role: "Bot"
            // content"why u ask?"
            // } 
        const message = await new Message(newMessageBody).save();
        return res.status(200).json(message);
    }))

messageRoute.route('/:messageID')
    //POST: update a message with a given messageID
    .post(validateRequest(Message.schema), asyncErrorHandler(async (req, res) => {
        const messageID = req.params.messageID;
        console.log("in /messages/:messageID (POST) updating message with messageID: " + messageID);
        const message = await Message.findById(messageID);
        if (!message) {
            console.log("Message with messageID=" + messageID + " does NOT exist in database")
            return res.status(400).send("Message with messageID=" + messageID + " does NOT exist in database");
        }
        for (const key in req.body) {
            message[key] = req.body[key];
        }
        await message.save();
        return res.status(200).json(message);
    }))
    //GET: getting a specific message given messageID
    .get(asyncErrorHandler(async (req, res) => {
        const messageID = req.params.messageID;
        console.log("in /messages/:messageID (GET) getting message with messageID: " + messageID);
        const message = await Message.findOne({ "_id": messageID });
        if (!message) {
            console.log("Message with messageID=" + messageID + " does NOT exist in database")
            return res.status(400).send("Message with messageID=" + messageID + " does NOT exist in database");
        }
        return res.status(200).json(message);

    }))


messageRoute.route('/t/:threadID')
    // GET: getting all mesages belongs to a user with ThreadID
    .get(asyncErrorHandler(async (req, res) => {
        const threadID = req.params.threadID
        console.log("in /message/t/:threadID getting all messages belongs to threadID: " + threadID);
        const messages = await Message.find({ "threadID": threadID })
        return res.status(200).json(messages);

    }))
export default messageRoute;