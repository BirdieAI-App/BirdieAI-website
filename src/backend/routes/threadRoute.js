import express from 'express';
import Thread from '../models/Thread.js';
import User from '../models/User.js';
import { validateRequest, checkRequiredKeys } from '../utils/requestValidation.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';

const threadRoute = express.Router();

threadRoute
  .route("/threads")
  //GET: getting all threads existing in database
  .get(asyncErrorHandler(async (req, res) => {
    console.log("in /threads route (GET) all threads in database.");
    let threads = await Thread.find();
    return res.status(200).json(threads);

  }))
  //PUT: saving a new thread into database
  .put(validateRequest(Thread.schema), asyncErrorHandler(async (req, res) => {
    console.log("in /threads route (PUT) saving a new thread into database.");
    const { userID, title } = req.body
    if (!checkRequiredKeys(userID, "userID") ||
      !checkRequiredKeys(title, "title")) {
      return;
    }

    //checking the existance of the user in database
    let existingUser = await User.findById(userID);
    if (!existingUser) {
      return res.status(400).json({ message: `The given UserID:${userID} does NOT exist in user table` });
    }

    const newThreadBody = {};
    for (const key in req.body) {
      newThreadBody[key] = req.body[key];
    }
    const thread = await new Thread(newThreadBody).save();
    return res.status(200).json(thread);
  }));

threadRoute
  .route("/threads/:threadID")
  //GET: getting a specific thread given threadID
  .get(asyncErrorHandler(async (req, res) => {
    const threadID = req.params.threadID;
    console.log("in /threads/:threadID (GET) specific thread with a given threadID: " + threadID);
    let thread = await Thread.findById(threadID);
    if (!thread) {
      return res.status(400).send("No thread with ID: " + threadID + "exists in database");
    }
    return res.status(200).json(thread);
  }))
  //POST: Update a thread with a threadID
  .post(validateRequest(Thread.schema), async (req, res) => {
    const threadID = req.params.threadID;
    const { userID, title } = req.body
    console.log("in /threads/:threadID (POST) update a thread with ID: " + threadID);
    if (userID) {
      return res.status(400).json({ message: "Updating userID that is tied to a thread is not allowed" });
    }
    const newThreadBody = {};
    for (const key in req.body) {
      newThreadBody[key] = req.body[key];
    }

    const updatedThread = await Thread.updateOne(
      { _id: threadID },
      { $set: newThreadBody }
    );
    if (updatedThread.modifiedCount === 0) {
      return res.status(200).send("No update has been made to thread with ID: " + threadID);
    }
    return res.status(200).send("Successfully update Thread with ID: " + threadID);

  });

threadRoute
  .route("/threads/u/:userID")
  //GET: getting all threads belongs to a user with givenID
  .get(asyncErrorHandler(async (req, res) => {
    const userID = req.params.userID;
    console.log("in /threads/u/:userID (GET) all threads belongs to userID: " + userID);
    const threads = await Thread.find({ userID: userID });
    return res.status(200).json(threads);
  }))
export default threadRoute;