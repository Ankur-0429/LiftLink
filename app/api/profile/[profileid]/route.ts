import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findChannelsByOwner, findUserById } from "@/service/userService";
import { UserInterface } from "@/app/dashboard/profile/[profileid]/User";

export async function GET(
  request: NextRequest,
  params: { params: { profileid: string } }
) {
  try {
    const { profileid } = params.params;
    const data = await findUserById(profileid);
    if (!data) {
      return NextResponse.json({}, {status: 404});
    }
    const final:UserInterface = {
      name: data.name || "",
      image: data.image || "",
      numJoinedChannels: data._count.memberChannels,
      numOwnedChannels: data._count.ownedChannels,
      createdAt: data.createdAt
    }
    return NextResponse.json(final, {status: 200});
  } catch (e) {}
}