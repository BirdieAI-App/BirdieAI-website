import { json } from "body-parser";
import OpenAI from "openai";
import MessageService from "./MessageService";
const OPENAI_API_KEY="**";
const ASST_ID = "**";
const CONTENT = "**"

export default class OpenAIService {
  static openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  static async createThread() {
    console.log("createThread");
    try {
      const newThread = await this.openai.beta.threads.create();
      return newThread;
    } catch (error) {
      console.error("Error creating run:", error);
    }
  }

  static async runThread(threadID, assistantId) {
    try {
      const running = await this.openai.beta.threads.runs.create(threadID, {
        assistant_id: assistantId,
        additional_instructions: "none",
        tool_choice: "auto",
      });
      return running;
    } catch (error) {
      console.error("Error creating run:", error);
    }
  }
  static async createMessage(threadID, role, content) {
    const threadMessages = await this.openai.beta.threads.messages.create(
      threadID,
      {
        role: role,
        content: content,
      }
    );
    return threadMessages;
  }
  static async saveMessage(response, threadID) {
    try {
      let messageBody = null;

      for (const event of response.data.events) {
        console.log(`event : ${event}`);
        if (event.event_name === "thread.message.completed") {
          console.log(event.content);
          messageBody = event.content[0].text.value;
          break;
        }
      }

      if (messageBody) {
        console.log("Message body to save:", messageBody);
        // Save the message body to your database
        // const message = new Message({ threadID, messageBody });
        // await message.save();
        console.log("Message saved to database.");
      } else {
        console.log("No completed message found in response.");
      }
    } catch (error) {
      console.error("Error saving message:", error);
      throw error; // Re-throw the error to handle it in the calling method
    }
  }
  static async generateResponse(role, prompt, threadID) {
    try {
      // conversation will contain list of object{role - prompt}
      // We get this list by getAllMessagesByID => return messages
      // each message in messages equal to 2 object
      // with message.prompt => object{role = user,  prompt = message.prompt}
      // with message.response => object{role = assistant, prompt = message.response}

      /**
       *
       * Notice :
       * 1st element of conversations is object{role = system, prompt = instruction}
       */

      const conversation = [];

      conversation.push({
        role: "system",
        content: CONTENT,
      });

      var messages = await MessageService.getMessageByThreadID(threadID);

      if (messages.length > 0) {
        messages.forEach((message) => {
          conversation.push({
            role: "user",
            content : message.prompt
          }),
          conversation.push({
            role: "assistant",
            content : message.response
          })
        });
      }


      conversation.push({
        role: "user",
        content: prompt,
      });



      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: conversation,
      });

      conversation.push({
        role : "assistant",
        content : completion.choices[0].message.content
      })

      console.log(conversation);
      console.log("===============================");
      return completion;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
  static async achievingGeneratedMessage(
    thread_id,
    assistant_id,
    instructions,
    run_id
  ) {
    var run = this.openai.beta.threads.runs.create(
      (thread_id = thread_id),
      (assistant_id = assistant_id),
      (instructions = instructions)
    );
    while (run.status != "completed") {
      run = this.openai.beta.threads.runs.retrieve(
        (thread_id = thread_id),
        (run_id = run_id)
      );
    }

    var messages = this.openai.beta.threads.messages.list(
      (thread_id = thread_id)
    );
    return messages;
  }
  static async startChat(role, prompt) {
    try {
      const chat = await this.openai.beta.threads.create({
        role: role,
        content: prompt,
      });

      const run = await this.openai.beta.threads.runs.create(chat.id, {
        assistant_id: ASST_ID,
        additional_instructions: CONTENT,
        tool_choice: "auto",
      });
      print(`Run Created : ${run.id}`);

      while (run.status != "completed") {
        run = this.openai.beta.threads.runs.retrieve(
          (thread_id = chat.id),
          (run_id = run.id)
        );
        print(`Run Status : ${run.status}`);
      }
      print(`Run Status : Completed`);

      const message_response = await this.openai.beta.threads.messages.list(
        chat.id
      );
      const msgs = message_response.data;
      const lastest_message = msgs[0];
      print(`lastest_message : ${lastest_message}`);
      return lastest_message;
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * conversation = [
 * {
 * role : "system",
 * content : instruction
 * },
 * {
 *  role : "user",
 *  content : prompt
 * }
 * ]
 * 
 * based on conversation  => genearate response
 * save(response) -> Message table {
 *   prompt
 *   response
 *   create_at
 * }
 * 
 * 
 * 2nd question
 * 
 * messages = querry on Table Message based on ThreadID
 * 
 * 
 *  {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"}, 1st 
    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."}, ( saved DB)

    2nd :
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"}, 1st 
    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."}, ( saved DB)
    {"role": "user", "content": "Who won the world series in 2020?"}, 1st 

    
 */
