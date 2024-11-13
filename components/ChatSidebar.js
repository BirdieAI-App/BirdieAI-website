import ButtonAccount from "./ButtonAccount";
import { useRouter } from "next/navigation";


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

  return (
    <div>
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-2 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 overflow-scroll`}>
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
        <div className="mb-3 flex flex-col">
          <h4 className={`mb-2 ${(allThreads.length > 5) ? "" : "hidden"}`}>Previous Chats</h4>
          {(!loadingAllThreads) ? allThreads?.map((item, idx) => (
            <button key={idx} className="text-black py-3 px-2 border border-gray-300 rounded-lg mb-3 text-center"
              onClick={() => openThreadByID(item?.threadID)}>{item?.title + "..."}</button>
          )) : <p> Loading all latest threads... </p>}
        </div>
        {/* <button className={`text-white py-3 px-2 rounded-lg mb-3 text-center bg-green-500 ${((allThreads.length < 5) || (paginatedThreads.nextPage === null)) ? "hidden" : ""}`}
          onClick={() => {
            paginatedThreads.nextPage && getThreadsPaginated(paginatedThreads.nextPage, allThreads);
          }}>
          Load more
        </button> */}
      </aside>

      {/* Overlay for small screens */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={closeSidebar}></div>}

      <div className="flex lg:hidden p-2">
        <button onClick={toggleSidebar} className="text-2xl p-2 focus:outline-none">
          ☰
        </button>
      </div>
    </div>
  )
}