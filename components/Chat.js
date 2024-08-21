"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import config from "@/config";
import { useRouter } from "next/navigation";
import { getAllThreadsByUser } from "@/libs/request";
import { getAllThreadsByUserPaginated } from "@/libs/util";
import ChatSidebar from "./ChatSidebar";
import Conversation from "./ChatConversation";
import { useChat } from "@/hooks/useChat";
import { Inter } from "next/font/google";

const font = Inter({ subsets: ["latin"] });

const Chat = () => {
  const { data: session, status } = useSession();
  const [allThreads, setAllThreads] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [sentFirstMessage, setSentFirstMessage] = useState(false);
  const [paginatedThreads, setPaginatedThreads] = useState({ data: [], nextPage: null });
  // const [conversation, setConversation] = useState(['Conversation 0', 'Conversation 1', 'Conversation 2', 'Conversation 3', 'Conversation 4', 'Conversation 5']);
  
  const { streaming, conversation, handleOnChange, handleOnClick, handleOnFocus, message, currentResponse, 
    threadID, setThreadID, retrieveAllMessagesByThreadID, setConversation } = useChat();

  const router = useRouter();
  
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
      // console.log(threads);
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

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push(config.auth.loginUrl);
      // console.log('a');
    }
    if (session && session.user.userId) {
      // console.log(session);
      setUserId(session.user.userId);
    }

  }, [session, status]);

  useEffect(() => {
    getThreads(userId);
  }, [userId]);

  useEffect(() => {
    allThreads && getThreadsPaginated(0, allThreads);
  }, [allThreads])

  if (status === "loading") {
    return <p>Loading...</p>;
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
        const data = await retrieveAllMessagesByThreadID(id);
        // Update the conversation state with the retrieved data
        if (data && data.length > 0) {
            console.log(data);
            setConversation(data);
        }
    } catch (err) {
        console.log(err);
    }
    
}

  // console.log(paginatedThreads);
  // console.log(userId);
  const chatStyle = `flex flex-col relative ${font.className}`;
  console.log(threadID);
  console.log(conversation);

  return (
    <div className={chatStyle}>
      <ChatSidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}
        allThreads={allThreads} paginatedThreads={paginatedThreads}
        closeSidebar={closeSidebar}
        getThreadsPaginated={getThreadsPaginated}
        openThreadByID = {openThreadByID}
      />
      <main className="flex-1 flex flex-col p-5 items-center lg:ml-64">
        {/* {(!sentFirstMessage) ?
          <ChatRecommendation setCurrentMessage={setMessage}/> :
          <Conversation user={session?.user} conversation={conversation} streaming={streaming} 
          currentResponse = {currentResponse} />
        } */}
        {/* {(!threadID || !sentFirstMessage) ? <ChatRecommendation setCurrentMessage={setMessage}/> : <Conversation user={session?.user} conversation={conversation} streaming={streaming} 
          currentResponse = {currentResponse} />}  */}
        <Conversation user={session?.user} streaming={streaming} 
          currentResponse = {currentResponse} conversation={conversation}/>
        <div className="flex flex-col items-center mt-5 w-full md:w-full lg:w-3/2 fixed bottom-0 bg-white">
          <div className="flex flex-row items-center w-3/4">
            <input
              type="text"
              value={message}
              onChange={handleOnChange}
              onFocus={handleOnFocus}
              placeholder="Enter your text here"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg mr-3 mt-2"
            />
            <button onClick={handleOnClick} className="bg-green-500 text-white py-2 px-2 rounded-lg">Submit</button>
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