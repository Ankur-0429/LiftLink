import db from "@/lib/db";

/**
 * Finds channels owned by a specific user with pagination.
 * Also returns if user has already made a request to this channel
 * or if user is already a member of the channel
 * @param userId The ID of the user who owns the channels
 * @param currentUserId The ID of the current user found from session
 * @param cursor The cursor for pagination (optional)
 * @param limit The maximum number of channels to return
 * @returns An object containing the channels and the next cursor
 */
const findChannelsByOwner = async (
  userId: string,
  currentUserId: string,
  cursor?: number,
  limit: number = 10
) => {
  const channels = await db.channel.findMany({
    where: {
      ownerId: userId,
      ...(cursor
        ? {
            id: {
              lt: cursor,
            },
          }
        : {}),
    },
    take: limit + 1,
    select: {
      fromAddress: false,
      toAddress: false,
      departure: false,
      members: true,
      description: true,
      limit: true,
    },
    include: {
      members: true,
      requests: {
        where: {
          userId: currentUserId,
        }
      },
    },
    orderBy: {
      departure: "asc",
    },
  });

  let nextCursor: number | undefined = undefined;
  if (channels.length > limit) {
    const nextItem = channels.pop();
    nextCursor = nextItem!.id;
  }

  return {
    channels,
    nextCursor,
  };
};
