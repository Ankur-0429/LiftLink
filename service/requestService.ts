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

      const isMember = channel.members.some(member => member.id === userid);
      if (isMember) throw new Error("Member already exists");

      const memberCount = channel.members.length;
      if (memberCount > channel.members.length) throw new Error("max member limit reached");

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