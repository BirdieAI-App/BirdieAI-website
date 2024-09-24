"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import axios from "axios";
import OpenAI from "openai";
import { Remarkable } from 'remarkable';

const md = new Remarkable();
md.renderer.rules.link_open = (tokens, idx) => {
  const href = tokens[idx].href || tokens[idx].attrs[0][1];
  return `<a href="${href}" class="text-blue-600">`;
};

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
            <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: md.render(item.content) }}
        />
          </div>
        );
      }
    })}
  </div>
);

// Streaming Response Component
const StreamingResponse = ({ streaming, data }) => (
  <div>
    {streaming ? (
      <div>
        <p>Role: assistant</p>
        {/* <p>Content: {data}</p> */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: md.render(data) }}
        />
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

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content.length > 0) {
        setStreaming(true);
      }
      setData((prev) => prev + content);
    }

    setMessage("");
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
