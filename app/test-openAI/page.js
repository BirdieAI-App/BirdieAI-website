"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import axios from "axios";
import OpenAI from "openai";

const TestOpenAI = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push(config.auth.loginUrl);
    }
    if (session && session.user.userId) setUserId(session.user.userId);
  }, [session, status]);

  async function getMyAssistant() {
    const url = `http://localhost:3000/call/threads/asst/getall`;
    try {
      const response = await axios.get(url);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function createThread(params) {
    var url = "http://localhost:3000/call/openai/thread";

    try {
      const response = await axios.post(url);
      const newThreadData = {
        userID: userId, // Replace with actual userID
        threadID: response.data.id, // Replace with actual threadID from OpenAI
        title: "Title - Hardcode", // Replace with actual title
        create_at: response.data.created_at,
      };
      setThread(response.data.id);
      // url for backend
      url = "http://localhost:3000/call/threads";
      try {
        const response = await axios.put(url, newThreadData);
        console.log("Thread saved successfully:", response.data);
        setThread("successfully");
      } catch (error) {
        console.error("Error saving thread:", error);
        setThread("Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setThread("Error");
    }
  }

  async function runThread(params) {
    const threadID = "thread_aOXJvIpLnIDAKkNkFoxTSNlJ";
    const url = `http://localhost:3000/call/openai/thread?threadID=${threadID}`;
    console.log("Running Thread : Start");
    try {
      const response = await axios.get(url);
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function addMsg(params) {
    const apiKey = process.env.OPENAI_API_KEY;
    const threadID = "thread_ydrAUIHGqzyCsDsHhpJIHMud";
    const url = `https://api.openai.com/v1/threads/${threadID}/messages`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "assistants=v1",
    };
    const body = {
      role: "user",
      metadata: {
        modified: "true",
        user: "6674995c959c5e30c737d6a3",
      },
      content: " Testing Message 2",
    };

    try {
      const response = await axios.post(url, body, { headers });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const [thread, setThread] = useState("None");
  const [msg, setMsg] = useState("None");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <button onClick={createThread}>Create Thread</button>
      <p>{thread}</p>
      <button onClick={addMsg}>Add Msg</button>
      <p>{msg}</p>
      <button onClick={runThread}>Run thread</button>
      <p></p>
      <button onClick={getMyAssistant}>Get assistant</button>
    </div>
  );
};

export default TestOpenAI;
