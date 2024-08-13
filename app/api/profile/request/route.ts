import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { acceptRequest, getProfileRequests } from "@/service/requestService";
import { ProfileRequestInterface } from "@/app/dashboard/profile/request/requestList";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("cursor");
    const { requests: newRequests, nextCursor } = await getProfileRequests(
      session?.user?.id as string,
      query ? parseInt(query) : undefined,
    );

    const dtoNewRequests: ProfileRequestInterface[] = newRequests.map((e) => {
      return {
        id: e.id,
        description: e.channel.description,
        createdAt: e.createdAt,
        channelId: e.channel.id,
        requestingUser: {
          id: e.user.id,
          name: e.user.name || undefined,
          image: e.user.image || undefined
        },
        participants: e.channel.participants,
        limit: e.channel.participants,
        members: e.channel.members.map((k) => {
          return {
            id: k.id,
            name: k.name || undefined,
            image: k.image || undefined,
          };
        }),
      };
    });
    return NextResponse.json({requests: dtoNewRequests, cursor: nextCursor}, { status: 200 });
  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const requestId = searchParams.get("requestId");
    const channelId = searchParams.get("channelId");
    const userId = searchParams.get("userId");
    await acceptRequest(parseInt(requestId || ""), parseInt(channelId || ""), userId || "", session?.user?.id || "");
    return NextResponse.json({}, { status: 200 });
  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
