"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import config from '@/config';
import { useRouter } from 'next/navigation';

const Chat = () => {
    const [isChecked, setIsChecked] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== 'loading' && !session) {
            router.push(config.auth.loginUrl);
            // console.log('a'); 
        }
    }, [session, status]);

    useEffect(() => {
        console.log(session);
    }, [session])

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return null; // This return statement prevents the rest of the component from rendering until the redirect occurs.
    }

    function onClickHandler(event) {
        event.preventDefault();
        setIsChecked(true);
    }

    return (
        // <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col h-screen">
        //     <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        //         <div className="relative flex items-center space-x-4">
        //             <div className="relative">
        //                 <span className="absolute text-green-500 right-0 bottom-0">
        //                     <svg width="20" height="20">
        //                         <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
        //                     </svg>
        //                 </span>
        //                 <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
        //             </div>
        //             <div className="flex flex-col leading-tight">
        //                 <div className="text-2xl mt-1 flex items-center">
        //                     <span className="text-gray-700 mr-3">Anderson Vanhron</span>
        //                 </div>
        //                 <span className="text-lg text-gray-600">Junior Developer</span>
        //             </div>
        //         </div>
        //         <div className="flex items-center space-x-2">
        //             <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
        //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        //                 </svg>
        //             </button>
        //             <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
        //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        //                 </svg>
        //             </button>
        //             <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
        //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        //                 </svg>
        //             </button>
        //         </div>
        //     </div>
        //     <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        //         <div className="chat-message">
        //             <div className="flex items-end">
        //                 <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        //                     <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">Can be verified on any platform using docker</span></div>
        //                 </div>
        //                 <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-1" />
        //             </div>
        //         </div>
        //         <div className="chat-message">
        //             <div className="flex items-end justify-end">
        //                 <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
        //                     <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">Your error message says permission denied, npm global installs must be given root privileges.</span></div>
        //                 </div>
        //                 <img src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-2" />
        //             </div>
        //         </div>
        //         <div className="chat-message">
        //             <div className="flex items-end">
        //                 <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        //                     <div><span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">Command was run with root privileges. I'm sure about that.</span></div>
        //                     <div><span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">I've update the description so it's more obvious now</span></div>
        //                     <div><span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">FYI https://askubuntu.com/a/700266/510172</span></div>
        //                     <div>
        //                         <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
        //                             Check the line above (it ends with a # so, I'm running it as root )
        //                             <pre># npm install -g @vue/devtools</pre>
        //                         </span>
        //                     </div>
        //                 </div>
        //                 <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-1" />
        //             </div>
        //         </div>
        //         <div className="chat-message">
        //             <div className="flex items-end justify-end">
        //                 <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
        //                     <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">Any updates on this issue? I'm getting the same error when trying to install devtools. Thanks</span></div>
        //                 </div>
        //                 <img src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-2" />
        //             </div>
        //         </div>
        //     </div>
        //     <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        //         <div className="relative flex">
        //             <span className="absolute inset-y-0 flex items-center">
        //                 <button type="button" className="inline-flex items-center justify-center rounded-lg h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300">
        //                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
        //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-4.586-4.586a1.5 1.5 0 00-2.121 2.121L10.88 12l-2.835 2.835a1.5 1.5 0 102.121 2.121l4.586-4.586a1.5 1.5 0 000-2.122z"></path>
        //                     </svg>
        //                 </button>
        //             </span>
        //             <input type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
        //             <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
        //                 <button type="button" className="inline-flex items-center justify-center rounded-lg h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300">
        //                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
        //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-3-3m0 0l3-3m-3 3h12.001M9 7l-3 3m0 0l3 3m-3-3h12.001"></path>
        //                     </svg>
        //                 </button>
        //                 <button type="button" onClick={onClickHandler} className="inline-flex items-center justify-center rounded-lg h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300">
        //                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
        //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        //                     </svg>
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <main className="main grid grid-rows-12 h-screen w-screen
     md:grid md:grid-cols-4 md:h-screen md:w-screen">
            {/**First | Left */}
            <div className="row-span-1 md:col-span-1 pt-5
       md:grid md:grid-rows-12 md:h-screen">
                {/** Mobile : start*/}
                <div className='flex items-center justify-center md:hidden'>
                    <svg className='w-1/3 md:hidden' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" S
                        strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-square-plus">
                        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                    <img className=' object-contain h-12 w-1/3 md:hidden' src='../icon.png' />
                    <svg className='w-1/3 md:hidden' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"
                        class="lucide lucide-square-user"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="12" cy="10" r="3" />
                        <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /></svg>
                </div>
                {/** Mobile : End*/}

                {/** New Chat : Start*/}
                <div className='hidden md:row-start-2 md:row-span-1 
        md:grid md:grid-cols-3
        w-2/3'>
                    <div className='md:col-start-2 md:col-span-2 bg-green-500
          md:grid md:grid-cols-4 '>
                        <div className='md:col-start-1 md:col-span-1 md:flex md:items-center md:justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" S
                                strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-square-plus">
                                <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                        </div>
                        <p className='md:col-start-2 md:col-span-3 md:flex md:items-center md:justify-center'>New Chat</p>
                    </div>
                </div>
                {/** New Chat : End*/}

                {/** Profile : Start*/}
                <div className='hidden md:row-start-11 md:row-span-1 
        md:grid md:grid-cols-3
         w-2/3'>
                    <div className='hidden md:col-start-2 md:col-span-2 bg-green-500
          md:grid md:grid-cols-4 '>
                        <div className='hidden md:col-start-1 md:col-span-1 md:flex md:items-center md:justify-center'>
                            <svg className='hidden md:block' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" class="lucide lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg>
                        </div>
                        <p className='hidden md:col-start-2 md:col-span-2 md:flex md:items-center md:justify-center'>Profile</p>
                    </div>
                </div>
                {/** Profile : End*/}
            </div>

            {/** Second | Row */}
            <div className="row-span-11 md:col-span-3 md:h-screen
      grid grid-rows-12">
                {/**Suggestion: Start */}
                <div className='row-start-1 row-end-11
        grid grid-rows-12 p-5  '>
                    {/**Box: Start */}
                    <div className='hidden row-start-1 row-span-2 '></div>
                    {/**Box: End */}

                    {/**Box: Start */}
                    <div className='row-start-3 row-span-2  flex items-center justify-center border border-gray-400'>.
                        <svg className="w-1/4" width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-left w-2/4">
                            I have a specific question about my medical condition related to nutrition
                        </p>
                        <svg className="w-1/4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" class="lucide lucide-chevron-right">
                            <path d="m9 18 6-6-6-6" /></svg>
                    </div>
                    {/**Box: End */}


                    {/**Box: Start */}
                    <div className='row-start-5 row-span-2  flex items-center justify-center border-gray-400 border-l border-r border-b'>.
                        <svg className="w-1/4" width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-left w-2/4">
                            I have a specific question about my medical condition related to nutrition
                        </p>
                        <svg className="w-1/4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" class="lucide lucide-chevron-right">
                            <path d="m9 18 6-6-6-6" /></svg>
                    </div>
                    {/**Box: End */}

                    {/**Box: Start */}
                    <div className='row-start-7 row-span-2  flex items-center justify-center border-gray-400 border-l border-r border-b'>.
                        <svg className="w-1/4" width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-left w-2/4">
                            I have a specific question about my medical condition related to nutrition
                        </p>
                        <svg className="w-1/4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" class="lucide lucide-chevron-right">
                            <path d="m9 18 6-6-6-6" /></svg>
                    </div>
                    {/**Box: End */}

                    {/**Box: Start */}
                    <div className='row-start-9 row-span-2  flex items-center justify-center border-gray-400 border-l border-r border-b'>.
                        <svg className="w-1/4" width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-left w-2/4">
                            I have a specific question about my medical condition related to nutrition
                        </p>
                        <svg className="w-1/4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" class="lucide lucide-chevron-right">
                            <path d="m9 18 6-6-6-6" /></svg>
                    </div>
                    {/**Box: End */}


                </div>
                {/**Suggestion: End */}

                {/**ChatBox: Start */}
                <div className='row-start-11 flex items-center justify-center'>
                    <div className='flex w-2/3 h-full items-center justify-center'>

                        <input placeholder='Ask me question' className='w-3/5' />
                        <svg className='w-1/5' xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            class="lucide lucide-send">
                            <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                    </div>
                </div>
                {/**ChatBox: End */}
                {/** */}
                <div className='row-start-12 flex items-center justify-center'>Wonder to have sth here !</div>
            </div>
        </main>
    );
}

export default Chat