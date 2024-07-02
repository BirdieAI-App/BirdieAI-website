"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import config from '@/config';
import { useRouter } from 'next/navigation';
import ButtonAccount from './ButtonAccount';
import Link from "next/link";
// import ButtonAccount from './ButtonAccount';

const Chat = () => {
    // const [isChecked, setIsChecked] = useState(false);
    const { data: session, status } = useSession();
    // isHidden is variable used to toggle Suggestion Part
    const [isHidden, setIsHidden] = useState(false);
    const router = useRouter();
    const suggestions = ["I have a specific question about my medical condition related to nutrition",
        "I have a specific question about my medical condition related to nutrition",
        "I have a specific question about my medical condition related to nutrition",
        "I have a specific question about my medical condition related to nutrition"];

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
        setIsHidden(true);
    }

    return (
        <main
            className="main grid grid-rows-12 h-screen w-screen
     md:grid md:grid-cols-5 md:h-screen md:w-screen"
        >
            {/**First | Left */}
            <div
                className="row-span-1 md:col-span-1 pt-5
       md:grid md:grid-rows-12 md:h-screen md:pl-5 md:pr-5 md:pt-5"
            >
                {/** Mobile : start*/}
                <div className="flex items-center justify-center md:hidden">
                    <svg
                        className="w-1/3 md:hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        S
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        class="lucide lucide-square-plus"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                    </svg>
                    <Link href="/" className='object-contain md:hidden'>
                    <img
                        className="h-20 w-full"
                        src="../icon.png"
                    />
                    </Link>
                    <div className='md:hidden'>
                    <ButtonAccount />
                    </div>
                    
                </div>
                {/** Mobile : End*/}

                {/** New Chat : Start*/}
                <div className="hidden md:flex md:justify-center md:items-center">
                    <div
                        className="md:col-start-1 md:col-span-1 md:flex md:items-center md:justify-center md:w-full 
          md:p-4 bg-green-500 md:rounded-sm"
                    >
                        <svg
                            className="md:text-[12px] md:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            S
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            class="lucide lucide-square-plus"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M8 12h8" />
                            <path d="M12 8v8" />
                        </svg>
                        <p className="md:col-start-2 md:col-span-3 md:flex md:items-center md:justify-center md:pl-3 md:text-[12px] md:text-white">
                            New Chat
                        </p>
                    </div>
                </div>
                {/** New Chat : End*/}

                {/** Previous Chat : Start*/}
                <div className="hidden md:row-start-2 row-span-1 md:flex md:justify-center md:items-center">
                    <div
                        className="md:col-start-1 md:col-span-1 md:flex md:justify-start md:items-start md:w-full 
          md:p-4"
                    >
                        <p className="md:col-start-2 md:col-span-3 md:flex md:items-center md:justify-center md:pl-3 md:text-[12px]">
                            Previous Chat
                        </p>
                    </div>
                </div>
                {/** Previous Chat : End*/}

                {/** Upgrade Account : Start*/}
                <div className="hidden md:row-start-3 row-span-1 md:block">
                    <div
                        className="md:col-start-1 md:col-span-1 md:flex md:flex-col md:justify-start md:items-start md:w-full 
          md:p-4"
                    >
                        <p className="md:pl-3 md:text-[12px]">Upgrade Account</p>
                        <small className="md:pl-3 md:text-[12px]">
                            You have use 0 of 3 free chat
                        </small>
                    </div>
                </div>
                {/** Upgrade Account : End*/}

            </div>

            {/** Second | Row */}
            <div className="row-span-11 grid grid-rows-12 md:col-span-3 md:h-screen">
                <div className="flex flex-row mt-5 items-center justify-center">
                    <Link className='object-contain hidden md:block' href="/">
                    <img className=" h-20 w-full" src="../icon.png" />
                    </Link>
                </div>
                
                {/**Suggestion: Start */}
                <div
                    className={`${isHidden ? 'hidden':''} row-start-2 row-end-11
        grid grid-rows-12 p-5 md:p-20`}
                >
                    {/**Box: Start */}
                    <div className="hidden row-start-1 row-span-2 "></div>
                    {/**Box: End */}
                    <div>
                        {suggestions?.map((item) => {
                            return (
                                <div className="row-start-3 row-span-2 mt-4 flex items-center justify-center border border-gray-400 rounded-lg p-6">
                                    <svg
                                        className="w-1/4"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5"
                                            stroke="#7CD2EB"
                                            stroke-miterlimit="16"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    <p className="text-left w-3/4">
                                        {item}
                                    </p>
                                </div>
                            )
                        })}

                        {/**Box: End */}
                    </div>
                    {/**Box: Start */}

                    {/**Box: End */}
                </div>
                {/**Suggestion: End */}

                {/**ChatBox: Start */}
                <div className="row-start-11 flex items-center justify-center">
                    <div className="flex w-5/6 h-full items-center justify-center border border-gray-400 rounded-lg">
                        <input
                            placeholder="Ask me question"
                            className="w-4/5 focus:outline-none h-full"
                        />
                        <svg
                            className="w-1/5 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            class="lucide lucide-send"
                            onClick={onClickHandler}
                        >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                        </svg>
                    </div>
                </div>
                {/**ChatBox: End */}
                {/** */}
                <div className="row-start-12 flex items-center justify-center">
                    Wonder to have sth here !
                </div>
            </div>
            <div
                className="row-span-1 md:col-span-1 pt-5
       md:grid md:grid-rows-12 md:h-screen md:pl-5 md:pr-5 md:pt-5 hidden md:block"
            >
                <ButtonAccount />
            </div>
        </main>
    );
}

export default Chat