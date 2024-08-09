"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const CreatePost = () => {
  const session = useSession();
  return (
    <div className="bg-background py-2 px-3 rounded-full flex items-center gap-x-3">
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
  );
};

export default CreatePost;
