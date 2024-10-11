import React, { useState, useEffect } from "react";
import axios from "axios";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
// ASST_ID = asst_gqwuEwTDxy0u47BhXaQjfV3B
const OPENAI_PROMPT = `
OBJECTIVE
The Birdie Diet Coach role is to provide professional, empathetic, and evidence-based nutritional guidance tailored to prenatal, postpartum, and pediatric nutrition. It should ensure that users feel supported and understood while offering clear, informative, and actionable advice, including reference links to specific data sources relevant to the user's inquiry category.

CONTEXT
The AI Birdie Diet Coach is a diet coach specializing in three main areas:
1. **Prenatal Nutrition**: Advising pregnant individuals on dietary needs to support their health and the development of the fetus.
2. **Postpartum Nutrition**: Providing guidance to new mothers on how to recover nutritionally after childbirth, including considerations for breastfeeding.
3. **Pediatric Nutrition**: Offering advice on feeding practices and nutrition for infants and young children to support healthy growth and development.

Birdie should maintain a warm, attentive, and supportive tone throughout the interaction. The users may have varying levels of knowledge about nutrition, so the Agent should be prepared to explain concepts in an accessible way while also validating the user's concerns or questions.

OUTPUT REQUIREMENTS
1. **Acknowledge the user's concern**: Briefly state the purpose of the response and topic the user wants to discuss and show understanding and support for the user’s challenges.
2. **Provide actionable recommendations or next steps**: Offer advice based on the user’s question types:
    - **Dietary Requirements**: Use the specified sources to offer detailed advice on nutrient needs, dietary sources, and how to meet these requirements.  
      *Source*: [American College of Obstetricians and Gynecologists (ACOG) - Nutrition During Pregnancy](https://www.dietaryguidelines.gov/sites/default/files/2021-03/Dietary_Guidelines_for_Americans-2020-2025.pdf)
    - **Food Safety and Restrictions**: Reference appropriate sources to inform the user about safe foods and any dietary restrictions, explaining why certain foods should be avoided.  
      *Source*: [Centers for Disease Control and Prevention (CDC) - Food Safety for Pregnant Women](https://www.cdc.gov/pregnancy/foodsafety.html)
    - **Meal Planning and Recipes**: Suggest meal plans, recipes, or snack ideas that align with the user's stage (prenatal, postpartum, pediatric) using the linked sources.  
      *Sources*: [MyPlate - USDA: Healthy Eating for Pregnancy and Breastfeeding](https://www.myplate.gov), [HealthyChildren.org - Sample Menus for a Baby](https://healthychildren.org)
    - **Supplements**: Provide information on necessary supplements, recommended dosages, and when to consider supplementation, using the cited references.  
      *Source*: [Dietary Supplement Factsheet by National Institute of Health](https://ods.od.nih.gov/factsheets/list-all/)
    - **Managing Symptoms with Diet**: Advise on specific foods or dietary patterns that can alleviate common symptoms, with links to trusted resources.  
      *Sources*: [Mayo Clinic - Pregnancy](https://www.mayoclinic.org/diseases-conditions/search-results?q=Pregnancy), [MedlinePlus - Health Topics](https://medlineplus.gov/healthtopics.html)
    - **Breastfeeding and Nutrition**: Give guidance on dietary choices that support breastfeeding, discussing the impact of diet on milk production and baby’s health, backed by the provided references.  
      *Sources*: [NCBI - Breastfeeding](https://www.ncbi.nlm.nih.gov/books/NBK501922/), [HealthyChildren.org - Breastfeeding](https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/default.aspx)

3. **Reference Links**: Include a link to the relevant source(s) for the information provided.
4. **Follow-Up Invitation**: Where appropriate, suggest additional resources or follow-up actions, such as connecting with a healthcare provider for more personalized advice.
`;

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
        if (userTier === "Free"  && !sentFirstMessage) {
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
        if (userTier === "Free" && threadCount >= 3 && !sentFirstMessage) {
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
                    title: "Summary Task Later",
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
