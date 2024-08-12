import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createChannel, findChannel } from "@/service/channelService";
import { channelSchema } from "@/type";
import { z } from "zod";
import { auth } from "@/auth";
import { ChannelInterface } from "@/components/channel";

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
  const departure = searchParams.get("departure");
  let timeOfDay = undefined;
  if (departure) {
    timeOfDay = new Date(departure);
  }
  const womenOnly = searchParams.get("womenOnly");
  const isWomenOnly = womenOnly === "true";
  const fromLatitude = searchParams.get("fromLatitude");
  const toLatitude = searchParams.get("toLatitude");
  const fromLongitude = searchParams.get("fromLongitude");
  const toLongitude = searchParams.get("toLongitude");

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
    const data = await findChannel(currentUserId, isWomenOnly, offset, fromLocation, toLocation, timeOfDay)
    const channelDto: ChannelInterface[] = data.map((e) => {
      const isMember = e.members && e.members.some((member) => member.id === session?.user?.id);

      let requestStatus: "IDLE" | "PENDING" | "MEMBER" = "IDLE";

      if (isMember) {
        requestStatus = "MEMBER";
      }   else if (e.user_requests && e.user_requests.length > 0) {
        requestStatus = "PENDING";
      }
      return {
        description: e.description,
        id: e.id,
        createdAt: e.createdAt,
        limit: e.participants,
        members: e.members || [],
        owner: e.owner,
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
