import { useChat } from "@/hooks/useChat";
import ChatBubble from "./ChatBubble";
import { Remarkable } from 'remarkable';
import { useEffect } from "react";

const md = new Remarkable();
md.renderer.rules.link_open = (tokens, idx) => {
  const href = tokens[idx].href || tokens[idx].attrs[0][1];
  return `<a href="${href}" class="text-blue-600">`;
};

export default function Conversation({ conversation, user, streaming, currentResponse, userLimitReached }) {
  // const {conversation} = useChat();
  // console.log(conversation);

  return (
    <div className="flex flex-col items-start w-full overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-150px)]">
      {conversation?.map((bubble, id) => {
          const { role, content } = bubble;
          return (
            <div key={id}>
              {role !== "system" && <ChatBubble userImage={user?.image} userName={user?.name} key={id % 2} role={role} content={content} />}
            </div>
          )
        })}
      {streaming ? (
        <div className="w-full">
          <ChatBubble userImage={user?.image} userName={user?.name} role={"assistant"} content={currentResponse} />
        </div>
      ) : (
        <></>
      )}
      {userLimitReached ?
        <div className="w-full" >
          <ChatBubble
            role={"assistant"}
            content={"I'm glad I'm able to help. Trial users have limited chat sessions. Upgrade to continue using Birdie AI Diet Coach"}
            hyperlink={`${process.env.NEXT_PUBLIC_BASE_URL}/plans`}
            hyperlinkText="Subscribe now to get unlimited access."
            userLimitReached={userLimitReached}
          />
        </div> : <></>
      }
    </div>
  )
}