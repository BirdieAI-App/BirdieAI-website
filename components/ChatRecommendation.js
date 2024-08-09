export default function ChatRecommendation() {
    const suggestions = [
        "Diet guideline for pregnancy",
        "Diet guideline for postpartum and breast feeding",
        "Diet guidelines for infants",
    ];
    return (
        <div className="w-full">
            <div className="flex justify-center mb-5">
                <img className="h-20 w-20" src="/icon.png" alt="" />
            </div>
            <header className="mb-5">
                <h1 className="text-center">How can I help you?</h1>
            </header>
            <div className="flex flex-col flex-1 items-center w-full">
                {suggestions?.map((item, idx) => (
                    <button key={idx} className="text-black py-3 px-2 border border-gray-300 rounded mb-3 text-center w-full md:w-1/2 lg:w-1/3">{item}</button>
                ))}
            </div>
        </div>
    )
}