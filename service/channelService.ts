import db from "@/lib/db";
import { Channel } from "@/type";

/**
 * 
 * Create a new channel owned by one user
 * User is a member of this channel
 * because they own this channel.
 * @param channel 
 * @returns 
 */
export async function createChannel(channel: Channel) {
  return await db.channel.create(channel);
}