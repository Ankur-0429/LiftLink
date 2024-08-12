"use client";
import Channel, { ChannelInterface } from "@/components/channel";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const DashboardChannelsList = () => {
  const [channels, setChannels] = useState<ChannelInterface[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(loading);
  }, [loading])
  const fetchChannels = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/channel?offset=${offset}`
    );
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
    setHasMore(data.length < 10)
    setChannels((prev) => [...prev, ...data.channels]);
    setOffset((prev) => prev + 10);
    setLoading(false);
  };

  return (
    <div>
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
        />
      ))}
      <InfiniteScroll
        next={fetchChannels}
        hasMore={hasMore}
        isLoading={loading}
        threshold={1}>
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin bg-transparent mx-auto" />}
      </InfiniteScroll>
    </div>
  );
};

export default DashboardChannelsList;
