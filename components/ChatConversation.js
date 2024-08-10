import ChatBubble from "./ChatBubble";

export default function Conversation({conversation,user}) {
    return (
        <div className="flex flex-col items-start w-full overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-150px)]">
        {conversation.map((bubble,id) => {
            const {role,content} = bubble;
            return (
                <ChatBubble userImage={user?.image} userName={user?.name} key={id % 2} role = {role} content = {content} />
            )
        })}
        </div>
    )
}