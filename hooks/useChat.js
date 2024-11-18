import React, { useState, useEffect } from "react";
import axios from "axios";
import { extractFirstFourWords } from "@/libs/util";
import { OpenAIService } from "@/libs/OpenAIService";

const OPENAI_PROMPT = process.env.NEXT_PUBLIC_OPENAI_API_PROMPT;

export function useChat() {
    const [currentMessageData, setCurrentMessageData] = useState({});
    const [sentFirstMessage, setSentFirstMessage] = useState(false);
    const [threadID, setThreadID] = useState("");
    const [allMessagesByThreadID, setAllMessagesByThreadID] = useState([]);
    const [userLimitReached, setUserLimitReached] = useState(false);

    const [conversation, setConversation] = useState([]);

    const [openAIConversation, setOpenAIConversation] = useState([
        {
            role: "system",
            content: OPENAI_PROMPT,
        },
    ]);
    const [message, setMessage] = useState("");
    const [freeThreadCount, setFreeThreadCount] = useState(0);

    const OpenAI = new OpenAIService();
    const retrieveAllMessagesByThreadID = async function (id) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/call/messages/t/${id}`);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    const handleOnClick = async function (userID) {
        //PERFORM CHECKS FIRST BEFORE ACTAULLY DO PROCESSING 
        if (message.length === 0 || message === "") return;
        let userTier = null;
        let threadCount = 0;
        let messageCount = 0;
        //grabbing user info for userTier
        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/call/users/${userID}`;
            const response = await axios.get(url);
            userTier = response.data.profileData.subscriptionTier;
        } catch (err) {
            console.log("error during in handleOnClick: " + err.message);
        }
        //checking whether or not if user has reached thread limit for free tier user
        if (userTier === "Free"  && (threadID.length === 0 || threadID === null)) {
            try {
                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/call/threads/u/${userID}/count/${userTier}`;
                const repsonse = await axios.get(url)
                threadCount = repsonse.data.count
            } catch (err) {
                console.log("error while counting number of threads in handleOnClick: " + err.message);
                return;
            }
        }
        //checking whether or not if free user has more than 3 messages in the current thread
        if(userTier === 'Free' && (threadID.length !== 0 || threadID !== null)){
            try {
                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/call/messages/t/${threadID}/count`;
                const repsonse = await axios.get(url)
                messageCount = repsonse.data.count
            } catch (err) {
                console.log("error while counting number of message in the current thread in handleOnClick: " + err.message);
                return;
            }
        }
        if (!sentFirstMessage) setSentFirstMessage(true);
        setMessage("");
        if (userTier === "Free" && threadCount >= 3 && (threadID.length === 0 || threadID === null)) {
            setUserLimitReached(true)
            return;
        }
        if(userTier === "Free" && messageCount >= 3){
            setUserLimitReached(true)
            return;
        }
        //END OF CHECKING, PROCESSING USER PROMPT BEGINS
        const filterConversationData = function (data) {
            // data = data.filter((msg,idx) => msg.threadID == id);
            const updatedData = [];
            data?.forEach(message => {
              // Create user prompt object
              const userPrompt = {
                role: 'user',
                content: message.prompt // Set content to the prompt value
              };
        
              // Create bot response object
              const botResponse = {
                role: 'assistant',
                content: message.response // Set content to the response value
              };
        
              // Push both objects into the splitMessages array
              updatedData.push(userPrompt, botResponse);
            });
            return updatedData;
          }
        const cur = filterConversationData(conversation);
        const openAIConversationss = [
            {
                role: "system",
                content: OPENAI_PROMPT,
            },
            ...cur,
            {
                role: "user",
                content: message,
            },
        ];

        setOpenAIConversation(openAIConversationss);
        // setConversation(openAIConversation);
        const OpenAIResponse = await OpenAI.getResponse(openAIConversation);
        const OpenAIMessage = OpenAIResponse.choices[0]?.message?.content || "";

        setMessage("");
        let updatedThreadID = threadID;
        let threadResponse = null;
        if (threadID.length === 0) {
            try {
                // Create Thread
                const thread = await OpenAI.createThread();
                updatedThreadID = thread.id;
                console.log(updatedThreadID);
                setThreadID(updatedThreadID);

                const newThreadBody = {
                    userID: userID,
                    threadID: updatedThreadID,
                    status: userTier,//userTier by the time of thread creation
                    title: message ? extractFirstFourWords(message) : "",
                    file_ID: "Do not know what this is for",
                    modified_thread: false,
                };

                // Save Thread
                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/call/threads`;
                threadResponse = await axios.put(url, newThreadBody);
                console.log("Thread saved successfully!");
                if(userTier === 'Free') setFreeThreadCount(freeThreadCount + 1);

            } catch (error) {
                console.log(`Error when trying to save Thread: ${error}`);
                return null;
            }
        }
        // Save Message
        if (OpenAIMessage.length > 0 && updatedThreadID.length > 0) {
            const messageBody = {
                threadID: updatedThreadID,
                messageID: Date.now().toString(),
                prompt: message,
                response: OpenAIMessage,
                message_total_token: OpenAIResponse.usage?.total_tokens || 0,
            };

            try {
                const messageResponse = await axios.put(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/call/messages`,
                    messageBody
                );
                console.log(messageResponse);
                setCurrentMessageData(messageResponse.data);
            } catch (error) {
                console.log(`Error when trying to save Message: ${error}`);
            }
        }
        setSentFirstMessage(false);
        return threadResponse ? threadResponse.data : null;
    };


    function handleOnChange(event) {
        setMessage(event.target.value);
    }

    function handleOnFocus() {
        console.log('FOCUS');
        console.log(conversation);
        if (Object.keys(currentMessageData).length > 0) {
            conversation.push(currentMessageData);
            setConversation(conversation);
            console.log("IN focus", conversation);
        }
        setCurrentMessageData({});
    }

    return {
        // State management
        conversation,
        setConversation,
        message,
        setMessage,
        sentFirstMessage,
        setSentFirstMessage,
        threadID,
        setThreadID,
        freeThreadCount,
        setFreeThreadCount,
        userLimitReached,
        setUserLimitReached,

        setCurrentMessageData,
        currentMessageData,

        // Event handlers
        handleOnChange,
        handleOnClick,
        handleOnFocus,

        // Functions
        retrieveAllMessagesByThreadID,
    };
}
