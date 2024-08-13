"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ACCOUNT_ROUTE } from "@/routes";
import { Dot } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MessageInterface {
  message: string;
  user: {
    name?: string;
    image?: string;
    id: string;
  };
  createdAt: Date;
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
  },
];

const MessageChannel = () => {
  const router = useRouter();
  const session = useSession();
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setKeyboardOffset(
        window.innerHeight < document.documentElement.clientHeight ? 300 : 0
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      {dummyData.map((e) => {
        const isUser = session.data?.user?.id === e.user.id;
        return (
          <div className={cn("flex p-3 gap-x-2", isUser && "flex-row-reverse")}>
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
          <Textarea placeholder="Type your message..." />
        </div>
      </div>
    </div>
  );
};

export default MessageChannel;
