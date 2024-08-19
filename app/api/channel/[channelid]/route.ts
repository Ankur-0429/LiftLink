import { auth } from "@/auth";
import { DeleteChannelById } from "@/service/channelService";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  params: { params: { channelid: string } }
) {
  const session = await auth();
  const { channelid } = params.params;

  try {
    await DeleteChannelById(parseInt(channelid), session?.user?.id || "");
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 500 });
  }
}
