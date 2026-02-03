"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import ChatMessage from '@/components/ChatMessage';
import { getAllMessagesByThreadId, saveNewMessage } from '@/libs/request';
import logo from '@/app/icon.png';

const ChatTab = ({ userId, selectedThread, setSelectedThread, initialPrompt, setInitialPrompt }) => {
  const router = useRouter();
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThread?._id) {
        setConversation([]);
        return;
      }
      try {
        const messages = await getAllMessagesByThreadId(selectedThread._id);
        setConversation(messages.map(m => ({ prompt: m.prompt, response: m.response })));
      } catch (error) {
        console.error('Error fetching messages:', error);
        setConversation([]);
      }
    };
    fetchMessages();
  }, [selectedThread?._id]);

  useEffect(() => {
    if (initialPrompt && userId && !isSubmitting) {
      const submitInitial = async () => {
        setIsSubmitting(true);
        try {
          const payload = {
            userID: userId,
            threadID: selectedThread?._id,
            prompt: initialPrompt,
          };
          const newMessage = await saveNewMessage(payload);
          const prompt = newMessage?.prompt ?? initialPrompt;
          const response = newMessage?.response ?? '';
          setConversation(prev => [...prev, { prompt, response }]);
          if (newMessage?.threadID && setSelectedThread) {
            setSelectedThread({ _id: newMessage.threadID });
          }
        } catch (error) {
          console.error('Error submitting initial prompt:', error);
          const msg = error?.response?.data?.message || error?.message || 'Failed to send message';
          toast.error(msg);
        } finally {
          setInitialPrompt?.(null);
          setIsSubmitting(false);
        }
      };
      submitInitial();
    }
  }, [initialPrompt, userId, isSubmitting, selectedThread, setInitialPrompt, setSelectedThread]);

  const handleSubmitChatMessageButton = async () => {
    const messageToSend = currentChatMessage.trim();
    if (!messageToSend) {
      toast.error('Please enter a message');
      return;
    }
    if (!userId) {
      toast.error('Please sign in to send messages');
      return;
    }

    setIsSubmitting(true);
    setCurrentChatMessage('');

    try {
      const payload = {
        userID: userId,
        threadID: selectedThread?._id,
        prompt: messageToSend,
      };
      const newMessage = await saveNewMessage(payload);
      const prompt = newMessage?.prompt ?? messageToSend;
      const response = newMessage?.response ?? '';
      setConversation(prev => [...prev, { prompt, response }]);
      if (newMessage?.threadID && setSelectedThread) {
        setSelectedThread({ _id: newMessage.threadID });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to send message';
      toast.error(msg);
      setCurrentChatMessage(messageToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewChatButton = () => {
    setConversation([]);
    router.refresh();
  };

  const handleProfileButton = () => {
    router.push('/profile');
  };

  const handleLogOutButton = async () => {
    try {
      const res = await fetch('/call/auth/logout', { credentials: 'include' });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        router.push('/api/auth/signin');
      }
    } catch (err) {
      router.push('/api/auth/signin');
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full relative">
      <nav className="border-b-2 bg-white border-gray-200 w-full fixed z-50">
        <ul className="px-4 flex flex-row items-center justify-between">
          <li>
            <Link href="/">
              <Image src={logo} alt="logo" priority={true} className="w-20 h-20" />
            </Link>
          </li>
          <li className="text-3xl flex flex-row items-center gap-4">
            <p>New Chat</p>
            <button className="text-2xl" onClick={handleAddNewChatButton}>
              <FontAwesomeIcon icon={faSquarePlus} />
            </button>
          </li>
          <li className="text-2xl flex flex-row">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex justify-center">
                <span className="w-12 h-12 bg-green-100 flex justify-center items-center rounded-full">
                  <FontAwesomeIcon icon={faUser} className="text-2xl text-green-600" />
                </span>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right border border-black z-50 bg-white divide-y divide-gray-200 rounded-md shadow-lg focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? "bg-green-500 text-white" : "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={handleProfileButton}
                        >
                          My Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? "bg-red-500 text-white" : "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={handleLogOutButton}
                        >
                          Log out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        </ul>
      </nav>

      <div className="flex flex-grow flex-col mt-24 mb-44 overflow-y-auto px-4">
        {conversation.length === 0 && !initialPrompt && (
          <div className="flex flex-col items-center justify-center flex-grow text-gray-500">
            <p className="text-lg">Ask Birdie Coach anything about nutrition</p>
            <p className="text-sm mt-2">Type your question below to get started</p>
          </div>
        )}
        {conversation.map((message, index) => (
          <ChatMessage key={index} payload={message} session={null} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col items-center justify-between w-full fixed bottom-14 bg-white z-50">
        <div className="flex flex-row w-full px-4 pt-4 border-t-2 border-gray-200 gap-2">
          <input
            className="flex-1 min-w-0 p-3 border-2 border-gray-200 rounded-l-md outline-none focus:border-green-500"
            type="text"
            placeholder="Ask Birdie Coach"
            value={currentChatMessage}
            onChange={(e) => setCurrentChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitChatMessageButton();
              }
            }}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="bg-green-500 text-white rounded-r-md px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
            onClick={handleSubmitChatMessageButton}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faLocationArrow} className="text-2xl" />
          </button>
        </div>
        <p className="pb-4 pt-2 text-xs text-gray-500">Please consult healthcare providers for medical advice.</p>
      </div>
    </div>
  );
};

export default ChatTab;
