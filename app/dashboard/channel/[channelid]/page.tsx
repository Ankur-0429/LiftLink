"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ACCOUNT_ROUTE } from "@/routes";
import { Send } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export interface MessageInterface {
  message: string;
  user: {
    name?: string;
    image?: string;
    id: string;
  };
  createdAt: Date;
  id: number;
}

const dummyData: MessageInterface[] = [
  {
    message: "hello",
    user: {
      name: "Gerald",
      image: "g",
      id: "3000",
    },
    createdAt: new Date(),
    id: 1
  },
];

const MessageChannel = () => {
  const router = useRouter();
  const session = useSession();
  const [message, setMessage] = useState("");
  const params = useParams<{channelid: string}>();
  const [messages, setMessages] = useState(dummyData);

  // Generates a unique id
  // Used to push message from user optimistically
  function generateUniqueId(ids:number[]) {
    return ids.reduce((acc, id) => acc + id, 0) % Number.MAX_SAFE_INTEGER;
  }
  

  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      {messages.map((e) => {
        const isUser = session.data?.user?.id === e.user.id;
        return (
          <div key={e.id} className={cn("flex p-3 gap-x-2", isUser && "flex-row-reverse")}>
            <Avatar
              className="h-10 w-10 cursor-pointer hover:border-2 border-foreground transition"
              onClick={() => {
                router.push(ACCOUNT_ROUTE(e.user.id));
              }}>
              <AvatarImage src={e.user.image} alt={e.user.name} />
              <AvatarFallback>
                {e.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-x-1">
                <p
                  onClick={() => {
                    router.push(ACCOUNT_ROUTE(e.user.id));
                  }}
                  className="font-semibold cursor-pointer hover:underline">
                  {e.user.name}
                </p>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-muted-foreground text-xs">
                  {moment(e.createdAt).fromNow()}
                </span>
              </div>
              <p className={cn("flex", isUser && "justify-end")}>{e.message}</p>
            </div>
          </div>
        );
      })}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3">
        <div className="max-w-screen-lg mx-auto">
          <form
            className="relative h-10 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const uniqueId = generateUniqueId(messages.map(e => e.id))
              fetch("/api/channel/" + params.channelid + "/message", {
                method: "POST",
                body: JSON.stringify({
                  content: message,
                })
              }).then((response) => {
                if (!response.ok) {
                  setMessages((e) => e.filter((item)=>item.id !== uniqueId))
                }
              });

              const newMessage: MessageInterface = {
                id: uniqueId,
                user: {
                  name: session.data?.user?.name || "",
                  image: session.data?.user?.image || "",
                  id: session.data?.user?.id || ""
                },
                message: message,
                createdAt: new Date()
              };
              setMessages([...messages, newMessage]); 
            }}>
            <Button
              disabled={message.length === 0}
              type="submit"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-500 z-10"
              variant="ghost">
              <Send />
            </Button>
            <Input
              type="text"
              placeholder="Send a Message"
              className="py-2 text-md w-full border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent" // Add additional styling as needed
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageChannel;
