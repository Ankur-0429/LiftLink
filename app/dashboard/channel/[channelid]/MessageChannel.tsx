"use client";
import { useEffect, useState } from "react";
import ChatInput from "./chatInput";
import MessageList, { MessageInterface } from "./messageList";
import Channel, { ChannelInterface } from "@/components/channel";
import { Loader2 } from "lucide-react";


const MessageChannel = ({channelid}: {channelid: string}) => {
  const [messages, setMessages] = useState([] as MessageInterface[]);
  const [channel, setChannel] = useState(
    undefined as undefined | ChannelInterface
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/channel?channelId=${channelid}`);
        if (response.ok) {
          const data = await response.json();
          setChannel(data.channels[0] || undefined);
        } else {
          console.error("Failed to fetch channel");
        }
      } catch (error) {
        console.error("An error occurred while fetching channel", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelid]);

  if (loading)
    return (
      <div className="max-w-screen-lg mx-auto">
        <Loader2 className="my-4 h-8 w-8 animate-spin bg-transparent mx-auto" />
      </div>
    );

  if (channel && channel?.requestStatus !== "MEMBER") {
    return (
      <div className="max-w-screen-lg mx-auto border-[1px] flex flex-col mt-32">
        <Channel {...channel} />
      </div>
    );
  } else {
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
  }
};

export default MessageChannel;
