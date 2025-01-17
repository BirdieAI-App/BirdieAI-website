import express from 'express';
import User from '../models/User.js';
import Thread from '../models/Thread.js';
import Message from '../models/Message.js';
import OpenAIPrompt from '../models/OpenAIPrompt.js';

const messageRoute = express.Router();
const validMessageProps = Object.keys(Message.schema.paths).filter((keys)=>!keys.startsWith("_"));
const freeTierMessageLimit = 5

const isValidRequest = (req) => {
    // true if request is good formated
    // false if request contains keys that does not belongs to database
    for(const keys in req.body){
        if(!validMessageProps.includes(keys)){
            console.log(`${keys} is not a valid props in Message collection`)
            return false;
        }
    }
    return true;
}

const validateRequestBody = (field, res, errorMessage) => {
    if (!field) {
        console.log(errorMessage);
        res.status(400).send(errorMessage);
        return false;
    }
    return true;
};

messageRoute.route("/messages")
    //GET: getting all mesages existing in database
    .get(async(req,res)=>{
        console.log('in /messages (GET) all messages in database');
        try{
            const messages = await Message.find();
            return res.status(200).json(messages);
        }catch(err){
            return res.status(500).send("Unexpected error occured while getting all the messages in database: "+err);
        }
    })
    //DELETE: deleting all theads existing in database
    .delete(async(req,res)=>{
        console.log('in /messages (DELETE) all messages in database');
        try{
            const deletedMessage = await Message.deleteMany();
            if(deletedMessage.deletedCount == 0){
                return res.status(200).send("No messages were deleted");
            }
            return res.status(200).send("Sucessfully deleted all messages in database")
        }catch(err){
            return res.status(500).send("Unexpected error occured while deleting all messages in database: "+ err);
        }
    })
    //PUT: saving a new message into database ---- auto update "update_at"
    .put(async(req,res)=>{
        console.log('in /messages (PUT) saving new message into database');
        //-------------------------------------------- VALIDATING REQUEST ---------------------------------------------------------
        if(!isValidRequest(req)){
            return res.status(400).send("Request body contains an invalid field")
        }
        let user;
        const {threadID, userID, prompt} = req.body;
        try {
            // Validate required fields
            if (
                !validateRequestBody(req.body.userID, res, "Request body must contain userID") ||
                !validateRequestBody(req.body.prompt, res, "Request body must contain the user's prompt")
            ) {
                return;
            }
        
            // Check if thread exists
            const thread = await Thread.findOne({ threadID: threadID });
            if (!thread) {
                const message = `Thread with ID=${threadID} does NOT exist in the database.`;
                console.log(message);
                return res.status(400).send(message);
            }
            // Check if user exists
            user = await User.findById(userID);
            if (!user) {
                const message = `User with ID=${userID} does NOT exist in the database.`;
                console.log(message);
                return res.status(400).send(message);
            }
        } catch (err) {
            console.error(`Unexpected error: ${err}`);
            return res.status(500).send(`Unexpected error occurred: ${err.message}`);
        }
        //-------------------------------------------- PROCESSING REQUEST ---------------------------------------------------------
        // 1. counting to see if the total number of message exceed user limit withing 1 day (ONLY APPLY FOR Free tier user)
        // 2. getting the latest prompt from openAI prompt collection
        // 3. construct the conversation based on threadID
        // 4. save the prompt + answer 
        // 5. returns the response
        if(user.profileData.subscriptionTier === 'Free'){
            const todayTimestamp = new Date().setHours(0, 0, 0, 0);  // Start of today
            const tomorrowTimestamp = todayTimestamp + (24 * 60 * 60 * 1000);  // Add 24 hours in milliseconds
            const dailyMessageCount = await Message.countDocuments({ 
                userID: userID,
                createdAt: {
                    $gte: todayTimestamp,
                    $lt: tomorrowTimestamp
                }
            });
            if(dailyMessageCount >= 5){
                return res.status(201).send("user reached daily message")
            }
        }
        try{
            const openAIPrompt = await OpenAIPrompt.findOne().sort({ createdAt: -1 });
            console.log(openAIPrompt)
        }catch(err){
            const msg = `error while retrive lastest prompt for OPENAI: ${err.message}`
            console.log(msg);
        }


        // const newMessageBody = {}
        // for(const key in req.body){
        //     newMessageBody[key] = req.body[key]
        // }
        // try{
        //     // adding new message into message collection and update 'update_at' field in Thread collection
        //     const message = await new Message(newMessageBody).save();
        //     return res.status(200).json(message);
        // }catch(err){
        //     return res.status(500).send("Unexpected err occured while saving new message into database: "+ err);
        // }
    })
    
messageRoute.route('/messages/:messageID')
    //POST: update a message with a given messageID
    .post(async(req,res)=>{
        const messageID = req.params.messageID;
        console.log("in /messages/:messageID (POST) updating message with messageID: "+ messageID);
        if(!isValidRequest(req)){
            return res.status(400).send("Request body contains an invalid field")
        }
        try{
            const message = await Message.findOne({"_id": messageID});
            if(!message){
                console.log("Message with messageID=" + messageID + " does NOT exist in database")
                return res.status(400).send("Message with messageID=" + messageID + " does NOT exist in database");
            }
            for(const key in req.body){
                message[key] = req.body[key];
            }
            await message.save();
            return res.status(200).json(message);
        }catch(err){
            return res.status(500).send("Unexpected error occured while updating message with messageID: "+ messageID + ": "+ err);
        }
    })
    //GET: getting a specific message given messageID
    .get(async(req,res)=>{
        const messageID = req.params.messageID;
        console.log("in /messages/:messageID (GET) getting message with messageID: "+ messageID);
        try{
            const message = await Message.findOne({"_id": messageID});
            if(!message){
                console.log("Message with messageID=" + messageID + " does NOT exist in database")
                return res.status(400).send("Message with messageID=" + messageID + " does NOT exist in database");
            }
            return res.status(200).json(message);
        }catch(err){
            return res.status(500).send("Unexpected error occured while getting message with messageID: "+ messageID + ": "+ err);
        }
    })
    //DELETE: Delete a thread with a given messageID


messageRoute.route('/messages/t/:threadID')
    // GET: getting all mesages belongs to a user with ThreadID
    .get(async(req,res)=>{
        const threadID = req.params.threadID
        console.log("in /message/t/:threadID getting all messages belongs to threadID: "+ threadID);
        try{
            const messages = await Message.find({"threadID": threadID})
            return res.status(200).json(messages);
        }catch(err){
            return res.status(500).send(`Unexpected error occured while getting messages associated with threadID:${threadID}: `+ err);
        }
    })
    // DELETE: delete all mesages belongs to a user with given ID

messageRoute
    .route('/messages/u/:userID/count')
    // GET: counting number of messages that belong to a given threadID
    .get(async (req, res) => {
        const userID = req.params.userID;
        console.log("in /message/t/:threadID (GET) number of messages messages from today that belongs to userID: "+ userID);
        try {
            const todayTimestamp = new Date().setHours(0, 0, 0, 0);  // Start of today
            const tomorrowTimestamp = todayTimestamp + (24 * 60 * 60 * 1000);  // Add 24 hours in milliseconds
            const messageCount = await Message.countDocuments({ 
                userID: userID,
                createdAt: {
                    $gte: todayTimestamp,
                    $lt: tomorrowTimestamp
                  }
             });
            return res.status(200).json({ count: messageCount });
        } catch (err) {
            return res.status(500).send("Unexpected error occurred when getting the count of messages: " + err.message);
        }
    });
export default messageRoute;