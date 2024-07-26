"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import config from "@/config";
import { useRouter } from "next/navigation";
import ButtonAccount from "./ButtonAccount";
import { getAllThreadsByUser } from "@/libs/request";
import { getAllThreadsByUserPaginated } from "@/libs/util";

const Chat = () => {
  const { data: session, status } = useSession();
  const [allThreads, setAllThreads] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paginatedThreads, setPaginatedThreads] = useState({ data: [], nextPage: null });

  const router = useRouter();
  const suggestions = [
    "Diet guideline for pregnancy",
    "Diet guideline for postpartum and breast feeding",
    "Diet guidelines for infants",
  ];

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
    if (session && session.user.userId) setUserId(session.user.userId);

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
    <div className="flex flex-col h-screen font-sans relative">
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-5 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 overflow-scroll`}>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg mb-5"
        onClick={() => window.location.reload()}
        >New Chat</button>
        <div className="mb-5">
          <ButtonAccount />
          <span className="block mt-3 mb-3">You have used 2 of 3 free chats.</span>
          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg" onClick={() => router.push('/plans')}>Upgrade for less than $10 / month</button>
        </div>
        <div className="mb-3 flex flex-col">
          <h4 className={`mb-2 ${(allThreads.length > 5) ? "" : "hidden"}`}>Previous Chats</h4>
          {paginatedThreads.data?.map((item, idx) => (
            <button key={idx} className="text-black py-3 px-2 border border-gray-300 rounded-lg mb-3 text-center">{item?.title}</button>
          ))}
        </div>
        <button className={`text-white py-3 px-2 rounded-lg mb-3 text-center bg-green-500 ${((allThreads.length < 5) || (paginatedThreads.nextPage === null)) ? "hidden" : ""}`}
          onClick={() => {
            paginatedThreads.nextPage && getThreadsPaginated(paginatedThreads.nextPage, allThreads);
          }}>
          Load more
        </button>
      </aside>

      {/* Overlay for small screens */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={closeSidebar}></div>}

      <div className="flex lg:hidden p-5">
        <button onClick={toggleSidebar} className="text-2xl p-2 focus:outline-none">
          ☰
        </button>
      </div>

      <main className="flex-1 flex flex-col p-5 items-center lg:ml-64">
        <div className="flex justify-center mb-5">
          <img className="h-20 w-20" src="/icon.png" alt="" />
        </div>
        <header className="mb-5">
          <h1 className="text-center">How can I help you?</h1>
        </header>
        <div className="flex flex-col flex-1 items-center w-full">
          {suggestions?.map((item, idx) => (
            <button key={idx} className="text-black py-3 px-2 border border-gray-300 rounded mb-3 text-center w-full md:w-1/2 lg:w-1/3">{item}</button>
          ))}
        </div>
        <div className="flex items-center mt-5 w-full md:w-3/4 lg:w-3/2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter your text here"
            className="flex-1 py-2 px-3 border border-gray-300 rounded-lg mr-3"
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
      </main>
    </div>

  );
};


export default Chat;