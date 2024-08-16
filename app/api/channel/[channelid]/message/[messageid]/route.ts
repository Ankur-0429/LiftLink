import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNewMessagesSince, sendMessage } from "@/service/messageService";
import { MessageInterface } from "@/app/dashboard/channel/[channelid]/messageList";

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

export async function GET(request: NextRequest, params: {params: {channelid: string, messageid: string}}) {
  try {
    const session = await auth();
    const {channelid, messageid} = params.params;

    if (!channelid || !messageid) return NextResponse.json({}, {status: 400});
    const messages = await getNewMessagesSince(parseInt(channelid), parseInt(messageid), session?.user?.id || "");

    const messagesDto: MessageInterface[] = messages.map((e) => {
      return {
        id: e.id,
        user: {
          name: e.user.name || "",
          id: e.user.id,
          image: e.user.image || "",
        },
        createdAt: e.createdAt,
        content: e.content
      }
    });
    return NextResponse.json({messages: messagesDto}, {status: 200});
  } catch(e) {
    console.error(e);
    return NextResponse.json({}, {status: 500});
  }
}