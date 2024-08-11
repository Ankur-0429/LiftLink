import Channel, { ChannelInterface } from "@/components/channel";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const UserChannelsList = ({ userId }: { userId: string }) => {
  const [channels, setChannels] = useState(
    [] as (ChannelInterface & {
      key: number;
    })[]
  );
  const [cursor, setCursor] = useState(undefined as number | undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = React.useState(false);

  const fetchChannels = async () => {
    setLoading(true);
    const response = await fetch(
      "/api/profile/" + userId + "/channel" + "?cursor=" + cursor
    );
    if (!response.ok) return;
    const data = await response.json();
    setChannels((prev) => [...prev, ...data.channels]);
    setCursor(data.cursor);
    setHasMore(data.cursor !== undefined);
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (hasMore) {
      fetchChannels();
    }
  };

  return (
    <div>
      {channels.map((e) => {
        return (
          <Channel
            owner={e.owner}
            createdAt={e.createdAt}
            description={e.description}
            ifRequestedAlready={e.ifRequestedAlready}
            limit={e.limit}
            members={e.members}
            key={e.key}
          />
        );
      })}
      <InfiniteScroll
        hasMore={hasMore}
        next={handleLoadMore}
        isLoading={loading}
        threshold={1}>
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin bg-transparent mx-auto" />}
      </InfiniteScroll>
    </div>
  );
};

export default UserChannelsList;
