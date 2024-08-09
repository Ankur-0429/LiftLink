import db, { Channel } from "@/lib/db";

/**
 * 
 * Create a new channel owned by one user
 * User is approved to send messages
 * because they own this channel.
 * @param channel 
 * @returns 
 */
export async function createChannel(channel: Channel) {
  return await db.channel.create(channel);
}