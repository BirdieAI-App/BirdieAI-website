import express from 'express';
import Thread from '../models/Thread.js';
import User from '../models/User.js';

const threadRoute = express.Router();
const validThreadProps = Object.keys(Thread.schema.paths).filter(
  (keys) => !keys.startsWith("_")
);

const isValidRequest = (req) => {
  // true if request is good formated
  // false if request contains keys that does not belongs to database
  for (const keys in req.body) {
    if (!validThreadProps.includes(keys)) {
      console.log(`${keys} is not a valid props in Thread collection`);
      return false;
    }
  }
  return true;
};

threadRoute
  .route("/threads")
  //GET: getting all threads existing in database
  .get(async (req, res) => {
    console.log("in /threads route (GET) all threads in database.");
    try {
      let threads = await Thread.find();
      return res.status(200).json(threads);
    } catch (err) {
      return res.status(500).send("Unexpected error occured when getting the threads in database: " + err);
    }
  })
  //DELETE: deleting all theads existing in database
  .delete(async (req, res) => {
    console.log("in /threads route (DELETE) all threads in database.");
    try {
      let response = await Thread.deleteMany();
      if (response.deletedCount == 0) {
        return res.status(200).send("No threads was deleted in Thread database");
      }
      return res.status(200).send("Successfully deleted all Threads in database");
    } catch (err) {
      return res.status(500).send(  "Unexpected error occured when deleting all threads in database: " +    err);
    }
  })
  //PUT: saving a new thread into database
  .put(async (req, res) => {
    console.log("in /threads route (PUT) saving a new thread into database.");
    //validating user request
    if (!isValidRequest(req)) {
      return res.status(400).send("Request body contains an invalid field!!");
    }
    if (!req.body.userID) {
      return res.status(400).send("Request body must contains a userID to associate the thread with");
    }
    try {
      //checking the existance of the user in database
      let existingUser = await User.findById(req.body.userID);
      if (!existingUser) {
        return res.status(400).send("The given UserID does NOT exist in user table");
      }
    } catch (err) {
      return res.status(500).send("Unexpected error when validating userID for saving new thread: " + err);
    }
    if (!req.body.threadID) {
      return res.status(400).send("Request body must contains a threadID returned from OpenAI");
    }
    try {
      //checking for already set threadID in thread collection
      let existingThreadID = await Thread.find({ threadID: req.body.threadID });
      if (existingThreadID.length != 0) {
        return res.status(400).send("The given threadID already associated to user with ID: " + existingThreadID[0].userID.toHexString());
      }
    } catch (err) {
      return res.status(500).send(  "Unexpected error when validating threadID for saving new thread: " + err);
    }
    if (!req.body.title) {
      return res.status(400).send("New thread created must contain a title");
    }
    const newThreadBody = {};
    for (const key in req.body) {
      newThreadBody[key] = req.body[key];
    }
    try {
      const thread = await new Thread(newThreadBody).save();
      return res.status(200).json(thread);
    } catch (err) {
      return res.status(500).send("Unexpected error occured happened when saving new thread into database: " + err);
    }
  });

threadRoute
  .route("/threads/:threadID")
  //GET: getting a specific thread given threadID
  .get(async (req, res) => {
    const threadID = req.params.threadID;
    console.log( "in /threads/:threadID (GET) specific thread with a given threadID: " + threadID);
    try {
      let thread = await Thread.findById(threadID);
      if (!thread) {
        return res.status(400).send("No thread with ID: " + threadID + "exists in database");
      }
      return res.status(200).json(thread);
    } catch (err) {
      return res.status(500).send( "Unexpected error occurrec when getting thread in Database: " + err);
    }
  })
  //DELETE: Delete a thread with a given threadID
  .delete(async (req, res) => {
    const threadID = req.params.threadID;
    console.log("in /threads/:threadID (DELETE) thread with ID: " + threadID);
    try {
      const deletedThread = await Thread.findOneAndDelete({ _id: threadID });
      if (!deletedThread) {
        return res.status(200).send("No thread with ID" + threadID + " existed in Database to be deleted");
      }
      return res.status(200).send("successfully deleted thread with id: " + threadID);
    } catch (err) {
      return res.status(500).send("Unexpected error occured while deleted thread: " + err);
    }
  })
  //POST: Update a thread with a threadID
  .post(async (req, res) => {
    const threadID = req.params.threadID;
    console.log("in /threads/:threadID (POST) update a thread with ID: " + threadID);
    if (!isValidRequest(req)) {
      return res.status(400).send("Request body contains an invalid field!!");
    }
    if (req.body.threadID || req.body.userID) {
      return res.status(400).send("Request body contains either threadID or userID which is prohibited for updating");
    }
    const newThreadBody = {};
    for (const key in req.body) {
      newThreadBody[key] = req.body[key];
    }
    try {
      const updatedThread = await Thread.updateOne(
        { _id: threadID },
        { $set: newThreadBody }
      );
      if (updatedThread.modifiedCount === 0) {
        return res.status(200).send("No update has been made to thread with ID: " + threadID);
      }
      return res.status(200).send("Successfully update Thread with ID: " + threadID);
    } catch (err) {
      return res.status(500).send("Unexpected error occured when updating the thread: " + err);
    }
  });

threadRoute
  .route("/threads/u/:userID")
  //GET: getting all threads belongs to a user with givenID
  .get(async (req, res) => {
    const userID = req.params.userID;
    console.log("in /threads/u/:userID (GET) all threads belongs to userID: " + userID);
    try {
      const threads = await Thread.find({ userID: userID });
      return res.status(200).json(threads);
    } catch (err) {
      return res.status(500).send("Unexpected error occurred when getting all threads of a user: " + err);
    }
  })
  //DELETE: delete all threads belongs to a user with given ID
  .delete(async (req, res) => {
    const userID = req.params.userID;
    console.log("in /threads/u/:userID (DELETE) all threads belongs to userID: " + userID);
    try {
      const deletedThread = await Thread.deleteMany({ userID: userID });
      if (deletedThread.deletedCount === 0) {
        return res.status(500).send("No thread(s) was associated with userID: " + userID);
      }
      return res.status(200).send("Successfully deleted all threads associated with userID: " + userID);
    } catch (err) {
      return res.status(500).send("Unexpected error occurred when deleting all threads of a user: " + err);
    }
  });
  
export default threadRoute;