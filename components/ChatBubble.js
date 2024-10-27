import { Remarkable } from 'remarkable';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Markdown from "markdown-it";
import htmlToPdfmake from "html-to-pdfmake";
import { useEffect } from 'react';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const md = new Markdown();

const generatePdfForMessage = async (content) => {
    alert('aaaaaaa2')
    try {
        // // Dynamically import pdfMake and pdfFonts on demand
        // const pdfMake = await import("pdfmake/build/pdfmake");
        // const pdfFonts = await import("pdfmake/build/vfs_fonts");

        // pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

export default function ChatBubble({ userImage, userName, role, content, hyperlink, hyperlinkText, userLimitReached = false }) {
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

    return (
        <div className="flex flex-col my-1">
            <div className="flex items-start gap-2.5 my-2 mx-10">
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
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={formatProps}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                        {userLimitReached ? (
                            <a className="font-bold underline text-red-400" href={hyperlink}>
                                {hyperlinkText}
                            </a>
                        ) : <></>}
                    </div>
                    {role !== 'user' && !userLimitReached ? (
                        <div className="w-full flex items-end justify-end">
                            <ul className="text-sm text-gray-700 flex">
                                <li className="border border-black-500 bg-white rounded-md mx-1 mt-2">
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Like</a>
                                </li>
                                <li className="border border-black-500 bg-white rounded-md mx-1 mt-2">
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Dislike</a>
                                </li>
                                <li className="border border-black-500 bg-white rounded-md mx-1 mt-2" onClick={() => generatePdfForMessage(content)}>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Download</a>
                                </li>
                            </ul>
                        </div>
                    ) : <></>}
                </div>
            </div>
        </div>
    );
}
