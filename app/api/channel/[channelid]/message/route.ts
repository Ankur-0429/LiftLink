import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendMessage } from "@/service/messageService";
import { MessageInterface } from "@/app/dashboard/channel/[channelid]/page";

export async function POST(request: NextRequest, params: {params: {channelid: string}}) {
  try {
    const session = await auth();
    const {content} = await request.json();
    const {channelid} = params.params;
    if (!channelid || !content) return NextResponse.json({}, {status: 400})
    await sendMessage(parseInt(channelid), session?.user?.id || "", content);
    return NextResponse.json({}, { status: 201 });
  } catch(error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}