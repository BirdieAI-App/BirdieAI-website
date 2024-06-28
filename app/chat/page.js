"use client";
import React, { useState } from "react";
import Chat from "@/components/Chat";

const ChatPage = () => {
  const [isChecked, setIsChecked] = useState(true);
  function onClickHandler(event) {
    event.preventDefault();
    setIsChecked(true);
  }
  return (
    <Chat />
  )
}

export default ChatPage;
