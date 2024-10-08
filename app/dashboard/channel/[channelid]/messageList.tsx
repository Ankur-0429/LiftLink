"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { cn } from "@/lib/utils";
import { ACCOUNT_ROUTE } from "@/routes";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  ElementRef,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChatScroll } from "./useChatScroll";
import { usePageVisibility } from "./usePageVisibility";
import { ChannelInterface } from "@/components/channel";

export interface MessageInterface {
  content: string;
  user: {
    name?: string;
    image?: string;
    id: string;
  };
  createdAt: Date;
  id: number;
}

const Message = ({ message }: { message: MessageInterface }) => {
  const session = useSession();
  const router = useRouter();
  const isUser = session.data?.user?.id === message.user.id;
  return (
    <div
      key={message.id}
      className={cn("flex p-3 gap-x-2", isUser && "flex-row-reverse")}>
      <Avatar
        className="h-10 w-10 cursor-pointer hover:border-2 border-foreground transition"
        onClick={() => {
          router.push(ACCOUNT_ROUTE(message.user.id));
        }}>
        <AvatarImage src={message.user.image} alt={message.user.name} />
        <AvatarFallback>
          {message.user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-x-1">
          <p
            onClick={() => {
              router.push(ACCOUNT_ROUTE(message.user.id));
            }}
            className="font-semibold cursor-pointer hover:underline">
            {message.user.name}
          </p>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-muted-foreground text-xs">
            {moment(message.createdAt).fromNow()}
          </span>
        </div>
        <p className={cn("flex", isUser && "justify-end")}>{message.content}</p>
      </div>
    </div>
  );
};

interface MessageListProps {
  channelId: string;
  messages: MessageInterface[];
  setMessages: Dispatch<SetStateAction<MessageInterface[]>>;
  channel: undefined | ChannelInterface;
}

const MessageList = ({
  channelId,
  messages,
  setMessages,
  channel,
}: MessageListProps) => {
  const [cursor, setCursor] = useState(undefined as number | undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [prevHeight, setPrevHeight] = useState(0);

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const latestMessageIdRef = useRef<null | number>(null);
  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPageVisible = usePageVisibility();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    let param = {};
    if (cursor) {
      param = { cursor };
    }
    const query = new URLSearchParams(param).toString();
    const response = await fetch(`/api/channel/${channelId}/message?${query}`);
    if (!response.ok) {
      setLoading(false);
      setHasMore(false);
      return;
    }
    const data = await response.json();
    if (!data) {
      setHasMore(false);
      setLoading(false);
      return;
    }
    setPrevHeight(chatRef.current?.scrollHeight || 0);
    setMessages((prev) => [...prev, ...data.messages]);
    if (messages.length <= 20) {
      bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }
    setCursor(data.nextCursor);
    setHasMore(data.nextCursor !== undefined);
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      latestMessageIdRef.current = messages[0].id;
    }
  }, [messages]);

  useEffect(() => {
    if (prevHeight > 0 && chatRef.current) {
      const newHeight = chatRef.current.scrollHeight;
      const heightDifference = newHeight - prevHeight;
      chatRef.current.scrollTop += heightDifference;
      setPrevHeight(0);
    }
  }, [messages, prevHeight]);

  useEffect(() => {
    const poll = async () => {
      const latestId = latestMessageIdRef.current as any;
      if (latestId === null) return;
      const newMessages = await fetch(
        "/api/channel/" + channelId + "/message/" + latestId.toString(),
        {
          method: "GET",
        }
      );
      if (!newMessages.ok) {
        setIsPollingEnabled(false);
        return;
      }
      const data = await newMessages.json();
      if (data.messages.length === 0) return;
      setMessages((prevMessages) => [...data.messages, ...prevMessages]);
      latestMessageIdRef.current = data.messages[0].id;
    };
    const startPolling = () => {
      timerIdRef.current = setInterval(poll, 10000);
    };
    const stopPolling = () => {
      clearInterval(timerIdRef.current || undefined);
    };

    if (isPageVisible && isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isPageVisible, isPollingEnabled, channelId, setMessages]);

  useChatScroll({
    chatRef,
    bottomRef,
    count: messages.length,
  });

  const router = useRouter();

  return (
    <div ref={chatRef} className="flex-1 flex flex-col overflow-y-auto">
      {!hasMore && !loading && (
        <div className="border-border border-2 rounded-xl p-3 mt-6">
          <div className="my-3 flex items-center gap-2">
            <div className="flex -space-x-3 *:ring *:ring-background">
              {channel?.members.map((e) => {
                return (
                  <Avatar
                    key={e.image}
                    className="cursor-pointer hover:border-2 border-foreground transition"
                    onClick={() => {
                      router.push(ACCOUNT_ROUTE(e.id));
                    }}>
                    <AvatarImage src={e.image} alt={e.name} />
                    <AvatarFallback>
                      {e.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            <p className="text-muted-foreground">
              {channel && channel.limit - channel.members.length}{" "}
              {channel && channel.limit - channel.members.length === 1 ? "person" : "people"} left
            </p>
          </div>
          <p className="mb-3">{channel?.description}</p>
        </div>
      )}
      {!hasMore && <div className="flex-1" />}
      <InfiniteScroll
        next={fetchMessages}
        hasMore={hasMore}
        isLoading={loading}
        threshold={1}>
        {hasMore && (
          <Loader2 className="my-4 h-8 w-8 animate-spin bg-transparent mx-auto" />
        )}
      </InfiniteScroll>
      <div className="flex flex-col-reverse mt-auto">
        {messages.map((e) => (
          <Message message={e} key={e.id} />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
