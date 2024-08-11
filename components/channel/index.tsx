"use client";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { ACCOUNT_ROUTE, CHANNEL_ROUTE } from "@/routes";
import { cn } from "@/lib/utils";
import { useState } from "react";

type UserType = {
  name?: string;
  image?: string;
  id: string;
};

export interface ChannelInterface {
  owner: UserType;
  id: number;
  members: UserType[];
  limit: number;
  createdAt: Date;
  description: string;
  requestStatus: "PENDING" | "IDLE" | "MEMBER";
}

const Channel = ({
  owner,
  members,
  limit,
  createdAt,
  description,
  requestStatus,
  id
}: ChannelInterface) => {
  const session = useSession();
  const params = useParams<{ profileid: string }>();
  const router = useRouter();

  const [status, setStatus] = useState(requestStatus);

  const isClickableToUserAccountPage =
    params.profileid && params.profileid !== owner.id;

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Avatar
              className={cn(
                "h-12 w-12",
                isClickableToUserAccountPage && "cursor-pointer"
              )}
              onClick={() => {
                if (!isClickableToUserAccountPage) return;
                router.push(ACCOUNT_ROUTE(owner.id));
              }}>
              <AvatarImage src={owner.image} alt={owner.name} />
              <AvatarFallback>
                {owner.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="leading-none">
              <p
                onClick={() => {
                  if (!isClickableToUserAccountPage) return;
                  router.push(ACCOUNT_ROUTE(owner.id));
                }}
                className={cn(
                  "font-semibold",
                  isClickableToUserAccountPage &&
                    "cursor-pointer hover:underline"
                )}>
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
                  <Avatar
                    key={e.image}
                    className={cn(
                      isClickableToUserAccountPage && "cursor-pointer"
                    )}
                    onClick={() => {
                      if (!isClickableToUserAccountPage) return;
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
              {limit - members.length}{" "}
              {limit - members.length === 1 ? "person" : "people"} left
            </p>
          </div>
          <p className="mb-3">{description}</p>
          {status === "PENDING" && (
            <Button variant="secondary" className="w-32" onClick={() => {
              setStatus("IDLE");
            }}>
              Requested
            </Button>
          )}
          {status === "IDLE" && (
            <Button onClick={() => {
              const makeRequest = async() => {
                await fetch("/api/channel/" + id.toString() + "/request", {
                  method: "POST"
                })
              };
              makeRequest();
              setStatus("PENDING");
            }} className="w-32">
              Request to Join
            </Button>
          )}
          {status === "MEMBER" && (
            <Button onClick={() => {
              router.push(CHANNEL_ROUTE(id.toString()))
            }} className="w-32">
              Message Group
            </Button>
          )}
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Channel;
