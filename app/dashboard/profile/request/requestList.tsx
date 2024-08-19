"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Separator } from "@/components/ui/separator";
import { ACCOUNT_ROUTE, CHANNEL_ROUTE } from "@/routes";
import { EllipsisVertical, Loader2 } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ProfileRequestInterface {
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
  channelId: number;
  id: number;
}

const ProfileRequest = (
  request: ProfileRequestInterface & {
    acceptRequests: (
      channelId: number,
      requestId: number,
      userId: string
    ) => {};
    rejectRequests: (channelId: number, requestId: number) => {};
  }
) => {
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
            <span className="font-semibold hover:underline cursor-pointer">
              {request.requestingUser.name}
            </span>{" "}
            requests to join your carpool.
          </p>
          <span className="text-muted-foreground text-xs">
            {moment(request.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div
        onClick={() => {
          router.push(CHANNEL_ROUTE(request.channelId.toString()));
        }}
        className="ml-12 border-border border-2 my-3 rounded-lg cursor-pointer hover:bg-muted transition">
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
        <Button
          onClick={() => {
            request.rejectRequests(request.channelId, request.id);
          }}
          className="w-32"
          variant="destructive">
          Reject
        </Button>
        <Button
          onClick={() => {
            request.acceptRequests(
              request.channelId,
              request.id,
              request.requestingUser.id
            );
          }}
          className="w-32">
          Accept
        </Button>
      </div>
    </div>
  );
};

const ProfileRequestList = () => {
  const [requests, setRequests] = useState([] as ProfileRequestInterface[]);
  const [cursor, setCursor] = useState(undefined as number | undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    const response = await fetch("/api/profile/request" + "?cursor=" + cursor);
    if (!response.ok) return;
    const data = await response.json();
    setRequests((prev) => [...prev, ...data.requests]);
    setCursor(data.cursor);
    setHasMore(data.cursor !== undefined);
    setLoading(false);
  };

  const acceptRequests = async (
    channelId: number,
    requestId: number,
    userId: string
  ) => {
    const params = {
      channelId: channelId.toString(),
      requestId: requestId.toString(),
      userId,
    };
    const query = new URLSearchParams(params).toString();
    const requestToRemove = requests.find((item) => item.id === requestId);
    setRequests((prevItems) =>
      prevItems.filter((item) => item.id !== requestId)
    );

    try {
      const response = await fetch("/api/profile/request?" + query, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to accept request");
      }
    } catch (error) {
      if (requestToRemove) {
        setRequests((prevItems) => [requestToRemove, ...prevItems]);
      }
    }
  };

  const rejectRequests = async (channelId: number, requestId: number) => {
    const params = {
      channelId: channelId.toString(),
      requestId: requestId.toString(),
    };
    const query = new URLSearchParams(params).toString();
    const requestToRemove = requests.find((item) => item.id === requestId);
    setRequests((prevItems) =>
      prevItems.filter((item) => item.id !== requestId)
    );

    try {
      const response = await fetch("/api/profile/request?" + query, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to accept request");
      }
    } catch (error) {
      if (requestToRemove) {
        setRequests((prevItems) => [requestToRemove, ...prevItems]);
      }
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      fetchRequests();
    }
  };

  return (
    <div>
      {requests.length === 0 && !loading && (
        <div className="mt-6 flex flex-col items-center">
          <h1 className="font-semibold">No requests found</h1>
          <p className="text-muted-foreground">
            We will notify you if other users request to join your carpool
          </p>
        </div>
      )}
      {requests.map((e) => {
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
              acceptRequests={acceptRequests}
              rejectRequests={rejectRequests}
            />
            <Separator />
          </>
        );
      })}
      <InfiniteScroll
        hasMore={hasMore}
        next={handleLoadMore}
        isLoading={loading}
        threshold={1}>
        {hasMore && (
          <Loader2 className="my-4 h-8 w-8 animate-spin bg-transparent mx-auto" />
        )}
      </InfiniteScroll>
    </div>
  );
};

export default ProfileRequestList;
