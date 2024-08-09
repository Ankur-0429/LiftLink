"use client";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

type UserType = {
  name?: string;
  image?: string;
};

interface ChannelInterface {
  owner: UserType;
  members: UserType[];
  limit: number;
  createdAt: Date;
  description: string;
  ifRequestedAlready: boolean;
}

const Channel = ({
  owner,
  members,
  limit,
  createdAt,
  description,
  ifRequestedAlready,
}: ChannelInterface) => {
  const [ifRequested, setIfRequested] = useState(ifRequestedAlready);
  const toggleRequest = () => {
    setIfRequested(!ifRequested);
  }
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={owner.image} alt={owner.name} />
              <AvatarFallback>
                {owner.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="leading-none">
              <p className="font-semibold cursor-pointer hover:underline">
                {owner.name}
              </p>
              <span className="text-muted-foreground text-xs">
                {moment(createdAt).fromNow()}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground">
            <EllipsisVertical size={20} />
          </div>
        </div>
        <div className="ml-12">
          <div className="my-3 flex items-center gap-2">
            <div className="flex -space-x-3 *:ring *:ring-background">
              {members.map((e) => {
                return (
                  <Avatar key={e.image}>
                    <AvatarImage src={e.image} alt={e.name} />
                    <AvatarFallback>
                      {e.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            <p className="text-muted-foreground">
              {limit - members.length}{" "}
              {limit - members.length === 1 ? "person" : "people"} left
            </p>
          </div>
          <p className="mb-3">{description}</p>
          {ifRequested ? (
            <Button variant="secondary" className="w-32" onClick={toggleRequest}>Requested</Button>
          ) : (
            <Button onClick={toggleRequest} className="w-32">Request to Join</Button>
          )}
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Channel;
