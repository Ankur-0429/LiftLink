"use client";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import { Delete, EllipsisVertical, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { ACCOUNT_ROUTE, CHANNEL_ROUTE } from "@/routes";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RWebShare } from "react-web-share";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type UserType = {
  name?: string;
  image?: string;
  id: string;
};

export interface ChannelInterface {
  owner: UserType;
  id: number;
  members: UserType[];
  from: string;
  to: string;
  departure: Date;
  limit: number;
  createdAt: Date;
  description: string;
  requestStatus: "PENDING" | "IDLE" | "MEMBER" | "EXPIRED" | "FULL";
}

const Channel = ({
  owner,
  members,
  limit,
  createdAt,
  description,
  requestStatus,
  id,
  onDelete,
}: ChannelInterface & {
  onDelete: (channelId:number) => void;
}) => {
  const params = useParams<{ profileid: string }>();
  const router = useRouter();
  const session = useSession();

  const [status, setStatus] = useState(requestStatus);

  const isClickableToUserAccountPage =
    !params.profileid || params.profileid !== owner.id;

  const shareData = {
    title: `Join ${owner.name}'s Carpool`,
    text: "Share Link",
    url: process.env.NEXT_PUBLIC_BASE_URL + "/dashboard/channel/" + id,
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Avatar
              className={cn(
                "h-12 w-12",
                isClickableToUserAccountPage &&
                  "cursor-pointer hover:border-2 border-foreground transition"
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
          {session.data?.user?.id === owner.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="text-muted-foreground hover:bg-gray-300 transition p-2 rounded-full cursor-pointer">
                  <EllipsisVertical size={20} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => {onDelete(id)}}>
                    <Delete className="mr-2 h-4 w-4" />
                    <span>Delete Post</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="ml-12">
          <div className="my-3 flex items-center gap-2">
            <div className="flex -space-x-3 *:ring *:ring-background">
              {members.map((e) => {
                return (
                  <Avatar
                    key={e.image}
                    className={cn(
                      isClickableToUserAccountPage &&
                        "cursor-pointer hover:border-2 border-foreground transition"
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
          <div className="flex items-center gap-x-3">
            {status === "PENDING" && (
              <Button variant="secondary" className="w-32 cursor-default">
                Requested
              </Button>
            )}
            {status === "EXPIRED" && (
              <Button variant="secondary" className="w-32 cursor-default">
                EXPIRED
              </Button>
            )}
            {status === "IDLE" && (
              <Button
                onClick={() => {
                  const makeRequest = async () => {
                    await fetch("/api/channel/" + id.toString() + "/request", {
                      method: "POST",
                    });
                  };
                  makeRequest();
                  setStatus("PENDING");
                }}
                className="w-32">
                Request to Join
              </Button>
            )}
            {status === "MEMBER" && (
              <Button
                variant="outline"
                onClick={() => {
                  router.push(CHANNEL_ROUTE(id.toString()));
                }}
                className="w-32">
                Message Group
              </Button>
            )}

            <RWebShare data={shareData}>
              <Share2 size="20" />
            </RWebShare>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Channel;
