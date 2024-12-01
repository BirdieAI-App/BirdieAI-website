import { useChat } from "@/hooks/useChat";
import ChatBubble from "./ChatBubble";
import { Remarkable } from 'remarkable';
import { useEffect, useState } from "react";

const md = new Remarkable();
md.renderer.rules.link_open = (tokens, idx) => {
  const href = tokens[idx].href || tokens[idx].attrs[0][1];
  return `<a href="${href}" class="text-blue-600">`;
};

export default function Conversation({conversation, userLimitReached, currentMessageData }) {
  // const {conversation} = useChat();
  // console.log(conversation);
  
  let hyperlinkData;
  if(userLimitReached) {
    hyperlinkData = {
      hyperlink: `${process.env.NEXT_PUBLIC_BASE_URL}/plans`,
      hyperlinkText: "Subscribe now to get unlimited access."
    }
  }

  const currentResponse = currentMessageData.response;
  const currentPrompt = currentMessageData?.prompt;

  return (
    <div className="flex flex-col items-start w-full overflow-y-auto bottom-20" style={{ paddingBottom: '12rem' }}>
      {conversation?.map((messageDataPoint, index) => {
          return (
            <div key={index}>
              {<ChatBubble current={ false } key={`${index}-user`} role={"user"} messageData={messageDataPoint} />}
              {<ChatBubble current={ false } key={`${index}-assistant`} role={"assistant"} messageData={messageDataPoint} />}
            </div>
          )
        })}
        {(currentPrompt && currentResponse) && <ChatBubble current={ true } role={"user"} messageData={currentMessageData} />}
        {(currentPrompt && currentResponse) && <ChatBubble current={ true } role={"assistant"} messageData={currentMessageData}/>} 
      {userLimitReached ?
        <div className="w-full" >
          <ChatBubble
            role={"assistant"}
            hyperlinkData={hyperlinkData}
            userLimitReached={userLimitReached}
          />
        </div> : <></>
      }
    </div>
  )
}