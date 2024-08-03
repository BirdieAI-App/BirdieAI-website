"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import config from "@/config";
import { useRouter } from "next/navigation";
import ButtonAccount from "./ButtonAccount";
import { getAllThreadsByUser } from "@/libs/request";
import { getAllThreadsByUserPaginated } from "@/libs/util";
import ChatRecommendation from "./ChatRecommendation";
import ChatSidebar from "./ChatSidebar";
import ChatBubble from "./ChatBubble";
import Conversation from "./ChatConversation";

const Chat = () => {
  const { data: session, status } = useSession();
  const [allThreads, setAllThreads] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sentFirstMessage, setSentFirstMessage] = useState(true);
  const [paginatedThreads, setPaginatedThreads] = useState({ data: [], nextPage: null });
  const [conversation,setConversation] = useState(['Conversation 0', 'Conversation 1', 'Conversation 2', 'Conversation 3', 'Conversation 4']);

  const router = useRouter();
  // const suggestions = [
  //   "Diet guideline for pregnancy",
  //   "Diet guideline for postpartum and breast feeding",
  //   "Diet guidelines for infants",
  // ];

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
      console.log(threads);
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

  const [userInput, setUserInput] = useState('');

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the user input here, e.g., send it to an API or use it in your application
    console.log('User input submitted:', userInput);
    setUserInput('');
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push(config.auth.loginUrl);
      // console.log('a');
    }
    if (session && session.user.userId) {
      console.log(session);
      setUserId(session.user.userId);
    }

  }, [session, status]);

  useEffect(() => {
    getThreads(userId);
  }, [userId]);

  useEffect(() => {
    allThreads && getThreadsPaginated(0, allThreads);
  }, [allThreads])

  // console.log(allThreads);
  // console.log(paginatedThreads);
  // console.log(userId);
  // console.log(session);

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

  // console.log(paginatedThreads);

  return (
    <div className="flex flex-col font-sans relative">
      <ChatSidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}
        allThreads={allThreads} paginatedThreads={paginatedThreads}
        closeSidebar={closeSidebar}
      />
      <main className="flex-1 flex flex-col p-5 items-center lg:ml-64">
        {(!sentFirstMessage) ?
          <ChatRecommendation /> :
          // <div className="flex flex-col items-start w-full overflow-y-auto max-h-[calc(100vh-150px)]">
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          //   <ChatBubble userImage={session?.user?.image} userName={session?.user?.name} />
          // </div>
          <Conversation user={session?.user} conversation={conversation}/>
        }
        <div className="flex flex-col items-center mt-5 w-full md:w-full lg:w-3/2 fixed bottom-0 bg-white">
          <div className="flex flex-row items-center w-3/4">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter your text here"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg mr-3 mt-2"
            />
            <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-2 rounded-lg">Submit</button>
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