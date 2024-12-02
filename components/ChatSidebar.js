import ButtonAccount from "./ButtonAccount";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faHeart, faClockRotateLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import ChatHistory from "./ChatHistory";

export default function ChatSidebar({ 
    // Functions
    toggleSidebar, closeSidebar, getThreadsPaginated, openThreadByID, setThreadID, setConversation, setSentFirstMessage, setUserLimitReached,
    // Booleans
    isSidebarOpen, loadingAllThreads,
    // State Information
    allThreads, paginatedThreads, subscriptionTier, freeThreadCount
  }) {
  const router = useRouter();
  // const {conversation}  = useChat();

  // console.log(conversation);
  console.log(isSidebarOpen);

  return (
    <div>
      {/* <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-2 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 overflow-scroll`}>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg mb-5"
          onClick={() => {
            setThreadID("");
            setConversation([]);
            setSentFirstMessage(false);
            setUserLimitReached(false);
            router.push('/chat');
          }}> New Chat </button>
        <div className="mb-5">
          <ButtonAccount />
          {subscriptionTier === 'Free' ? 
            <div>
              <span className="block mt-3 mb-3">You have used {freeThreadCount} of 3 free chats.</span>
              <button className="bg-orange-500 text-white py-2 px-4 rounded-lg" onClick={() => router.push('/plans')}>
                Upgrade for less than $10 / month
              </button>
            </div> : <></>
          }
        </div>
      
        {!isSidebarOpen && <ChatHistory loadingAllThreads={loadingAllThreads} allThreads={allThreads}/>}
  
      </aside> */}

      {/* Overlay for small screens */}
      {/* {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={closeSidebar}></div>} */}

      <div className="flex p-2">
        <button onClick={toggleSidebar} className="text-2xl p-2 focus:outline-none">
        <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </div>
  )
}