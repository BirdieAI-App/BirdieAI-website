import { useState } from "react";
import axios from "axios";
import OpenAI from "openai";
import { extractFirstFourWords } from "@/libs/util";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
// ASST_ID = asst_gqwuEwTDxy0u47BhXaQjfV3B
const OPENAI_PROMPT = process.env.NEXT_PUBLIC_OPENAI_API_PROMPT;

export function useChat() {
    const [currentResponse, setCurrentResponse] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [sentFirstMessage, setSentFirstMessage] = useState(false);
    const [threadID, setThreadID] = useState("");
    const [allMessagesByThreadID, setAllMessagesByThreadID] = useState([]);

    const [conversation, setConversation] = useState([
        {
            role: "system",
            content: OPENAI_PROMPT,
        },
    ]);
    const [message, setMessage] = useState("");
    const [freeThreadCount, setFreeThreadCount] = useState(0);

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

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
            alert("Free Tier Limit reached for Thread");
            return;
        }
        if(userTier === "Free" && messageCount >= 3){
            alert("Free Tier Limit reached for Message");
            return;
        }
        //END OF CHECKING, PROCESSING USER PROMPT BEGINS
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
        let updatedThreadID = threadID;
        let threadResponse = null;
        if (threadID.length === 0) {
            try {
                // Create Thread
                const thread = await openai.beta.threads.create();
                updatedThreadID = thread.id;
                setThreadID(updatedThreadID);

                const newThreadBody = {
                    userID: userID,
                    threadID: updatedThreadID,
                    status: userTier,//userTier by the time of thread creation
                    title: message ? extractFirstFourWords(message) : "",
                    create_at: thread.created_at,
                    file_ID: "Do not know what this is for",
                    modified_thread: false,
                    update_at: null,
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
        if (collectedData.length > 0 && updatedThreadID.length > 0) {
            const messageBody = {
                threadID: updatedThreadID,
                messageID: Date.now().toString(),
                create_at: Date.now(),
                prompt: message,
                response: collectedData,
                message_total_token: 1200,
            };

            try {
                const messageResponse = await axios.put(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/call/messages`,
                    messageBody
                );
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

    // console.log(OPENAI_PROMPT);

    return {
        // State management
        conversation,
        setConversation,
        message,
        setMessage,
        sentFirstMessage,
        setSentFirstMessage,
        currentResponse,
        setCurrentResponse,
        threadID,
        setThreadID,
        freeThreadCount,
        setFreeThreadCount,
        setStreaming,

        // Event handlers
        handleOnChange,
        handleOnClick,
        handleOnFocus,

        // Functions
        retrieveAllMessagesByThreadID,
        streaming
    };
}
