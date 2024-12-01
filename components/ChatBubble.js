import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Markdown from "markdown-it";
import htmlToPdfmake from "html-to-pdfmake";
import { useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { ReactTyped } from 'react-typed';
import ReactDOMServer from 'react-dom/server'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import {
    faThumbsUp as faThumbsUpSolid,
    faThumbsDown as faThumbsDownSolid
} from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const md = new Markdown();

const generatePdfForMessage = async (content) => {
    try {
        // Strip images from markdown, render HTML, and convert it to PDF
        const renderedMarkdown = md.render(content.replace(/!\[.*?\]\(.*?\)/g, ""));
        const pdfmakeContent = htmlToPdfmake(renderedMarkdown);
        const mergedDefinition = {
            content: [pdfmakeContent],
            defaultStyle: { font: "Roboto" },
        };

        const date = new Date().toDateString();
        pdfMake.createPdf(mergedDefinition).download(`message_${date}.pdf`);
    } catch (err) {
        alert("error generating PDF: ", err.message);
    }
};

const updateFeedback = async function (messageData, feedback) {
    const id = messageData._id;
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/call/messages/${id}`,
            { feedback: feedback }
        );
    } catch (err) {
        console.log("Error updating feedback: ", err);
    }
}

export default function ChatBubble({ role, userLimitReached = false, hyperlinkData, messageData, current }) {
    const [feedback, setFeedback] = useState(messageData?.feedback || "none");
    const [typingEffect, setTypingEffect] = useState(false);
    const { data: session, status } = useSession();
    const user = session?.user;
    const userImage = user?.image;
    const userName = user?.name;

    const handleLikeClick = () => {
        const newFeedback = feedback === "like" ? "none" : "like";
        setFeedback(newFeedback);
        updateFeedback(messageData, newFeedback);
    };

    const handleDislikeClick = () => {
        const newFeedback = feedback === "dislike" ? "none" : "dislike";
        setFeedback(newFeedback);
        updateFeedback(messageData, newFeedback);
    };

    const formatProps = {
        // Custom table rendering
        table: ({ node, ...props }) => (
            <table className="min-w-full table-auto border-collapse my-4" {...props} />
        ),
        th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100" {...props} />
        ),
        td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2 text-left" {...props} />
        ),
        // Custom heading rendering
        h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold my-2" {...props} />
        ),
        h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold my-1" {...props} />
        ),
        // Custom link rendering (if there are any links in the content)
        a: ({ node, ...props }) => (
            <a className="text-blue-600" {...props} />
        ),
        // Customize bold text
        strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
        ),
        // Customize list rendering
        ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside my-2" {...props} />
        ),
        li: ({ node, ...props }) => (
            <li className="my-1" {...props} />
        ),
    };
    const hyperlink = hyperlinkData?.hyperlink;
    const hyperlinkText = hyperlinkData?.hyperlinkText;
    const response = messageData?.response;
    const prompt = messageData?.prompt;
    let content = "";
    if (userLimitReached) {
        content = "I'm glad I'm able to help. Trial users have limited chat sessions. Upgrade to continue using Birdie AI Diet Coach";
    } else if (role === "user") {
        content = prompt;
    } else if (role === "assistant") {
        content = response;
    }
    return (
        <div className="flex flex-col my-1">
            <div className="flex items-start gap-1 my-2 mx-2">
                <img
                    src={role === "user" ? userImage : "/icon.png"}
                    alt={userName || "Account"}
                    className="w-10 h-10 rounded-full shrink-0"
                    referrerPolicy="no-referrer"
                    width={24}
                    height={24}
                />

                <div
                    className={`flex flex-col w-full max-w-[840px] px-6 py-4 rounded-e-xl rounded-es-xl
                        ${userLimitReached ? "border border-l-10 border-l-pinkf472b6 bg-pinkfdf2f8" :
                            role === 'user' ? "border bg-gray-100 border-gray-200" : ""
                        }`}
                >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900">{role === "user" ? userName : "Birdie Diet Coach"}</span>
                    </div>

                    <div> {/* Ensures table fits in bubble */}
                        <div className="overflow-x-auto max-w-full">
                            {(current ?
                                <ReactTyped
                                    strings={[
                                        ReactDOMServer.renderToString(
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={formatProps}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        )
                                    ]}
                                    typeSpeed={2}
                                    showCursor={false}
                                    onBegin={() => setTypingEffect(true)}
                                    onComplete={() => setTypingEffect(false)}
                                />
                                :
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={formatProps}
                                >
                                    {content}
                                </ReactMarkdown>
                            )}
                        </div>
                        {userLimitReached ? (
                            <a className="font-bold underline text-red-400" href={hyperlink}>
                                {hyperlinkText}
                            </a>
                        ) : <></>}
                    </div>
                    {role !== 'user' && !userLimitReached && !typingEffect ? (
                        <div className="w-full flex items-end justify-end">
                            <ul className="text-sm text-gray-700 flex">
                                <li className="border border-black-500 bg-white rounded-md mx-1 mt-2 \
                                             hover:bg-gray-100 hover:scale-105 transition ease-linear duration-200">
                                    <button
                                        className={`block px-4 py-2 transform transition-all duration-200 active:scale-9`}
                                        onClick={handleLikeClick}
                                    >
                                        <FontAwesomeIcon icon={feedback === 'like' ? faThumbsUpSolid : faThumbsUp} />
                                    </button>
                                </li>
                                <li className="border border-black-500 bg-white rounded-md mx-1 mt-2 
                                             hover:bg-gray-100 hover:scale-105 transition ease-linear duration-200">
                                    <button
                                        className={`block px-4 py-2 transform transition-all duration-200 active:scale-9`}
                                        onClick={handleDislikeClick}
                                    >
                                        <FontAwesomeIcon
                                            icon={feedback === 'dislike' ? faThumbsDownSolid : faThumbsDown}
                                            className={`${feedback === 'dislike' ? 'animate-popup' : ''}`}
                                        />
                                    </button>
                                </li>
                                <li
                                    className="border border-black-500 bg-white rounded-md mx-1 mt-2
                                             hover:bg-gray-100 hover:scale-105 hover:text-black transition ease-linear duration-200"
                                >
                                    <button
                                        className="block px-4 py-2"
                                        onClick={() => generatePdfForMessage(content)}
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : <></>}
                </div>
            </div>
        </div>
    );
}
