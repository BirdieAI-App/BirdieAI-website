"use client";

import { useRef, useState } from "react";

// <FAQ> component is a list of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "How does Birdie work?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Birdie is your friendly, science-backed nutrition coach! Here's how it works:
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Listens to You:</strong> Birdie carefully reads your question to understand what you're looking for, whether it's general advice or specific nutrition tips.
          </li>
          <li>
            <strong>Finds Trustworthy Information:</strong> Birdie searches through thousands of scientific medical papers and trusted health resources like PubMed, Mayo Clinic, and USDA. We update our database monthly to ensure you get the latest research-backed information.
          </li>
          <li>
            <strong>Analyzes for Accuracy:</strong> Birdie uses advanced technology to match keywords and understand context, ensuring that the information it finds is truly relevant to your question. This careful analysis helps provide you with accurate, up-to-date advice.
          </li>
          <li>
            <strong>Combines Expert Knowledge:</strong> Birdie doesn't just repeat one source. Birdie looks at multiple trusted studies and expert opinions to give you a well-rounded answer.
          </li>
          <li>
            <strong>Explains it Clearly:</strong> Birdie takes all this scientific information and translates it into simple, easy-to-understand language. Birdie will provide references, so you can see exactly where the advice comes from.
          </li>
        </ul>
        With Birdie, you get reliable, evidence-based nutrition advice tailored just for you, making it easier to make informed decisions. It's like having a nutrition expert and a caring friend, all in one!
      </div>
    ),
  },
  {
    question: "How do I know if information is correct?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Birdie uses the following criteria for data selection to ensure the reliability and accuracy of the information:
        <ul className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Accreditation:</strong> Sites should be accredited by reputable health organizations or be recognized authorities in the medical field.
          </li>
          <li>
            <strong>Evidence-Based Information:</strong> Content should be evidence-based, relying on peer-reviewed research or guidelines from recognized medical institutions.
          </li>
          <li>
            <strong>Transparency:</strong> The site should clearly disclose its mission, funding, and any potential conflicts of interest.
          </li>
          <li>
            <strong>Updates:</strong> The site should regularly update its content to reflect the latest medical research and guidelines.
          </li>
          <li>
            <strong>User Privacy:</strong> Trustworthy sites should have clear policies that protect user privacy and data.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "How do I contact Birdie if I have another question?",
    answer: (
      <div className="space-y-2 leading-relaxed"> You can contact us by email at dev@birdieapp.co</div>
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
