import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requestChannel } from "@/service/requestService";

export async function POST(params: {channelid: string}) {
  try {
    const session = await auth();
    const {channelid} = params;
    await requestChannel(parseInt(channelid), session?.user?.id || "");
    return NextResponse.json({}, { status: 201 });
  } catch(error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
