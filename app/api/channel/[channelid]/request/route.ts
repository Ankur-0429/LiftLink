import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { requestChannel } from "@/service/requestService";

export async function POST(request: NextRequest, params: {params: {channelid: string}}) {
  try {
    const session = await auth();
    const {channelid} = params.params;
    await requestChannel(parseInt(channelid, 10), session?.user?.id || "");
    return NextResponse.json({}, { status: 201 });
  } catch(error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, params: {params: {channelid: string}}) {
  try {
    const session = await auth();
    const {channelid} = params.params;
    await requestChannel(parseInt(channelid, 10), session?.user?.id || "");
    return NextResponse.json({}, { status: 201 });
  } catch(error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
