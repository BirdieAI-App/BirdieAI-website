"use client"

import React from 'react';
import ButtonAccount from '@/components/ButtonAccount';
import Chat from '@/components/Chat';

const ChatPage = () => {
  return (
    <div>
      <ButtonAccount />
      <Chat />
    </div>
    // <main className='h-screen grid grid-flow-row-dense grid-cols-6'>
    //   <div class="col-span-1 grid grid-rows-10 ">
    //     <div class="row-start-1 row-end-8 flex flex-col items-center">
    //       <button className="btn bg-green-500 w-3/5 my-5 text-white text-center border-1 rounded-[3px] mx-auto">
    //         <p className='text-[12px]'>+</p>
    //         <p className='text-[12px]'>New Chat</p>
    //       </button>
    //       <div className="dropdown dropdown-bottom w-full my-5 text-left border-1 rounded-[3px]">
    //         <div tabIndex={0} role="button" className="btn m-1 font-inter text-12px font-normal leading-[14.52px] text-left text-black">Previous Chat</div>
    //         <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    //           <li><a>Chat A</a></li>
    //           <li><a>Chat B</a></li>
    //         </ul>
    //       </div>
    //       <button className="w-full my-5 text-left border rounded-[3px] tracking-wide btn flex flex-col items-start">
    //         <p className="font-inter text-[12px] font-normal leading-[14.52px] text-black">
    //           Upgrade Your Account
    //         </p>
    //         <p className="font-inter text-[12px] font-normal leading-[14.52px]">
    //           You have used {0} of 3 free chats
    //         </p>
    //       </button>
    //     </div>
    //     <div class="row-start-10  flex items-center justify-center space-x-2">
    //       <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    //         <path d="M18 15.5C18.2761 15.5 18.5 15.2761 18.5 15C18.5 14.7239 18.2761 14.5 18 14.5V15.5ZM14.875 14.5C14.5989 14.5 14.375 14.7239 14.375 15C14.375 15.2761 14.5989 15.5 14.875 15.5V14.5ZM11.125 15.5C11.4011 15.5 11.625 15.2761 11.625 15C11.625 14.7239 11.4011 14.5 11.125 14.5V15.5ZM3 14.5C2.72386 14.5 2.5 14.7239 2.5 15C2.5 15.2761 2.72386 15.5 3 15.5V14.5ZM18 10.5C18.2761 10.5 18.5 10.2761 18.5 10C18.5 9.72386 18.2761 9.5 18 9.5V10.5ZM8.625 9.5C8.34886 9.5 8.125 9.72386 8.125 10C8.125 10.2761 8.34886 10.5 8.625 10.5V9.5ZM3 9.5C2.72386 9.5 2.5 9.72386 2.5 10C2.5 10.2761 2.72386 10.5 3 10.5V9.5ZM18 5.5C18.2761 5.5 18.5 5.27614 18.5 5C18.5 4.72386 18.2761 4.5 18 4.5V5.5ZM14.875 4.5C14.5989 4.5 14.375 4.72386 14.375 5C14.375 5.27614 14.5989 5.5 14.875 5.5V4.5ZM11.125 5.5C11.4011 5.5 11.625 5.27614 11.625 5C11.625 4.72386 11.4011 4.5 11.125 4.5V5.5ZM3 4.5C2.72386 4.5 2.5 4.72386 2.5 5C2.5 5.27614 2.72386 5.5 3 5.5V4.5ZM18 14.5H14.875V15.5H18V14.5ZM11.125 14.5H3V15.5H11.125V14.5ZM18 9.5H8.625V10.5H18V9.5ZM5.5 9.5H3V10.5H5.5V9.5ZM18 4.5H14.875V5.5H18V4.5ZM11.125 4.5H3V5.5H11.125V4.5ZM7.5 10C7.5 10.4142 7.16421 10.75 6.75 10.75V11.75C7.7165 11.75 8.5 10.9665 8.5 10H7.5ZM6.75 10.75C6.33579 10.75 6 10.4142 6 10H5C5 10.9665 5.7835 11.75 6.75 11.75V10.75ZM6 10C6 9.58579 6.33579 9.25 6.75 9.25V8.25C5.7835 8.25 5 9.0335 5 10H6ZM6.75 9.25C7.16421 9.25 7.5 9.58579 7.5 10H8.5C8.5 9.0335 7.7165 8.25 6.75 8.25V9.25ZM13.75 15C13.75 15.4142 13.4142 15.75 13 15.75V16.75C13.9665 16.75 14.75 15.9665 14.75 15H13.75ZM13 15.75C12.5858 15.75 12.25 15.4142 12.25 15H11.25C11.25 15.9665 12.0335 16.75 13 16.75V15.75ZM12.25 15C12.25 14.5858 12.5858 14.25 13 14.25V13.25C12.0335 13.25 11.25 14.0335 11.25 15H12.25ZM13 14.25C13.4142 14.25 13.75 14.5858 13.75 15H14.75C14.75 14.0335 13.9665 13.25 13 13.25V14.25ZM13.75 5C13.75 5.41421 13.4142 5.75 13 5.75V6.75C13.9665 6.75 14.75 5.9665 14.75 5H13.75ZM13 5.75C12.5858 5.75 12.25 5.41421 12.25 5H11.25C11.25 5.9665 12.0335 6.75 13 6.75V5.75ZM12.25 5C12.25 4.58579 12.5858 4.25 13 4.25V3.25C12.0335 3.25 11.25 4.0335 11.25 5H12.25ZM13 4.25C13.4142 4.25 13.75 4.58579 13.75 5H14.75C14.75 4.0335 13.9665 3.25 13 3.25V4.25Z" fill="#444444" />
    //       </svg>
    //       <p className='font-inter text-[12px] font-normal leading-[14.52px] text-left text-gray-custom'>Profile Setting</p>
    //     </div>
    //   </div>
    //   <div class="col-start-3 col-end-6 grid grid-rows-4 ">
    //     {
    //       isChecked ? (
    //         <div className="flex flex-col justify-center items-center row-start-2 row-end-4">
    //           <div className="icon">
    //             <img src='../icon.png' class="object-scale-down h-24 w-48 ..." />
    //           </div>
    //           <div className="flex justify-between ">

    //             <div className="flex flex-col rounded-2xl p-4 cursor-pointer border border-transparent hover:border-gray-300">
    //               <svg className="" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
    //                 <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
    //               </svg>
    //               <p className="text-left ">
    //                 I have a specific question about my medical condition related to nutrition
    //               </p>
    //             </div>

    //             <div className="flex flex-col rounded-2xl p-4 cursor-pointer border border-transparent hover:border-gray-300">
    //               <svg className="" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
    //                 <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
    //               </svg>
    //               <p className="text-left ">
    //                 I have a specific question about my medical condition related to nutrition
    //               </p>
    //             </div>

    //             <div className="flex flex-col rounded-2xl p-4 cursor-pointer border border-transparent hover:border-gray-300">
    //               <svg className="" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
    //                 <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
    //               </svg>
    //               <p className="text-left ">
    //                 I have a specific question about my medical condition related to nutrition
    //               </p>
    //             </div>

    //             <div className="flex flex-col rounded-2xl p-4 cursor-pointer border border-transparent hover:border-gray-300">
    //               <svg className="" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
    //                 <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#7CD2EB" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
    //               </svg>
    //               <p className="text-left ">
    //                 I have a specific question about my medical condition related to nutrition
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div>
    //           Div B
    //         </div>)
    //     }

    //     <div className='row-start-6 w-full flex items-center justify-between p-4'>
    //       {/* <img src='../icon.png' class="object-scale-down h-12 w-24 ..." /> */}
    //       {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={onClickHandler}>
    //         Button
    //       </button> */}
    //       <input type="text" placeholder="Ask A Question" className="w-3/4 p-2 focus:outline-none rounded-md" />

    //       <button className='btn' onClick={onClickHandler}>
    //         <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
    //           <path d="M8.99994 3L1.99994 15L8.99994 13.2222L15.9999 15L8.99994 3ZM8.99994 3L8.99994 11.5" stroke="#444444" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
    //         </svg>
    //       </button>
    //     </div>
    //   </div>
    // </main>
  )
};

export default ChatPage;
