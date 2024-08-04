const express = require("express");
const { default: OpenAIService } = require("../service/OpenAIService");
const Thread = require("../models/Thread.js");
const Message = require("../models/Message.js");
const { default: MessageService } = require("../service/MessageService");
const chatRoute = express.Router();

chatRoute.route("/chat").put(async (req, res) => {
  try {
    var { userID, prompt, threadID, role } = req.body;
    // if threadID is null which mean there no threadID yet
    // create thread -> save to threadTable
    // otherwise update
    var newThreadBody;
    newThreadBody = {
      userID: userID,
      threadID: threadID,
    };
    if (threadID == null || threadID == "") {
      const newThread = await OpenAIService.createThread();
      newThreadBody = {
        userID: userID,
        threadID: newThread.id,
        title: "Hard Code - Need to improve later",
        create_at: newThread.created_at,
        file_ID: "What is File ID ?",
        modified_thread: false,
        update_at: null,
      };
      const thread = new Thread(newThreadBody).save();
    }
    
    
    const completion = await OpenAIService.generateResponse(role, prompt, threadID);
    const createAt = completion.created;
    const messageID = completion.id;
    const response = completion.choices[0].message.content;
    const messageTotalToken = completion.usage.total_tokens;
    const messageBody = {
      threadID: newThreadBody.threadID,
      messageID: messageID,
      prompt: prompt,
      response: response,
      create_at: createAt,
      message_total_token: messageTotalToken,
    };
    const message = await new Message(messageBody).save();
    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .send(
        "Unexpected error occured happened when saving new message into database: " +
          error
      );
  }
});

//getAllMsgbyThreadIDOrderbyASCANDlimt5
chatRoute.route("/chat/:threadID").get(async (req,res)=>{
  console.log("Here")
  const threadID = req.params.threadID
  console.log("ThreadID : ", threadID)
  if(threadID){
    const messages = await MessageService.getMessageByThreadID(threadID);
    return res.status(200).json(messages)
  }else{
    return res.status(505).json("Thread ID have not been found !")
  }
})

// chatRoute.route("/chat/testAssistant").post(async (req,res)=>{
//   const {role, prompt} = req.body
//   console.log("Role : ",role  )
//   try {
//     const response = await OpenAIService.startChat(role,prompt)
//     res.status(200).json(response)
//   } catch (error) {
//     res.status(500).send("Failed in start chat using Assistant Open AI")
//   } 
// })
module.exports = chatRoute;
