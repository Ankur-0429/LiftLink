import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findChannelsByOwner } from "@/service/userService";
import { ChannelInterface } from "@/components/channel";

export async function GET(request: NextRequest, params: {params: {profileid: string}}) {
  try {
    const session = await auth();
    const {profileid} = params.params;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("cursor");
    const { channels: newChannels, nextCursor } = await findChannelsByOwner(
      profileid,
      session?.user?.id as string,
      query ? parseInt(query) : undefined,
    );


    const dtoNewChannels: ChannelInterface[] = newChannels.map((e) => {
      const isMember = e.members.some((member) => member.id === session?.user?.id);

      let requestStatus: "IDLE" | "PENDING" | "MEMBER" = "IDLE";

      if (isMember) {
        requestStatus = "MEMBER";
      }   else if (e.requests.length > 0) {
        requestStatus = "PENDING";
      }
      return {
        id: e.id,
        description: e.description,
        createdAt: e.createdAt,
        requestStatus,
        limit: e.participants,
        owner: {
          id: e.owner.id,
          name: e.owner.name || undefined,
          image: e.owner.image || undefined,
        },
        members: e.members.map((k) => {
          return {
            id: k.id,
            name: k.name || undefined,
            image: k.image || undefined,
          };
        }),
      };
    });
    return NextResponse.json({channels: dtoNewChannels, cursor: nextCursor}, { status: 200 });
  } catch(error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
