export default function ChatRecommendation({ setCurrentMessage }) {
    const suggestions = [
        "I'm constantly hungry during my pregnancy and gained a lot of weight. Give me tips for monitoring food intake and weight again",
        "Provide me with diet ideas before taking a glucose test",
        "Foods to eat and avoid while lactating",
    ];
    return (
        <div className="w-full">
            <div className="flex items-center justify-center flex-col">
                <div className="flex justify-center mb-5">
                    <img className="h-20 w-20" src="/icon.png" alt="" />
                </div>
                <header className="mb-5">
                    <h1 className="text-center">Have no ideas? Here are some questions that other Moms often ask!</h1>
                </header>
                <div className="flex flex-row flex-1 items-center w-full">
                    {suggestions?.map((item, idx) => (
                        <button key={idx} className="text-black py-3 mx-2 border border-gray-300 rounded-lg mb-3 text-center w-full md:w-1/2 lg:w-1/3"
                            onClick={() => setCurrentMessage(item)}>{item}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}