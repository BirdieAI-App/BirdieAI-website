import React, { useState, useEffect } from "react";
import axios from "axios";
import OpenAI from "openai";

const OPENAI_API_KEY = "sk-proj-8Kraawye8AQDEMZSUbZmT3BlbkFJUJbHf4zcbN3imhQL31xJ";
// ASST_ID = asst_gqwuEwTDxy0u47BhXaQjfV3B
const OPENAI_PROMPT = "As Diet Coach, your interactions are collaborative, informative, deeply rooted in trustworthiness, transparent, and focused strictly on nutrition and diet. You start each session by introducing yourself as a dietitian here to assist with dietary concerns and goals within the realms of Prenatal Nutrition, Postpartum Nutrition, and Pediatric Nutrition. Your answer structure includes clarifying user queries, explaining the condition and symptoms using PubMed and Mayo Clinic website, providing dietary advice and nutrition requirements based on “Dietary Guidelines for Americans, 2020-2025” research, and offering practical recipes following Myplate website. When a user asks about a specific medical symptom, you will respond in the structure: \nremind users that the answer is only limited to pregnancy, postpartum, and pediatric diet topics. Advise consulting healthcare providers for medical assistance. \nProvide evidence that certain food ingredients can help reduce the symptom, including citations. \nProvide some recipes that include these food ingredients. \nFor all answers, mention how many sites you searched to get the answer and provide links to these sites. \n none"

export function useChat() {
    const [currentResponse, setCurrentResponse] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [sentFirstMessage, setSentFirstMessage] = useState(false);
    const [threadID, setThreadID] = useState("");
    const [allMessagesByThreadID, setAllMessagesByThreadID] = useState([]);
    // console.log(process.env.OPENAI_API_KEY);

    const [conversation, setConversation] = useState([
        {
            role: "system",
            content: OPENAI_PROMPT,
        },
    ]);
    const [message, setMessage] = useState("");

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const retrieveAllMessagesByThreadID = async function (id) {
        try {
            const response = await axios.get(`http://localhost:3000/call/messages/t/${id}`);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    const handleOnClick = async function (userID) {
        if (!sentFirstMessage) setSentFirstMessage(true);
        console.log(threadID);
        setMessage("");
        console.log(conversation);
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
            setCurrentResponse((prev) => prev + content);
        }

        setMessage("");
        let upatedThreadID = "";
        if (threadID.length == 0) {
            try {
                // create Thread
                const thread = await openai.beta.threads.create();
                upatedThreadID = thread.id;
                setThreadID(upatedThreadID);
                const newThreadBody = {
                    userID: userID,
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
        console.log(collectedData);

        if (collectedData.length > 0) {
            const messageBody = {
                threadID: upatedThreadID.length == 0 ? threadID : upatedThreadID,
                messageID: Date.now().toString(),
                create_at: Date.now(),
                prompt: message,
                response: collectedData,
                message_total_token: 1200,
            };
            try {
                // add functions to request.js to fix
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
        if (conversation.length > 1 && currentResponse.length > 0) {
            const newConversation = [
                ...conversation,
                {
                    role: "assistant",
                    content: currentResponse,
                },
            ];
            setConversation(newConversation);
        }
        setCurrentResponse("");
    }

    
    // console.log(threadID);
    // console.log(conversation);

    return {
        streaming, setConversation, conversation, handleOnChange, handleOnClick, handleOnFocus, message, setMessage, sentFirstMessage, setSentFirstMessage,
        currentResponse, setCurrentResponse, setThreadID, threadID, retrieveAllMessagesByThreadID
    };
}