import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createChannel, findChannel } from "@/service/channelService";
import { auth } from "@/auth";
import { ChannelInterface } from "@/components/channel";
import {z} from "zod"

const channelSchema = z.object({
  description: z.string(),
  departure: z.date(),
  from: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
  }),
  to: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
  }),
  womenOnly: z.boolean(),
  participants: z.number(),
  ownerId: z.string(),
});

export type Channel = z.infer<typeof channelSchema>;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    body["ownerId"] = session?.user?.id;
    body["departure"] = new Date(body["departure"]);
    const parsedData = channelSchema.parse(body);
    await createChannel(parsedData);
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") || "0");
  const departure = searchParams.get("timeOfDay");
  const womenOnly = searchParams.get("womenOnly");
  const isWomenOnly = womenOnly === "true";
  const fromLatitude = searchParams.get("fromLatitude");
  const toLatitude = searchParams.get("toLatitude");
  const fromLongitude = searchParams.get("fromLongitude");
  const toLongitude = searchParams.get("toLongitude");
  const id = searchParams.get("channelId");

  let fromLocation = undefined;
  if (fromLatitude && fromLongitude) {
    fromLocation = {
      latitude: parseFloat(fromLatitude),
      longitude: parseFloat(fromLongitude),
    };
  }
  let toLocation = undefined;
  if (toLatitude && toLongitude) {
    toLocation = {
      latitude: parseFloat(toLatitude),
      longitude: parseFloat(toLongitude),
    };
  }
  const currentUserId = session?.user?.id || "0";

  try {
    const data = await findChannel(currentUserId, isWomenOnly, offset, fromLocation, toLocation, departure || undefined, parseInt(id || "") || undefined)
    if (!data) {
      return NextResponse.json({ channels: [] }, { status: 200 }); 
    }
    const channelDto: ChannelInterface[] = data.map((e) => {
      const isMember = e?.members && e.members.some((member) => member.id === session?.user?.id);

      let requestStatus: "IDLE" | "PENDING" | "MEMBER" = "IDLE";

      if (isMember) {
        requestStatus = "MEMBER";
      }   else if (e?.requests && e?.requests.length > 0) {
        requestStatus = "PENDING";
      }
      return {
        description: e?.description || "",
        id: e?.id || 0,
        createdAt: e?.createdAt || new Date(),
        limit: e?.participants || 0,
        members: e?.members?.map((e) => {
          return {
            name: e.name || undefined,
            id: e.id || "",
            image: e.image || undefined
          }
        }) || [],
        owner: {
          name: e?.owner.name || undefined,
          id: e?.owner.id || "",
          image: e?.owner.image || undefined
        },
        requestStatus,
      }
    })

    return NextResponse.json({ channels: channelDto }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
