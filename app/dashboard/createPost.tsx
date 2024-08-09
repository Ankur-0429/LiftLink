"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

const CreatePost = () => {
  const session = useSession();
  return (
    <div className="bg-background cursor-pointer py-2 px-3 rounded-full flex justify-between items-center">
      <div className="flex items-center gap-x-3">
      <Avatar>
        <AvatarImage
          src={session.data?.user?.image || undefined}
          alt={session.data?.user?.name || undefined}
        />
        <AvatarFallback>
          {session.data?.user?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-muted-foreground">Create a Carpool</p>
      </div>
      <Plus />
    </div>
  );
};

export default CreatePost;
