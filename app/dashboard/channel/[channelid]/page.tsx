"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import ChatInput from "./chatInput";
import MessageList, { MessageInterface } from "./messageList";

const MessageChannel = () => {
  const [messages, setMessages] = useState([] as MessageInterface[]);
  const { channelid } = useParams<{ channelid: string }>();

  return (
    <div
      className="max-w-screen-lg mx-auto flex flex-col"
      style={{ height: "calc(100vh - 4rem)" }}>
      <MessageList
        messages={messages}
        setMessages={setMessages}
        channelId={channelid}
      />
      <div className="my-3">
        <ChatInput
          channelId={channelid}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default MessageChannel;
