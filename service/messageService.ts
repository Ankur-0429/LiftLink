import db from "@/lib/db";

export const sendMessage = async (
  channelId: number,
  currentUserId: string,
  content: string
) => {
  const count = await db.channel.count({
    where: {
      id: channelId,
      members: {
        some: {
          id: currentUserId,
        },
      },
    },
  });

  if (count === 0) {
    throw new Error("Message Not Allowed");
  }

  const result = await db.message.create({
    data: {
      content,
      channelId,
      userId: currentUserId,
    },
  });
  return result;
};

export const getChannelMessages = async (
  channelId: number,
  currentUserId: string,
  cursor?: number,
  limit: number = 20
) => {
  const isMember = await db.channel.findFirst({
    where: {
      id: channelId,
      members: {
        some: {
          id: currentUserId,
        },
      },
    },
  });

  if (!isMember) {
    throw new Error("User is not a member of the channel");
  }

  const messages = await db.message.findMany({
    select: {
      id: true,
      content: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      createdAt: true,
    },
    where: {
      channelId: channelId,
      ...(cursor
        ? {
            id: {
              lt: cursor,
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit + 1,
  });
  let nextCursor: number | undefined = undefined;
  if (messages.length > limit) {
    const nextItem = messages.pop();
    nextCursor = nextItem!.id;
  }

  return {
    messages,
    nextCursor,
  };
};

/**
 * Fetches all new messages in a channel since a specific messageId, excluding that messageId itself.
 * 
 * @param channelId - The ID of the channel.
 * @param messageId - The ID of the message to exclude.
 * @param currentUserId - The ID found from session
 * @returns A promise that resolves to an array of new messages.
 */
export async function getNewMessagesSince(channelId: number, messageId: number, currentUserId: string) {
  try {
    const isMember = await db.channel.findFirst({
      where: {
        id: channelId,
        members: {
          some: {
            id: currentUserId,
          },
        },
      },
    });
  
    if (!isMember) {
      throw new Error("User is not a member of the channel");
    }
    const newMessages = await db.message.findMany({
      where: {
        channelId: channelId,
        id: {
          gt: messageId,
        },
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return newMessages;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to fetch new messages.');
  }
}