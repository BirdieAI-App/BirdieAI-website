"use client";

import React, { useState, useEffect, use } from 'react';
import logo from '@/app/icon.png';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSquarePlus } from "@fortawesome/free-regular-svg-icons"
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from '@headlessui/react';
import ChatMessage from '@/components/ChatMessage';
import { getAllMessagesByThreadId } from '@/libs/request';
import { useSession } from 'next-auth/react';

const message1 = {
  prompt: "Hello, how can I help you today Hello, how can I help you today Hello, how can I help you today Hello, how can I help you today?",
  response: "I am feeling good I am feeling good I am feeling good I am feeling good.",
}

const message2 = {
  prompt: "That is great to hear!",
  response: "Thank you!",
}

const message3 = {
  prompt: "You're welcome!",
  response: "Goodbye!",
}

const ChatTab = () => {
  const [chatMessage, setChatMessage] = useState('');
  const { data: session, status } = useSession();

  const plan = "Free";

  // const threadID = "thread_nay_la_fake";
  // useEffect(() => {
  //   console.log('Chat tab mounted');
  //   console.log(threadID);
  //   // Fetch chat messages for the threadID here
  //   const fetchMessages = async () => {
  //     try {
  //       const messages = await getAllMessagesByThreadId(threadID);
  //       console.log(messages);
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
  //   };
  //   fetchMessages();
  // })

  const handleSubmitChatMessage = () => {
    console.log('Submit chat message');
    console.log(chatMessage);
  }

  const handleAddNewChatButton = () => {
    console.log('Add new chat');
  }

  const handleProfileButton = () => {
    console.log('My Profile');
  }

  const handleLogOutButton = () => {
    console.log('Log out');
  }

  const handleUserPlanButton = () => {
    console.log('Your plan: Free');
  }

  const handleUserUpgradePlanButton = () => {
    console.log('Upgrade');
  }
  return (
    <div className="flex flex-col w-full relative">
      {/* ____________________________Navigation bar___________________________________ */}
      <nav className="border-b-2 border-gray-200">
        <ul className="px-4 flex flex-row items-center justify-between">
          <li className="hover:bg-gray-700">
            <Image
              src={logo}
              alt={`logo`}
              priority={true}
              className="w-20 h-20"
            />
          </li>
          <li className='text-3xl flex flex-row items-center gap-4'>
            <p className=''>New Chat</p>
            <button
              className='text-2xl'
              onClick={handleAddNewChatButton}
            >
              <FontAwesomeIcon icon={faSquarePlus} />
            </button>
          </li>
          <li className='text-2xl flex flex-row'>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center">
                  {
                    session?.user?.image ?
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-12 h-12 rounded-full"
                        width={48}
                        height={48}
                      />
                      : <FontAwesomeIcon icon={faUser} className="text-2xl" />
                  }
                </Menu.Button>
              </div>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className="absolute right-0 mt-2 w-40 origin-top-right border border-black 
                    						bg-white divide-y divide-gray-200 rounded-md shadow-lg focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? "bg-green-500 text-white" : "text-gray-900"
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={handleProfileButton}
                        >
                          My Profile
                        </button>
                      )}
                    </Menu.Item>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${active ? "bg-red-500 text-white" : "text-gray-900"
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={handleLogOutButton}
                          >
                            Log out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? "bg-green-500 text-white" : "text-gray-900"
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={handleUserPlanButton}
                        >
                          Your plan: Free
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  {
                    plan === "Free" ?
                      <div className="p-2">
                        <Menu.Item>
                          <button
                            className='text-sm text-white bg-green-500 p-2 w-full rounded-lg'
                            onClick={handleUserUpgradePlanButton}
                          >
                            Upgrade
                          </button>
                        </Menu.Item>
                      </div>
                      : null
                  }

                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        </ul>
      </nav>
      {/*____________________________Chat display_____________________________________ */}
      <div className="flex flex-col w-full h-full ">
        <div className='flex flex-grow flex-col'>
          <ChatMessage payload={message1} session={session} />
          <ChatMessage payload={message2} session={session} />
          <ChatMessage payload={message3} session={session} />
        </div>

        {/*____________________________Chat input______________________________________ */}
        <div className="flex flex-col items-center justify-between">
          <div className="relative flex flex-row w-full px-4 pt-4 border-t-2 border-gray-200">
            <input
              className='w-full p-2 border-2 border-gray-200 rounded-md outline-none'
              type="text"
              placeholder="Ask Birdie Coach"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button
              className='absolute bg-green-500 text-white rounded-r-md right-4 p-2'
              onClick={handleSubmitChatMessage}
            >
              <FontAwesomeIcon icon={faLocationArrow} className='text-2xl' />
            </button>
          </div>
          <p className='pb-4 pt-2 text-xs text-gray-500'>Please consult healthcare providers for medical advice.</p>
        </div>
      </div>
    </div>
  );
}

export default ChatTab;