export default function ChatRecommendation({ setCurrentMessage }) {
    const suggestions = [
        "I'm constantly hungry during my pregnancy and gained a lot of weight. Give me tips for monitoring food intake and weight again",
        "Provide me with diet ideas before taking a glucose test",
        "Foods to eat and avoid while lactating",
    ];
    return (
        <div className="h-screen">
            <div className="flex flex-col items-center justify-center px-2 h-full overflow-y-auto">
                <div className="flex justify-center mt-12">
                    <img className="h-20 w-20" src="/icon.png" alt="" />
                </div>
                <header className="mb-2">
                    <h1 className="text-center">Hi, I am Birdie, your diet coach. I'm here to assist with dietary questions in Prenatal, Postpartum, and Pediatric Nutrition. Let's start by sharing your concerns or questions in the chat box. <br />
                        Have no ideas? Here are some questions that other Moms often ask!</h1>
                </header>
                <div className="flex flex-col flex-1 items-center w-full">
                    {suggestions?.map((item, idx) => (
                        <button key={idx} className="text-black py-3 mx-2 border border-gray-300 rounded-lg mb-3 text-center w-full md:w-1/2 lg:w-1/2"
                            onClick={() => setCurrentMessage(item)}>{item}</button>
                    ))}
                </div>
            </div>
        </div>

    )
}