"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import axios from "axios";
import OpenAI from "openai";

// Message Input Component
const MessageInput = ({ message, onChange, onFocus, onClick }) => (
  <div>
    <input
      type="text"
      value={message}
      onChange={onChange}
      onFocus={onFocus}
      style={{ border: "1px solid black" }}
    />
    <button onClick={onClick}>Send</button>
  </div>
);

// Conversation History Component
const ConversationHistory = ({ conversation }) => (
  <div>
    {conversation.map((item, index) => {
      if (index > 0) {
        return (
          <div key={index}>
            <p>Role: {item.role}</p>
            <p>Content: {item.content}</p>
          </div>
        );
      }
    })}
  </div>
);

const StreamingResponse = ({ streaming, data }) => (
  <div>
    {streaming ? (
      <div>
        <p>Role: assistant</p>
        <p>Content: {data}</p>
      </div>
    ) : (
      <p></p>
    )}
  </div>
);

const StreamingComponent = () => {
  const [data, setData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "system",
      content: process.env.CONTENT,
    },
  ]);
  const [message, setMessage] = useState("");
  const [threadID, setThreadID] = useState("");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function handleOnClick() {
    const newConversation = [
      ...conversation,
      {
        role: "user",
        content: message,
      },
    ];
    setConversation(newConversation);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: newConversation,
      stream: true,
    });

    let collectedData = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content.length > 0) {
        setStreaming(true);
      }
      collectedData += content;
      setData((prev) => prev + content);
    }
    setMessage("");

    // Create and Save Thread Procedure
    let upatedThreadID = "";
    if (threadID.length == 0) {
      try {
        // create Thread
        const thread = await openai.beta.threads.create();
        upatedThreadID = thread.id;
        setThreadID(upatedThreadID);
        const newThreadBody = {
          userID: "66be7b9d7632b406a884658b",
          threadID: upatedThreadID,
          title: "Summary Task Later",
          create_at: thread.created_at,
          file_ID: "Do not know what this is for",
          modified_thread: false,
          update_at: null,
        };
        // Save Thread
        const url = "http://localhost:3000/call/threads";
        const response = await axios.put(url, newThreadBody);
        console.log(response.data);
        console.log("Save Thread successfully !");
      } catch (error) {
        console.log(`Error when trying to save Thread.`);
      }
    }

    // Save Message
    // If doing like this, User can create new Message when previous message have not been 
    if (collectedData.length > 0) {
      const messageBody = {
        threadID: upatedThreadID.length == 0 ? threadID : upatedThreadID ,
        messageID: Date.now().toString(),
        create_at: Date.now(),
        prompt: message,
        response: collectedData,
        message_total_token: 1200,
      };
      try {
        const response = await axios.put(
          "http://localhost:3000/call/messages",
          messageBody
        );
        console.log(response);
      } catch (error) {
        console.log(`Error when trying to Save Message.`);
      }
    }
  }

  function handleOnChange(event) {
    setMessage(event.target.value);
  }

  function handleOnFocus() {
    setStreaming(false);
    if (conversation.length > 1 && data.length > 0) {
      const newConversation = [
        ...conversation,
        {
          role: "assistant",
          content: data,
        },
      ];
      setConversation(newConversation);
    }
    setData("");
  }

  return (
    <div>
      <div>ThreadID : {threadID}</div>
      <MessageInput
        message={message}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onClick={handleOnClick}
      />
      <ConversationHistory conversation={conversation} />
      <StreamingResponse streaming={streaming} data={data} />
    </div>
  );
};

export default StreamingComponent;
