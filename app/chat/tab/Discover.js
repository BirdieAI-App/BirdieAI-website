"use client";

import React, { useState, useEffect } from 'react';
import { Combobox } from "@headlessui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { getDiscoverQuestions } from '@/libs/request';

import 'swiper/css';
import 'swiper/css/free-mode';

const DiscoverTab = ({ onQuestionClick }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All questions');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getDiscoverQuestions();
        setQuestions(data || []);
        if (data?.length) setSelectedQuestion(data[0]);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const categories = ['All questions', ...Array.from(new Set(questions.map(q => q.category).filter(Boolean)))];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.content?.toLowerCase().includes(query.toLowerCase()) ||
      q.title?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All questions' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearchQuestion = (value) => {
    setSelectedQuestion(value);
  };

  const handleCategoryButton = (category) => {
    setSelectedCategory(category);
  };

  const handleQuestionButton = (question) => {
    onQuestionClick?.(question);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h1 className="text-2xl font-bold">Top Mom&apos;s concerns</h1>

      <Combobox
        as="div"
        value={selectedQuestion}
        onChange={handleSearchQuestion}
        className="border-2 border-gray-300 rounded-lg relative my-4 overflow-hidden"
      >
        <Combobox.Input
          className="w-full p-2 outline-none"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for questions..."
          displayValue={(q) => q?.content || ''}
        />
        <Combobox.Options className="h-fit w-full p-2 border-2 border-gray-200 divide-y-2 rounded-md outline-none max-h-40 overflow-y-auto">
          {filteredQuestions.length === 0 && (
            <Combobox.Option value="" disabled>
              No results found
            </Combobox.Option>
          )}
          {filteredQuestions.map((q) => (
            <Combobox.Option key={q._id} value={q}>
              {q.content}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>

      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        spaceBetween={15}
        grabCursor={true}
        slidesPerView={2}
        className="w-full"
      >
        {categories.map((category) => (
          <SwiperSlide
            key={category}
            className={`px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-center cursor-pointer
              ${selectedCategory === category ? 'bg-black text-gray-200' : 'bg-white text-black'}`}
            onClick={() => handleCategoryButton(category)}
          >
            {category}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col mt-8 mb-16 overflow-y-scroll">
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No questions found. Run the seed script to load questions.</p>
        ) : (
          filteredQuestions.map((question) => (
            <button
              key={question._id}
              className="w-full p-4 my-2 border-2 border-gray-300 rounded-lg text-left hover:border-green-500 transition-colors"
              onClick={() => handleQuestionButton(question)}
            >
              <h2 className="font-bold text-xl">{question.title}</h2>
              <p className="text-slate-700 text-lg">{question.content}</p>
              {question.keywords?.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                  {question.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-sm text-black font-bold rounded-lg bg-gray-100 px-2 py-1"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
