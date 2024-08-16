import MessageChannel from "./MessageChannel";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import db from "@/lib/db";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  params: { channelid: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: Props): Promise<Partial<Metadata>> {
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

    return {
      title: `Join ${data && data.owner.name}'s Carpool`,
      description: data && data.description,
    };
  } catch (error) {
    console.error("An error occurred while fetching the channel data:", error);
    return {
      title: "Error Loading Channel",
    };
  }
}

const Page = ({ params }: {params: {channelid: string}}) => {
  return <MessageChannel channelid={params.channelid} />;
};

export default Page;
