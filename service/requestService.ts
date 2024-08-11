import db from "@/lib/db";

/**
 * Makes a request by a user to a specific channel.
 * If user is already a member, returns null.
 * If a user already made a request, returns null.
 * @param channelid 
 * @param userid id of user that requests the channel
 */
export const requestChannel = async (channelid: number, userid: string) => {
    try {
      const isMember = await db.channel.findFirst({
        where: {
          id: channelid,
          members: {
            some: {
              id: userid,
            },
          },
        },
      });
  
      if (isMember) {
        return null;
      }
  
      const existingRequest = await db.request.findUnique({
        where: {
          userId_channelId: {
            userId: userid,
            channelId: channelid,
          },
        },
      });
  
      if (existingRequest) {
        return null;
      }
  
      const newRequest = await db.request.create({
        data: {
          userId: userid,
          channelId: channelid,
          status: "PENDING",
        },
      });
  
      return newRequest;
    } catch (error) {
      throw new Error("Error during request service");
    }
  };