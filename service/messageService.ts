import db from "@/lib/db"

export const sendMessage = async (channelId: number, currentUserId: string, content: string) => {
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
        throw new Error("Message Not Allowed")
    }
    
    const result = await db.message.create({
        data: {
            content,
            channelId,
            userId: currentUserId
        }
    });
    return result;   
}