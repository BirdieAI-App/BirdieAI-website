import { useChat } from "@/hooks/useChat";
import ChatBubble from "./ChatBubble";
import { Remarkable } from 'remarkable';
import { useEffect } from "react";

const md = new Remarkable();
md.renderer.rules.link_open = (tokens, idx) => {
  const href = tokens[idx].href || tokens[idx].attrs[0][1];
  return `<a href="${href}" class="text-blue-600">`;
};

export default function Conversation({conversation, user,streaming,currentResponse}) {
    // const {conversation} = useChat();
    console.log(conversation);

    return (
        <div className="flex flex-col items-start w-full overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-150px)]">
            {conversation?.map((item,idx) => {
              const {prompt, response} = item;
              return (
                <div>
                  <p>{prompt}</p>
                  <p>{response}</p>
                </div>
              )
            })}
        </div>
    )
}