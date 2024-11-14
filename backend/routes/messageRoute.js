const express = require('express');
const Message = require('../models/Message.js');
const Thread = require('../models/Thread.js');

const messageRoute = express.Router();
const validMessageProps = Object.keys(Message.schema.paths).filter((keys)=>!keys.startsWith("_"));

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
        if(!isValidRequest(req)){
            return res.status(400).send("Request body contains an invalid field")
        }
        if(!req.body.threadID){
            console.log("Request body must contains threadID to associate the message with")
            return res.status(400).send("Request body must contains threadID to associate the message with");
        }

        try{//checking for existing thread in database
            const thread = await Thread.find({threadID : req.body.threadID});
            if(!thread){
                console.log("Thread with ID="+req.body.threadID+" does NOT exist in database")
                return res.status(400).send("Thread with ID="+req.body.threadID+" does NOT exist in database");
            }
        }catch(err){
            return res.status(500).send("Unexpected error occured when validating threadID for (PUT) in /message: "+err);
        }

        if(!req.body.messageID){
            console.log("Request body must contains messageID returns from OpenAI")
            return res.status(400).send("Request body must contains messageID returns from OpenAI");
        }
        try {
            // checking to see if messageID already been set
            const existingMessage = await Message.find({"messageID": req.body.messageID})
            if(existingMessage.length != 0){
                console.log("The given messageID is already been set")
                return res.status(400).send("The given messageID is already been set");
            }
        } catch(err) {
            return res.status(500).send("Unexpected error occurred while validating messageID: "+ err);
        }

        if(!req.body.prompt){
            console.log("request body must contains user's prompt")
            return res.status(400).send("request body must contains user's prompt")
        }

        if(!req.body.message_total_token){
            return res.status(400).send("request body must contains total number of token returns from OpenAI")
        }

        const newMessageBody = {}
        for(const key in req.body){
            newMessageBody[key] = req.body[key]
        }
        try{
            // adding new message into message collection and update 'update_at' field in Thread collection
            const message = await new Message(newMessageBody).save();
            return res.status(200).json(message);
        }catch(err){
            return res.status(500).send("Unexpected err occured while saving new message into database: "+ err);
        }
    })
    
// messageRoute.route('/mesages/:messageID')
    //GET: getting a specific thread given messageID
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
    .route('/messages/t/:threadID/count')
    // GET: counting number of messages that belong to a given threadID
    .get(async (req, res) => {
        const threadID = req.params.threadID;
        try {
            const todayTimestamp = new Date().setHours(0, 0, 0, 0);  // Start of today
            const tomorrowTimestamp = todayTimestamp + (24 * 60 * 60 * 1000);  // Add 24 hours in milliseconds
            const messageCount = await Message.countDocuments({ 
                // threadID: threadID,
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

module.exports = messageRoute;