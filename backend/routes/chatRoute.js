const express = require("express");
const { default: OpenAIService } = require("../service/OpenAIService");
const Thread = require("../models/Thread.js");
const Message = require("../models/Message.js");
import OpenAI from "openai";
const { default: MessageService } = require("../service/MessageService");
const chatRoute = express.Router();

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
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

    const conversation = [];

    conversation.push({
      role: "system",
      content: process.env.CONTENT,
    });

    var messages = await MessageService.getMessageByThreadID(threadID);

    if (messages.length > 0) {
      messages.forEach((message) => {
        conversation.push({
          role: "user",
          content: message.prompt,
        }),
          conversation.push({
            role: "assistant",
            content: message.response,
          });
      });
    }

    conversation.push({
      role: "user",
      content: prompt,
    });

    try {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversation,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        console.log(`Chunk received: ${content}`); // Log the received chunk
        res.write(content); // Send chunk to client
      }

      res.end("Success");
    } catch (error) {
      console.error("Streaming failed:", error);
      res.status(500).send(`Failed: ${error.message}`);
    }

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
chatRoute.route("/chat/:threadID").get(async (req, res) => {
  console.log("Here");
  const threadID = req.params.threadID;
  console.log("ThreadID : ", threadID);
  if (threadID) {
    const messages = await MessageService.getMessageByThreadID(threadID);
    return res.status(200).json(messages);
  } else {
    return res.status(505).json("Thread ID have not been found !");
  }
});

chatRoute.route("/streaming").post(async (req, res) => {
  try {
    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { threadID, prompt } = req.body;
    console.log(threadID);
    console.log(`prompt : ${prompt}`);

    const conversation = [];
    conversation.push({
      role: "system",
      content: process.env.CONTENT,
    });

    var messages = await MessageService.getMessageByThreadID(threadID);

    if (messages.length > 0) {
      messages.forEach((message) => {
        conversation.push({
          role: "user",
          content: message.prompt,
        }),
          conversation.push({
            role: "assistant",
            content: message.response,
          });
      });
    }

    conversation.push({
      role: "user",
      content: "What should I drink during my pregnancy time ?",
    });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
      stream: true,
    });

    var content = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      console.log(`Chunk received: ${content}`); // Log the received chunk
      res.write(`data: ${content}\n\n`); // Send chunk to client
      res.flush(); // Ensure the chunk is sent immediately
    }
    res.end();
  } catch (error) {
    console.error("Streaming failed:", error);
    res.status(500).send(`Failed: ${error.message}`);
  }




/**
 * FE : conversation = []
 * 1st : conversation[{user,prompt}] -> save 
 * Backend return conversation[{asisstant,response}] -> save
 *
 * --> Have threadID
 * conversation[]
 */

});

module.exports = chatRoute;
