import React from 'react';

const ChatMessage = ({ payload, session }) => {
  console.log(payload);
  console.log(session);
  return (
    <div className="">
      {payload.prompt}
      <br />
      {payload.response}
    </div>
  );
};

export default ChatMessage;