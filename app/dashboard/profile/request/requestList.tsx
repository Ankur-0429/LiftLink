"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ACCOUNT_ROUTE, CHANNEL_ROUTE } from "@/routes";
import { EllipsisVertical } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileRequestProps {
  requestingUser: {
    name?: string;
    image?: string;
    id: string;
  };
  members?: {
    name?: string;
    image?: string;
    id: string;
  }[];
  createdAt: Date;
  participants: number;
  description: string;
  channelId: string;
  id: string;
}

const ProfileRequest = (request: ProfileRequestProps) => {
  const router = useRouter();
  return (
    <div className="p-4">
      <div className="flex items-center gap-x-3">
        <Avatar
          className="h-12 w-12 cursor-pointer hover:border-foreground border-2 transition"
          onClick={() => {
            router.push(ACCOUNT_ROUTE(request.requestingUser.id));
          }}>
          <AvatarImage
            src={request.requestingUser.image}
            alt={request.requestingUser.name}
          />
          <AvatarFallback>
            {request.requestingUser.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="leading-none">
          <p>
            <span className="font-semibold hover:underline cursor-pointer">{request.requestingUser.name}</span>{" "}
            requests to join your carpool.
          </p>
          <span className="text-muted-foreground text-xs">
            {moment(request.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div onClick={() => {
        router.push(CHANNEL_ROUTE(request.channelId))
      }} className="ml-12 border-border border-2 my-3 rounded-lg cursor-pointer hover:bg-muted transition">
        <div className="p-2 flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3 *:ring *:ring-background">
                {request.members &&
                  request.members.map((e) => {
                    return (
                      <Avatar
                        key={e.image}
                        className="cursor-pointer hover:border-2 border-foreground transition"
                        onClick={(event) => {
                          event.stopPropagation();
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
                {request.participants - (request?.members?.length || 0)}{" "}
                {request.participants - (request?.members?.length || 0) === 1
                  ? "person"
                  : "people"}{" "}
                left
              </p>
            </div>
            <div className="text-muted-foreground">
              <EllipsisVertical size={20} />
            </div>
          </div>

          <p className="ml-12">{request.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-3 ml-auto justify-end">
        <Button className="w-32" variant="destructive">
          Reject
        </Button>
        <Button className="w-32">Accept</Button>
      </div>
    </div>
  );
};

const ProfileRequestList = () => {
  const [requests, setRequests] = useState([] as ProfileRequestProps[]);
  useEffect(() => {
    setRequests([
      {
        channelId: "3",
        description: "Hi everyone,I hope this message finds you well! I’m reaching out to see if anyone is interested in carpooling with me to the conference downtown next week. The event will be held at the City Convention Center from Monday, August 14th through Friday, August 18th, and I’m looking to share a ride to make the commute more enjoyable and eco-friendly.If you’re interested, please let me know your preferred pickup location and any specific timing preferences you might have. I’m happy to adjust my schedule to make this work for everyone involved. I’d love to coordinate with a few people to make the drive more pleasant and perhaps even discuss some of the sessions and speakers we’re looking forward to during the conference.Additionally, if you have any questions or suggestions about the carpool arrangement, feel free to reach out. I’m looking forward to hearing from you and hopefully making our daily commutes a little bit easier!",
        id: "8",
        participants: 5,
        members: [{ id: "30", name: "Gilbert", image: "test" }],
        requestingUser: { id: "7", name: "Gilbert", image: undefined },
        createdAt: new Date(),
      },
    ]);
  }, []);
  return requests.map((e) => {
    return (
      <>
      <ProfileRequest
        key={e.id}
        requestingUser={e.requestingUser}
        channelId={e.channelId}
        description={e.description}
        id={e.id}
        participants={e.participants}
        members={e.members}
        createdAt={e.createdAt}
      />
      <Separator />
      </>
    );
  });
};

export default ProfileRequestList;
