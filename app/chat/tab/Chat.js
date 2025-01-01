"use client";

import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";


const ChatTab = () => {
  return (
    <div className="flex flex-col w-full ">
      <nav className="bg-gray-800 text-white border-2 border-red-500">
        <ul className="flex flex-row">
          <li className="p-4 hover:bg-gray-700">1</li>
          <li className="p-4 hover:bg-gray-700">2</li>
          <li className="p-4 hover:bg-gray-700">3</li>
        </ul>
      </nav>
      <h2 className="text-6xl">Chat</h2>
    </div>
  );
}

export default ChatTab;