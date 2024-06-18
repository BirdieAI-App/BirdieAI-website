"use client"
import React, { useState } from 'react'

const page = () => {

  const [isChecked, setIsChecked] = useState(false)
  function onClickHandler(event) {
    event.preventDefault();
    setIsChecked(true)
  }

  return (
    <main className='h-screen grid grid-flow-row-dense grid-cols-5'>
      <div class="col-span-1 grid grid-rows-15">
        <div class="row-start-1 row-end-3 bg-yellow-500">
          <div>New Chat</div>
          <div>Previous Chat</div>
          <div>Upgrade your account</div>
        </div>
        <div class="row-start-10 row-end-15 bg-orange-500">Profile Settings</div>
      </div>
      <div class="col-span-4 grid grid-rows-10 ">
        {
          isChecked ? (
            <div className='row-start-1 row-end-8 grid grid-rows-10 bg-pink-500'>
              <div className='row-start-1 row-end-2'>Welcome to Birdie - your diet coach for pregnancy,
                postpartum and infant nutrition needs</div>
              <div className='row-span-1 bg-red-500'>How can I help you today? Here are some ideas</div>
              <div className='row-span-1 bg-purple-500'>I have a specific question about my medical condition related to nutrition </div>
              <div className='row-span-1 bg-gray-500'>I want to have personalized nutrition plan for my condition</div>
              <div className='row-span-1 bg-blue-500'>I want to some recipes tailors to my nutrition needs</div>
              <div className='row-span-1 bg-orange-500'>I want a meal plan for my kids </div>
            </div>
          ) : (
            <div>
              Div B
            </div>)
        }

        <div className='row-start-10 row-end-11 bg-pink-500'>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={onClickHandler}>
            Button
          </button>
        </div>
      </div>
    </main>
  )
}

export default page