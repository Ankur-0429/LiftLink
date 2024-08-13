import db from "@/lib/db";

/**
 * Makes a request by a user to a specific channel.
 * If user is already a member, throws error.
 * If a user already made a request, throws error.
 * If max member limit reached, throws error.
 * @param channelid
 * @param userid id of user that requests the channel
 */
export const requestChannel = async (channelid: number, userid: string) => {
  try {
    const channel = await db.channel.findUnique({
      where: { id: channelid },
      include: {
        members: true,
      },
    });
    if (!channel) throw new Error("Channel not found");

    const isMember = channel.members.some((member) => member.id === userid);
    if (isMember) throw new Error("Member already exists");

    const memberCount = channel.members.length;
    if (memberCount > channel.members.length)
      throw new Error("max member limit reached");

    const existingRequest = await db.request.findUnique({
      where: {
        userId_channelId: {
          userId: userid,
          channelId: channelid,
        },
      },
    });
    if (existingRequest) throw new Error("request already exists");

    const newRequest = await db.request.create({
      data: {
        userId: userid,
        channelId: channelid,
        status: "PENDING",
      },
    });

    return newRequest;
  } catch (error) {
    console.error(error);
    throw new Error("Error during request service");
  }
};

/**
 *
 * @param currentUserId id of the user found from session
 * @param cursor The cursor for pagination (optional)
 * @param limit The maximum number of requests to retur
 * @returns all requests made to this user. Filters out rejected requests
 */
export const getProfileRequests = async (
  currentUserId: string,
  cursor?: number,
  limit: number = 10
) => {
  const requests = await db.request.findMany({
    where: {
      channel: {
        ownerId: currentUserId,
      },
      userId: {
        not: currentUserId,
      },
      status: {
        not: "REJECTED",
      },
      ...(cursor
        ? {
            id: {
              lt: cursor,
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      channel: {
        select: {
          id: true,
          description: true,
          participants: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let nextCursor: number | undefined = undefined;
  if (requests.length > limit) {
    const nextItem = requests.pop();
    nextCursor = nextItem!.id;
  }

  return {
    requests,
    nextCursor,
  };
};

/**
 * 
 * @param requestId 
 * @param channelId 
 * @param userId id of user making the request 
 * @param currentUserId id of the user found from session. Used to confirm that person making this request owns channel
 */
export const acceptRequest = async (requestId: number, channelId: number, userId: string, currentUserId: string) => {
  const channel = await db.channel.findFirst({
    where: {
      id: channelId,
      ownerId: currentUserId,
    },
  });

  if (!channel) {
    throw new Error('You do not have permission to accept this request.');
  }
  
  await db.$transaction(async (prisma) => {
    await prisma.request.delete({
      where: { id: requestId },
    });

    await prisma.channel.update({
      where: { id: channelId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  });
};

/**
 * 
 * @param requestId 
 * @param channelId 
 * @param userId id of user making the request 
 * @param currentUserId id of the user found from session. Used to confirm that person making this request owns channel
 */
export const rejectRequest = async (requestId: number, channelId: number, currentUserId: string) => {
  const channel = await db.channel.findFirst({
    where: {
      id: channelId,
      ownerId: currentUserId,
    },
  });

  if (!channel) {
    throw new Error('You do not have permission to reject this request.');
  }

  await db.request.update({
    where: {
      id: requestId
    },
    data: {
      status: "REJECTED"
    }
  })
};