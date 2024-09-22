"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import config from "@/config";
import { useRouter } from "next/navigation";
import { getAllThreadsByUser, checkPaymentStatus, getUserByID } from "@/libs/request";
import { getAllThreadsByUserPaginated } from "@/libs/util";
import ChatSidebar from "./ChatSidebar";
import Conversation from "./ChatConversation";
import { useChat } from "@/hooks/useChat";
import { Inter } from "next/font/google";
import ChatRecommendation from "./ChatRecommendation";
import LoadingSpinner from "./LoadingSpinner";


const font = Inter({ subsets: ["latin"] });

const Chat = () => {
  const { data: session, status } = useSession();
  const [allThreads, setAllThreads] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paginatedThreads, setPaginatedThreads] = useState({ data: [], nextPage: null });

  const { streaming, conversation, handleOnChange, handleOnClick, handleOnFocus, message, currentResponse,
    threadID, setThreadID, retrieveAllMessagesByThreadID, setConversation, sentFirstMessage, setMessage, setSentFirstMessage, setStreaming } = useChat();

  const [loadingLatestMessages, setLoadingLatestMessages] = useState(false);
  const [loadingAllThreads, setLoadingAllThreads] = useState(true);

  const router = useRouter();
  const [userTier, setUserTier] = useState("");
  const effectRan = useRef(false); //using useRef to stop double invoke
  const [loadedUserInfo, setLoadedUserInfo] = useState(false);

  /*
  Read this:
  In development mode, React intentionally double-invokes certain lifecycle methods, 
  including the effect hook, to help identify potential issues with side effects. 
  Without this hook, page will be loaded twice
  */


  const getThreads = async (userId) => {
    if (userId) {
      try {
        const threads = await getAllThreadsByUser(userId);
        setAllThreads(threads);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const getThreadsPaginated = async (page, data) => {
    try {
      const threads = await getAllThreadsByUserPaginated(page, data);
      setPaginatedThreads(previousResponse => {
        if (previousResponse === null) {
          return threads;
        }
        return { data: [...previousResponse.data, ...threads.data], nextPage: threads.nextPage }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const filterConversationData = function (updatedData, data, id) {
    // data = data.filter((msg,idx) => msg.threadID == id);
    data?.forEach(message => {
      // Create user prompt object
      const userPrompt = {
        ...message, // Copy all original properties
        role: 'user',
        content: message.prompt // Set content to the prompt value
      };
      delete userPrompt.prompt; // Remove the original prompt field
      delete userPrompt.response; // Remove the original response field

      // Create bot response object
      const botResponse = {
        ...message, // Copy all original properties
        role: 'assistant',
        content: message.response // Set content to the response value
      };
      delete botResponse.prompt; // Remove the original prompt field
      delete botResponse.response; // Remove the original response field

      // Push both objects into the splitMessages array
      updatedData.push(userPrompt, botResponse);
    });
  }

  const stripePaymentStatus = async (checkoutSessionID) => {
    if (!checkoutSessionID) return false;
    try {
      let res = await checkPaymentStatus(checkoutSessionID);
      if (res.paymentProcessed === 'true') {
        sessionStorage.removeItem('checkoutSessionID');
        setLoadedUserInfo(false);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return stripePaymentStatus(checkoutSessionID);
      }
    } catch (err) {
      console.log(err);
      return false
    }
  }

  const getUserInfo = async (userId) => {
    if (!userId || userId.length === 0) return null;
    try {
      const user = await getUserByID(userId); 
      setLoadedUserInfo(true);
      return user;
    } catch (err) {
      console.error("Error getting user in chat:", err.message);
      return null;
    }
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push(config.auth.loginUrl);
    }
    if (session && session.user.userId) {
      setUserId(session.user.userId);
    }

  }, [session, status]);

  useEffect(() => {
    getThreads(userId);
    setLoadingAllThreads(false);
  }, [userId]);
  //Check user Subscription Tier
  useEffect(() => {
    const checkUserSubscription = async () => {
      if (!userId) return;
      const urlParams = new URLSearchParams(window.location.search);
      const fromStripe = urlParams.get('stripeRedirect');
      if (fromStripe) {
        const paymentProcessed = await stripePaymentStatus(sessionStorage.getItem("checkoutSessionID"));
        if (paymentProcessed) {
          window.history.replaceState({}, document.title, "/chat");
        }
      }
      const user = await getUserInfo(userId);
      if (user && user.profileData) {
        setUserTier(user.profileData.subscriptionTier);
      }
    };

    checkUserSubscription();
  }, []);

  if (loadedUserInfo || status === "loading") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return null; // This return statement prevents the rest of the component from rendering until the redirect occurs.
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openThreadByID = async function (id) {
    try {
      setThreadID(id);
      setLoadingLatestMessages(true);
      setConversation([]);
      setStreaming(false);
      const data = await retrieveAllMessagesByThreadID(id);
      // Update the conversation state with the retrieved data
      if (data && data.length > 0) {
        console.log(data);
        setSentFirstMessage(false);
        setConversation(() => {
          const updatedData = [];
          filterConversationData(updatedData, data, id);
          console.log(updatedData)
          return updatedData;
        });
      }
      setLoadingLatestMessages(false);
    } catch (err) {
      console.log(err);
      setLoadingLatestMessages(false);
    }
  }

  const chatStyle = `flex flex-col relative ${font.className}`;

  const handleUserInput = async () => {
    const newThread = await handleOnClick(userId);
    if (newThread) {
      setAllThreads((prevThreads) => {
        const remainingThreads = prevThreads.filter(
          (thread) => thread.threadID !== newThread.threadID
        );
        return [...remainingThreads, newThread];
      });
    }
  }

  return (
    <div className={chatStyle}>
      <ChatSidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}
        allThreads={allThreads} paginatedThreads={paginatedThreads}
        closeSidebar={closeSidebar}
        getThreadsPaginated={getThreadsPaginated}
        openThreadByID={openThreadByID}
        setThreadID={setThreadID}
        setConversation={setConversation}
        setSentFirstMessage={setSentFirstMessage}
        loadingAllThreads={loadingAllThreads}
        subscriptionTier={userTier}
      />
      <main className="flex-1 flex flex-col p-5 items-center lg:ml-64">
        {loadingLatestMessages ? (
          <div>
            <p>Loading latest messages...</p>
          </div>
        ) : (!threadID && !sentFirstMessage) ? (
          <ChatRecommendation setCurrentMessage={setMessage} />
        ) : (
          <Conversation
            user={session?.user}
            conversation={conversation}
            streaming={streaming}
            currentResponse={currentResponse}
          />
        )}

        <div className="flex flex-col items-center mt-5 w-full md:w-full lg:w-3/2 fixed bottom-0 bg-white">
          <div className="flex flex-row items-center w-3/4">
            <input
              type="text"
              value={message}
              onChange={handleOnChange}
              onFocus={handleOnFocus}
              placeholder="Enter your text here"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg mr-3 mt-2"
              onKeyUp={(event)=>{
                if(event.key === "Enter"){
                  document.querySelector("#submitMessageBtn").click();
                }
              }}
            />
            <button
              id="submitMessageBtn"
              disabled = {loadingLatestMessages}
              onClick={handleUserInput}
              className="bg-green-500 text-white py-2 px-2 rounded-lg"
            >
              Submit
            </button>

          </div>
          <footer className="mt-auto text-center text-gray-600 text-sm py-5">
            <span className="disclaimer-text">
              Birdie retrieved information from Library National of Medicine research papers, USDA Nutrition Guideline.
              <br />
              Please consult the healthcare providers for medical advice.
            </span>
          </footer>
        </div>
      </main>
    </div>


  );
};


export default Chat;