"use client";
import Channel, { ChannelInterface } from "@/components/channel";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface DashboardChannelsListProps {
  filterData?: {
    fromStatus?: { address: string; latitude: number; longitude: number };
    toStatus?: { address: string; latitude: number; longitude: number };
    timeOfDay?: Date;
    womenOnly: boolean;
  };
}

const DashboardChannelsList = ({ filterData }: DashboardChannelsListProps) => {
  const [channels, setChannels] = useState<ChannelInterface[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHasMore(true);
    setOffset(0);
    setChannels([]);
  }, [filterData]);

  const fetchChannels = async () => {
    setLoading(true);
    const params: Record<string, string> = {
      offset: offset.toString(),
    };

    if (filterData) {
      const { fromStatus, toStatus, timeOfDay, womenOnly } = filterData;

      if (fromStatus) {
        params.fromAddress = fromStatus.address;
        params.fromLatitude = fromStatus.latitude.toString();
        params.fromLongitude = fromStatus.longitude.toString();
      }

      if (toStatus) {
        params.toAddress = toStatus.address;
        params.toLatitude = toStatus.latitude.toString();
        params.toLongitude = toStatus.longitude.toString();
      }

      if (timeOfDay) {
        params.timeOfDay = timeOfDay.toISOString();
      }

      if (womenOnly !== undefined) {
        params.womenOnly = womenOnly ? "true" : "false";
      }
    }

    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/channel?${query}`);
    if (!response.ok) {
      setLoading(false);
      setHasMore(false);
      return;
    }
    const data = await response.json();
    if (!data) {
      setHasMore(false);
      setLoading(false);
      return;
    }
    setHasMore(data.channels.length === 10);
    setChannels((prev) => [...prev, ...data.channels]);
    setOffset((prev) => prev + 10);
    setLoading(false);
  };

  return (
    <div>
      {channels.length === 0 && !loading && (
        <div className="mt-6 flex flex-col items-center">
          <h1 className="font-semibold">No posts found</h1>
          <p className="text-muted-foreground">
            Make changes to your filters or create a post
          </p>
        </div>
      )}
      {channels.map((e) => (
        <Channel
          key={e.id}
          id={e.id}
          owner={e.owner}
          createdAt={e.createdAt}
          description={e.description}
          requestStatus={e.requestStatus}
          limit={e.limit}
          members={e.members}
          onDelete={async (channelid) => {
            const response = await fetch("/api/channel/" + channelid, {
              method: "DELETE",
            });
            if (response.ok) {
              setChannels((prevChannels) =>
                prevChannels.filter((channel) => channel.id !== channelid)
              );
            }
          }}
        />
      ))}
      <InfiniteScroll
        next={fetchChannels}
        hasMore={hasMore}
        isLoading={loading}
        threshold={1}>
        {hasMore && (
          <Loader2 className="my-4 h-8 w-8 animate-spin bg-transparent mx-auto" />
        )}
      </InfiniteScroll>
    </div>
  );
};

export default DashboardChannelsList;
