import React from 'react';
import logo from '@/app/icon.png';
import Image from "next/image";

const BotResponse = ({ response }) => {
  return (
    <div className="flex items-end">
      <Image
        src={logo}
        alt="Chatbot"
        className="w-12 h-12 rounded-full shrink-0 relative top-6"
        referrerPolicy="no-referrer"
        width={48}
        height={48}
      />
      <p className="px-4 py-2 mr-16 text-lg bg-gray-100 rounded-3xl rounded-bl-none">{response}</p>
    </div>
  );
};

const UserPrompt = ({ prompt, session }) => { 
  return (
    <div className="flex flex-row-reverse items-end gap-4 relative pb-4">
      <Image
        src={session?.user?.image || logo}
        alt={session?.user?.name || "Account"}
        className="w-12 h-12 rounded-full shrink-0 relative top-6"
        referrerPolicy="no-referrer"
        width={48}
        height={48}
      />
      <p className="px-4 py-2 text-lg text-right bg-green-100 rounded-3xl rounded-br-none max-w-[60%]">{prompt}</p>
    </div>
  );
}

const ChatMessage = ({ payload, session }) => {
  return (
    <div className="flex flex-col p-4 -z-0">
      {/* bot prompt */}
      
      {payload.prompt && <UserPrompt prompt={payload.prompt} session={session} />}
      {/* user response */}
      {payload.response && <BotResponse response={payload.response} />}
    </div>
  );
};

export default ChatMessage;