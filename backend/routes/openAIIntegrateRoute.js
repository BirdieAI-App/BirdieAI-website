const express = require("express");
import Thread from "../models/Thread";
import OpenAIService from "../service/OpenAIService";
const openAiIntegrateRoute = express.Router();
/** */
openAiIntegrateRoute
  // Create Thread
  .route("/openai/thread")
  .post(async (req, res) => {
    try {
      var newThread = await OpenAIService.createThread();
      const {userID} = req.body;
      const newThreadBody = {
        userID: userID,
        threadID: newThread.id,
        title: "Hard Code - Need to improve later",
        create_at: newThread.created_at,
        file_ID: "What is File ID ?",
        modified_thread: false,
        update_at: null,
      };
      const thread = await new Thread(newThreadBody).save();
      return res.status(200).json(thread);
    } catch (error) {
      res
        .status(500)
        .send(
          "Unexpected error when validating threadID for saving new thread: " +
            error
        );
    }
  })
  // Run Thread
  .get(async (req, res) => {
    try {
      console.log("Thread : Running");
      const threadID = req.query.threadID;
      const assistantId = process.env.ASST_ID;
      const runResponse = await OpenAIService.runThread(threadID, assistantId);
      console.log(runResponse);
      //   await OpenAIService.saveMessage(runResponse,threadID)
      res.json(runResponse);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating thread" });
    }
  });

openAiIntegrateRoute.route("/openai/message").post(async (req, res) => {
  const { threadID, role, content } = req.body;
  try {
    // Create Message
    var response = await OpenAIService.createMessage(threadID, role, content);
    const message = response.content[0].text.value;
    console.log(`message : ${message}`);
    var responseGenerateMsg = await OpenAIService.generateResponse(
      role,
      message
    );
    res.json(responseGenerateMsg);
  } catch (error) {
    console.log("Creating Message Failed !");
    console.log(error);
  }
});

openAiIntegrateRoute.route("/openai/testing").post(async (req, res) => {
  const { threadID, instructions, run_id } = req.body;
  const assistant_id = process.env.ASST_ID;
  try {
    var response = await OpenAIService.achievingGeneratedMessage(
      threadID,
      assistant_id,
      instructions,
      run_id
    );
    res.json(response);
  } catch (error) {
    console.log("error at testing - achievingGeneratedMessage : ", error);
  }
});

module.exports = openAiIntegrateRoute;
