import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteUserById, findChannelsByOwner, findUserById } from "@/service/userService";
import { UserInterface } from "@/app/dashboard/profile/[profileid]/User";

export async function DELETE(
  request: NextRequest,
  params: { params: { profileid: string } }
) {
  const {profileid} = params.params;
  const session = await auth();
  if (session?.user?.id !== profileid) {
    return NextResponse.json({}, {status: 400})
  }
  await deleteUserById(profileid)
  return NextResponse.json({}, {status: 200});
}

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