"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatTab from "@/app/chat/tab/Chat";
import DiscoverTab from "@/app/chat/tab/Discover";
import LibraryTab from "@/app/chat/tab/Library";
import ToDoListTab from "@/app/chat/tab/ToDoList";
import { Tab } from '@headlessui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faBook, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { checkAuthentication } from "@/libs/request";

const ChatPage = () => {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedThread, setSelectedThread] = useState(null);
  const [userId, setUserId] = useState(null);
  const [initialPrompt, setInitialPrompt] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await checkAuthentication();
        setUserId(res?.user?.id || null);
      } catch (err) {
        router.push("/api/auth/signin");
        return;
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);
  return (
    (isloading ? <></> : <div className="h-screen flex flex-col">
      <Tab.Group
        as="div"
        className="flex flex-grow flex-col mb-14"
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        {/* Panels */}
        <Tab.Panels className="flex-grow flex h-full">
          <Tab.Panel className="flex h-full w-full">
            <ChatTab
              userId={userId}
              selectedThread={selectedThread}
              setSelectedThread={setSelectedThread}
              initialPrompt={initialPrompt}
              setInitialPrompt={setInitialPrompt}
            />
          </Tab.Panel>
          <Tab.Panel className="flex h-full w-full">
            <DiscoverTab
              onQuestionClick={(question) => {
                setInitialPrompt(question?.content || question);
                setSelectedThread(null);
                setSelectedIndex(0);
              }}
            />
          </Tab.Panel>
          <Tab.Panel className="flex h-full w-full">
            <LibraryTab
              userId={userId}
              setSelectedThread={setSelectedThread}
              setSelectedIndex={setSelectedIndex}
            />
          </Tab.Panel>
          <Tab.Panel className="flex h-full">
            <ToDoListTab />
          </Tab.Panel>
        </Tab.Panels>

        {/* Tab List */}
        <Tab.List className="flex justify-between fixed bottom-0 w-full bg-white border-t-2 border-gray-200">
          <Tab
            className={({ selected }) =>
              `px-4 py-2 flex flex-col flex-grow items-center focus:outline-none 
              ${selected
                ? "bg-green-500 text-white transition duration-300 ease-in-out"
                : "text-gray-500"
              }`
            }>
            <FontAwesomeIcon icon={faComment} className="fa-xl mb-1" />
            <p className="text-xs">Chat</p>
          </Tab>
          <Tab className={({ selected }) =>
            `px-4 py-2 flex flex-col flex-grow items-center focus:outline-none 
              ${selected
              ? "bg-green-500 text-white transition duration-300 ease-in-out"
              : "text-gray-500"
            }`
          }>
            <FontAwesomeIcon icon={faHouse} className="fa-xl mb-1" />
            <p className="text-xs">Discover</p>
          </Tab>
          <Tab className={({ selected }) =>
            `px-4 py-2 flex flex-col flex-grow items-center focus:outline-none 
              ${selected
              ? "bg-green-500 text-white transition duration-300 ease-in-out"
              : "text-gray-500"
            }`
          }>
            <FontAwesomeIcon icon={faBook} className="fa-xl mb-1" />
            <p className="text-xs">Library</p>
          </Tab>
          <Tab className={({ selected }) =>
            `px-4 py-2 flex flex-col flex-grow items-center focus:outline-none 
              ${selected
              ? "bg-green-500 text-white transition duration-300 ease-in-out"
              : "text-gray-500"
            }`
          }>
            <FontAwesomeIcon icon={faListCheck} className="fa-xl mb-1" />
            <p className="text-xs">To-do list</p>
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>)
  )
}

export default ChatPage;
