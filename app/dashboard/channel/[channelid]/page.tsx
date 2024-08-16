import type { Metadata, ResolvingMetadata } from "next";
import MessageChannel from "./MessageChannel";
import db from "@/lib/db";

type Props = {
  params: { channelid: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.channelid;
  try {
    const data = await db.channel.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        owner: {
          select: {
            name: true,
          },
        },
        description: true,
      },
    });
    const previousImages = (await parent).openGraph?.images || [];
    
    return {
      title: `Join ${data && data.owner.name}'s Carpool`,
      description: data && data.description,
      openGraph: {
        images: [...previousImages],
      },
    };
  } catch (error) {
    console.error("An error occurred while fetching the channel data:", error);
    return {
      title: "Error Loading Channel",
      openGraph: {
        images: [],
      },
    };
  }
}

const ChannelPage = ({ params }: Props) => {
  return <MessageChannel channelid={params.channelid} />;
};

export default ChannelPage;
