import React, { useState } from 'react';
import { Combobox } from "@headlessui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const questions = [
    {
        id: 1,
        title: "Morning Sickess Relief",
        content: "Is it normal to worry about weight during pregnancy? Seeking experiences on body image and health tips.",
        Category: "General Pregnancy",
        keywords: ["Weight", "Body Changes", "second trimester"]
    },
    {
        id: 2,
        title: "Safe Exercise",
        content: "What are some good ways to manage stress during pregnancy?",
        Category: "General Pregnancy",
        keywords: ["Stress", "Mental Health", "preparation"]
    },
    {
        id: 3,
        title: "Pregnancy Diet",
        content: "How do you deal with the fear of miscarriage?",
        Category: "General Pregnancy",
        keywords: ["Miscarriage", "Fear", "third trimester"]
    },
    {
        id: 4,
        title: "Parenting",
        content: "How do you deal with children?",
        Category: "Parenting",
        keywords: ["Children", "Parenting", "breastfeeding"]
    },
    {
        id: 5,
        title: "Milk Supply",
        content: "How do you deal with the fear of miscarriage?",
        Category: "Parenting",
        keywords: ["Miscarriage", "Fear"]
    },
    {
        id: 6,
        title: "Parenting Advice",
        content: "im a new mom and i need help",
        Category: "Parenting",
        keywords: ["Children", "Parenting"]
    }
]

const categories = [
    "All questions", "First Trimester", "Second Trimester", "Third Trimester", "General Pregnancy", "Parenting"
]

const DiscoverTab = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All questions');

    const filteredQuestions = questions.filter((singleQuestionData) => {
        return singleQuestionData.content.toLowerCase().includes(query.toLowerCase());
    });

    const handleCategoryButton = (category) => {
        setSelectedCategory(category);
        console.log(category);
    }

    const handleQuestionButton = (question) => {
        // setSelectedQuestion(question);
        console.log(question.title);
    }

    return (
        <div className="flex flex-col w-full h-full p-4">
            <h1 className="text-2xl font-bold"> Top Mom's concerns</h1>
            <Combobox
                as="div"
                value={selectedQuestion}
                onChange={setSelectedQuestion}
                className="border-2 border-gray-300 rounded-lg relative my-4 overflow-hidden"
            >
                <Combobox.Input
                    className={"w-full p-2 outline-none"}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <div className='absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center px-4 gap-4 text-gray-500'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <p> Search questions...</p>
                </div>


                <Combobox.Options
                    className="w-full p-2 border-2 border-gray-200 divide-y-2 rounded-md outline-none"
                >
                    {filteredQuestions.length === 0 &&
                        <Combobox.Option value="" disabled>
                            No results found
                        </Combobox.Option>
                    }
                    {filteredQuestions.map((singleQuestionData) => (
                        <Combobox.Option key={singleQuestionData.id} value={singleQuestionData.content}>
                            {singleQuestionData.content}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
            <div className='flex flex-row text-nowrap gap-2 overflow-hidden'>
                {
                    categories.map((category) => (
                        <button
                            className={`px-4 py-2 border-2 border-gray-300 rounded-lg font-bold 
                                        ${selectedCategory === category ? 'bg-black text-gray-200' : 'bg-white text-black'}`}
                            key={category}
                            onClick={() => handleCategoryButton(category)}
                        >
                            {category}
                        </button>
                    ))
                }
            </div>
            <div className="flex flex-col mt-8 mb-16 overflow-y-scroll">
                {
                    questions.map((question) => (
                        <button
                            key={question.id}
                            className="w-full p-4 my-2 border-2 border-gray-300 rounded-lg text-left"
                            onClick={() => handleQuestionButton(question)}
                        >
                            <h2 className="font-bold text-xl">{question.title}</h2>
                            <p className='text-slate-700 text-lg'>{question.content}</p>
                            <div className='flex flex-row gap-2 mt-2'>
                                {
                                    question.keywords.map((keyword) => (
                                        <span 
                                            key={keyword} 
                                            className="text-sm text-black font-bold rounded-lg bg-gray-100 overflow-hidden px-2 py-1 mr-2"
                                        >
                                            {keyword}
                                        </span>
                                    ))
                                }
                            </div>
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default DiscoverTab;