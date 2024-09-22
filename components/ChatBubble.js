import { useState } from "react";
import { Remarkable } from 'remarkable';

const md = new Remarkable();
md.renderer.rules.link_open = (tokens, idx) => {
  const href = tokens[idx].href || tokens[idx].attrs[0][1];
  return `<a href="${href}" class="text-blue-600">`;
};

export default function ChatBubble({ userImage, userName, role, content }) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownButton = `z-10 ${openDropdown ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-40`;
    return (
        <div className="flex items-start gap-2.5 my-4 mx-10">
            <img
                src={role === "user" ? userImage : "/icon.png"}
                alt={userName || "Account"}
                className="w-10 h-10 rounded-full shrink-0"
                referrerPolicy="no-referrer"
                width={24}
                height={24}
            />
            <div className="flex flex-col w-full max-w-[560px] leading-1.5 px-8 py-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900">{role === "user" ? userName : "Birdie Bot"}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900">
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: md.render(content) }}
                />
                </p>
                {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span> */}
            </div>
            <button id="dropdownMenuIconButton" data-dropdown-placement="bottom-start" className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button"
                onClick={() => setOpenDropdown(!openDropdown)}>
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>
            <div id="dropdownDots" className={dropdownButton}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                    </li>
                </ul>
            </div>
        </div>

    )
}