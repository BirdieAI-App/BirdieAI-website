import { MongoClient } from "mongodb";

export default class MessageService {
  static async getMessageByThreadID(threadID) {
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("test");
      const collection = database.collection("messages");
      const messages = await collection
        .find({ threadID: threadID })
        .sort({ create_at: 1 })
        .toArray();
      return messages;
    } catch (error) {
      console.log(`Failed in retrieving messages by threadID : ${error}`)
    } finally {
      await client.close();
    }
  }

  static async getLastestResponse(threadID) {
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("test");
      const collection = database.collection("messages");
      const message = await collection
        .find({ threadID: threadID })
        .sort({ create_at: -1 })
        .limit(1)
        .toArray();
        console.log(`message[0] : ${message[0].response}`)
      return message[0].response;
    } catch (error) {
      console.log(`Failed in retrieving single by threadID : ${error}`)
    } finally {
      await client.close();
    }
  }

}
