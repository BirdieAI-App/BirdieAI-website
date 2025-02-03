import React from 'react';
import logo from '@/app/icon.png';
import Image from "next/image";

const ChatMessage = ({ payload, session }) => {
  return (
    <div className="flex flex-col p-4">
      {/* bot prompt */}
      <div className="flex items-end pb-4">
        <Image
          src={logo}
          alt="Chatbot"
          className="w-12 h-12 rounded-full shrink-0 relative top-6"
          referrerPolicy="no-referrer"
          width={48}
          height={48}
        />
        {/* padding: 16px (1rem), image: 48px, padding from text to image: 16px */}
        <p className="px-4 py-2 mr-16 text-lg bg-gray-100 rounded-3xl rounded-bl-none">{payload.prompt}</p>
      </div>
      {/* user response */}
      <div className="flex flex-row-reverse items-end gap-4 relative">
        <Image
          src={session?.user?.image || logo}
          alt={session?.user?.name || "Account"}
          className="w-12 h-12 rounded-full shrink-0 relative top-6"
          referrerPolicy="no-referrer"
          width={48}
          height={48}
        />
        <p className="px-4 py-2 text-lg text-right bg-green-100 rounded-3xl rounded-br-none max-w-[60%]">{payload.response}</p>
      </div>
    </div>
  );
};

export default ChatMessage;