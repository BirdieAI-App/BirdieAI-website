import React from 'react';
import logo from '@/app/icon.png';
import Image from "next/image";
import { useRef, useEffect } from 'react';
import { set } from 'mongoose';

const BotResponse = ({ response }) => {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image
            alt="bot response"
            src={logo} />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50">time</time>
      </div>
      <div className="chat-bubble bg-gray-100 text-black">
        {response}
      </div>
      <div className="chat-footer opacity-50">footer</div>
    </div>
  );
};

const UserPrompt = ({ prompt, session }) => {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image
            src={session?.user?.image || logo}
            alt={session?.user?.name || "Account"}
          />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50">time</time>
      </div>
      <div className="chat-bubble bg-green-100 text-black ">{prompt}</div>
      <div className="chat-footer opacity-50">footer</div>
    </div>
  );
}

const ChatMessage = ({ payload, session }) => {
  const messagesToBottomRef = useRef(null);

  useEffect(() => {
    if (messagesToBottomRef.current) {
      messagesToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [payload]);

  return (
    <div className="">
      {/* bot  */}
      {payload.prompt && <UserPrompt prompt={payload.prompt} session={session} />}
      <div ref={messagesToBottomRef} />
      {/* user  */}
      {payload.response && <BotResponse response={payload.response} />}
      <div ref={messagesToBottomRef} />
    </div>
  );
};

export default ChatMessage;