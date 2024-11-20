import { useChat } from "@/hooks/useChat";
import ChatBubble from "./ChatBubble";
import { Remarkable } from 'remarkable';
import { useEffect, useState } from "react";

const md = new Remarkable();
md.renderer.rules.link_open = (tokens, idx) => {
  const href = tokens[idx].href || tokens[idx].attrs[0][1];
  return `<a href="${href}" class="text-blue-600">`;
};

export default function Conversation({conversation, user, userLimitReached, currentMessageData }) {
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
  const fullCurrentResponse = currentMessageData?.response;

  const [typedResponse, setTypedResponse] = useState(""); // For typing effect

  // Typing effect logic
  useEffect(() => {
    if (fullCurrentResponse) {
      let charIndex = 0;
      setTypedResponse("");
      const interval = setInterval(() => {
        if (charIndex < fullCurrentResponse.length) {
          setTypedResponse((prev) => prev + fullCurrentResponse[charIndex]);
          charIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2);
      return () => clearInterval(interval);
    }
  }, [fullCurrentResponse]);

  return (
    <div className="flex flex-col items-start w-full overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-150px)]">
      <div className="w-full">
        {conversation?.map( (messageDataPoint, index) => {
          return (
            <div key={index}>
              {<ChatBubble userImage={user?.image} userName={user?.name} key={`${index}-user`} role={"user"} messageData={messageDataPoint} />}
              {<ChatBubble userImage={user?.image} userName={user?.name} key={`${index}-assistant`} role={"assistant"} messageData={messageDataPoint} />}
            </div>
          )
        })}
      </div>
      {currentPrompt && currentResponse ? (
        <div className="w-full">
          <ChatBubble userImage={user?.image} userName={user?.name} role={"user"} messageData={currentMessageData} />
          <ChatBubble userImage={user?.image} userName={user?.name} role={"assistant"} messageData={{...currentMessageData, response: typedResponse}}/>
        </div>
      ) : (
        <></>
      )}
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