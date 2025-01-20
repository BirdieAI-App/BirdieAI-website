import React, { use, useEffect, useState } from 'react';
import { Tab, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { getAllThreadsByUser, saveNewThread } from '@/libs/request';

const LibraryTab = () => {
	const userId = "678c6ba2b7b3e0bb250838bd"; //Huy Phung 
	const [threads, setThreads] = useState([]);
	useEffect(() => {
		const fetchThreads = async () => {
			try {
				const threads = await getAllThreadsByUser(userId);
				setThreads(threads);
			} catch (error) {
				console.error('Error fetching threads:', error);
			}
		};
		fetchThreads();
	}, []);

	const handleThreadClick = (thread) => {
		console.log(thread);
	}

	const handleAddNewThread = async () => {
		console.log('Thread added');
	}

	return (
		<div className="flex flex-col w-full relative">
			<Tab.Group as="div" className=" flex flex-col flex-grow">
				{/* Tab List */}
				<Tab.List className="flex flex-row rounded-lg m-2 bg-gray-300">
					<Tab
						autoFocus
						className={({ selected }) =>
							`px-4 py-2 m-1 flex flex-row flex-grow items-center justify-center gap-2 focus:outline-none 
							${selected
								? "bg-white text-black rounded-lg transition duration-300 ease-in-out"
								: "text-gray-500"
							}`
						}>
						<FontAwesomeIcon icon={faComment} />
						<p className="text-xs">Past Conversation</p>
					</Tab>
					<Tab className={({ selected }) =>
						`m-1 px-4 py-2 flex flex-row flex-grow items-center justify-center gap-2 focus:outline-none 
						${selected
							? "bg-white text-black rounded-lg transition duration-300 ease-in-out"
							: "text-gray-500"
						}`
					}>
						<FontAwesomeIcon icon={faBook} />
						<p className="text-xs">Recipes</p>
					</Tab>
				</Tab.List >
				{/* Panels */}
				<Tab.Panels className="flex flex-grow flex-col">
					<Tab.Panel className="m-2 border-2 border-gray-300 flex flex-grow rounded-xl">
						<div className='flex flex-col flex-grow'>
							<div className='flex flex-row justify-around items-center mt-6'>
								<h1 className='font-bold text-lg'>Past Conversations</h1>
								<button 
									className='p-2 text-white text-sm bg-green-500 rounded-lg outline-none'
									onClick={handleAddNewThread}
								> 
									Start New Chat 
								</button>
							</div>
							{/* Scroll section */}
							<div className='flex flex-col flex-grow gap-2 mt-4 p-4'>
								{threads.map((thread, index) => (
									<button
										className='flex flex-row items-center gap-2 p-4 border-2 border-gray-300 rounded-lg outline-none'
										key={index}
										onClick={() => handleThreadClick(thread)}
									>
										<p className='text-sm overflow-hidden whitespace-nowrap text-ellipsis w-0 flex-1'>{thread.title}</p>
									</button>
								))}
							</div>
						</div>
					</Tab.Panel>
					<Tab.Panel className="">
						<span>Recipes</span>
					</Tab.Panel>
				</Tab.Panels >

			</Tab.Group >
		</div >
	);
}

export default LibraryTab;