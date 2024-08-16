import { Inter } from "next/font/google";
import type { Metadata, ResolvingMetadata } from "next";
import db from "@/lib/db";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}