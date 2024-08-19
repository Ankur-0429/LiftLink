"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";

export interface UserInterface {
  name: string;
  image: string;
  createdAt: Date;
  numOwnedChannels: number;
  numJoinedChannels: number;
}

const User = ({
  name,
  image,
  numJoinedChannels,
  numOwnedChannels,
  createdAt,
}: UserInterface) => {
  return (
    <div className="p-3 px-6">
      <div className="flex gap-x-2 items-center mt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="leading-none">
          <p className="font-semibold text-2xl">{name}</p>
          <span className="text-muted-foreground text-lg">
            Joined {moment(createdAt).fromNow()} ago
          </span>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-start gap-x-6">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{numJoinedChannels}</span>
            <p className="text-muted-foreground">Channels Joined</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{numOwnedChannels}</span>
            <p className="text-muted-foreground">Channels Owned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
