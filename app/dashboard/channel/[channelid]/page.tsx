"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ACCOUNT_ROUTE } from "@/routes";
import { Loader2, Send } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
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
      <div className="mt-3">
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
