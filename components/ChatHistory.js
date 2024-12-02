export default function ChatHistory({loadingAllThreads,allThreads,openThreadByID}) {
    return (<div className="mb-3 flex flex-col">
        <h4 className={`mb-2 ${(allThreads?.length > 5) ? "" : "hidden"}`}>Previous Chats</h4>
        {(!loadingAllThreads) ? allThreads?.map((item, idx) => (
            <button key={idx} className="text-black py-3 px-2 border border-gray-300 rounded-lg mb-3 text-center"
                onClick={() => openThreadByID(item?.threadID)}>{item?.title + "..."}</button>
        )) : <p> Loading all latest threads... </p>}
    </div>)
}