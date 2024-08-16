import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getChannelMessages, sendMessage } from "@/service/messageService";
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

export async function GET(request: NextRequest, params: {params: {channelid: string}}) {
  try {
    const session = await auth();
    const {channelid} = params.params;

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");

    if (!channelid) return NextResponse.json({}, {status: 400});
    const messages = await getChannelMessages(parseInt(channelid), session?.user?.id || "", cursor ? parseInt(cursor) : undefined);

    const messagesDto: MessageInterface[] = messages.messages.map((e) => {
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
    return NextResponse.json({messages: messagesDto, nextCursor: messages.nextCursor}, {status: 200});
  } catch(e) {
    console.error(e);
    return NextResponse.json({}, {status: 500});
  }
}