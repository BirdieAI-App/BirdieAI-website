import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import axios from "axios";
import OpenAI from "openai";

const OPENAI_API_KEY = "**";
const CONTENT = "**"

export function useChat() {
    const [currentResponse, setCurrentResponse] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [sentFirstMessage, setSentFirstMessage] = useState(false);

    const [conversation, setConversation] = useState([
        {
            role: "system",
            content: CONTENT,
        },
    ]);
    const [message, setMessage] = useState("");

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    async function handleOnClick() {
        if (!sentFirstMessage) setSentFirstMessage(true);
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
            setCurrentResponse((prev) => prev + content);
        }

        setMessage("");
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

    return { streaming, setConversation, conversation, handleOnChange, handleOnClick, handleOnFocus, message, setMessage, sentFirstMessage, setSentFirstMessage,
    currentResponse, setCurrentResponse};
}