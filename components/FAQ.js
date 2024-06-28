"use client";

import { useRef, useState } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "How does Birdie work?",
    answer: <div className="space-y-2 leading-relaxed"> We use AI and Large Language Modal with custom training from credible medical sources such as webmd, mayoclinic for medical related questions. We gathers a huge collection of recipes from top food channels and analysize the ingreadients and map them with specific nutrition needs to provide the personalized and appropriate nutrition plan. You can simply enter your questions about a spefic topics. If you don't know how to start, just describe your condition and ask for guidance. Birdie is here to help</div>,
  },
  {
    question: "How do I know if information is correct?",
    answer: (
      <p>
        For nutrition related questions, our AI Diet coach is trained with research contents and articles from trustworthy medical sites about nutrition, pregnancy care, children health and food ingredient review. 
        Our criteria to select the source is based on the following criteria: the site has to be accredited by reputable health organizations or recognized by authorities in the medical field, content in the site is evidence-based, relying on peer-reviewed research or guidelines from recognized medical institutions, and information is written or reviewed by medical professionals with expertise in the relevant fields. The list of medical sites also includes websites from schools of health at well-established universities that often provide reliable and authoritative information on various health topics, including nutrition, pregnancy care, and children's health and top hospitals in women's and children's healthcare.
        For recipes, we gather thousand of popular and high-review recipes from different diet types to address user preference.
      </p>
    ),
  },
  {
    question: "How do I contact Birdie if I have another question?",
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, contact us by email dev@birdieapp.co</div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
