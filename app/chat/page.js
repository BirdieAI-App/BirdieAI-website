"use client";

import React, { useEffect, useState } from "react";
// import Chat from "@/components/Chat";
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

  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
        try {
          const res = await checkAuthentication();
          setIsLoading(false)
          console.log(res)//user info for frontend in here
        } catch (err) {
          console.log(err)
          setIsLoading(false)
        }
    }

    checkAuth();
  }, [])
  return (
    (isloading ? <></>: <div className="h-screen flex flex-col">
      <Tab.Group as="div" className="flex flex-grow flex-col">
        {/* Panels */}
        <Tab.Panels className="flex-grow flex h-full">
          <Tab.Panel className="flex h-full w-full">
            <ChatTab />
          </Tab.Panel>
          <Tab.Panel className="flex h-full w-full">
            <DiscoverTab />
          </Tab.Panel>
          <Tab.Panel className="flex h-full w-full">
            <LibraryTab />
          </Tab.Panel>
          <Tab.Panel className="flex h-full">
            <ToDoListTab />
          </Tab.Panel>
        </Tab.Panels>

        {/* Tab List */}
        <Tab.List className="flex justify-between">
          <Tab
            autoFocus
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
