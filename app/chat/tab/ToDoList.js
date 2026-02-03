"use client";

import React from 'react';
import { Tab } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";

const ToDoListTab = () => {
  return (
    <div className="flex flex-col w-full h-full p-4">
      <Tab.Group as="div" className="flex flex-col flex-grow">
        <Tab.List className="flex flex-row rounded-lg bg-gray-200 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              `px-4 py-2 flex flex-row flex-grow items-center justify-center gap-2 rounded-lg transition duration-200
              ${selected ? "bg-green-500 text-white" : "text-gray-600 hover:bg-gray-300"}`
            }
          >
            <FontAwesomeIcon icon={faAppleAlt} />
            <span className="font-semibold">Nutrition Plan</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              `px-4 py-2 flex flex-row flex-grow items-center justify-center gap-2 rounded-lg transition duration-200
              ${selected ? "bg-green-500 text-white" : "text-gray-600 hover:bg-gray-300"}`
            }
          >
            <FontAwesomeIcon icon={faUtensils} />
            <span className="font-semibold">Meal Plan</span>
          </Tab>
        </Tab.List>

        <Tab.Panels className="flex-grow">
          <Tab.Panel className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-gray-500 text-lg">Your nutrition plan will appear here.</p>
            <p className="text-gray-400 text-sm mt-2">Coming soon</p>
          </Tab.Panel>
          <Tab.Panel className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-gray-500 text-lg">Your meal plan will appear here.</p>
            <p className="text-gray-400 text-sm mt-2">Coming soon</p>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ToDoListTab;
