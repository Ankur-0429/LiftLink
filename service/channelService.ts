import db from "@/lib/db";
import { Channel } from "@/app/api/channel/route";

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

interface findChannelOutput {
  description: string;
  id: number;
  fromAddress: string;
  toAddress: string;
  members?: {
    id: string;
    name: string;
    image: string;
  }[];
  owner: {
    id: string;
    name: string;
    image: string;
  };
  participants: number;
  requests?: {
    userId: string;
    requestId: number;
  }[];
  womenOnly: boolean;
  createdAt: Date;
  departure: Date;
}

/**
 * Find channels through a variety of filters.
 * Returns the associated channels, including their members,
 * owner, and requests made by session user. Query is paginated,
 * with limit hardcoded to 10 channels.
 * @param currentUserId the id found from session
 * @param womenOnly filters channels for women only
 * @param offset the starting index to query by. Used for pagination
 * @param fromLocation filters by location user wants to carpool from
 * @param toLocation filters by location user wants to go to
 * @param timeOfDay filters by date. Defaults to all channels after current date. Use ISOstring
 * @param channelId id of the channel. Will just return array with one element because id is unique 
 * @returns 
 */
export async function findChannel(
  currentUserId: string,
  womenOnly: boolean,
  offset: number,
  fromLocation?: {
    latitude: number;
    longitude: number;
  },
  toLocation?: {
    latitude: number;
    longitude: number;
  },
  timeOfDay?: string,
  id?: number
) {
  if (id) {
    const data = await db.channel.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        description: true,
        womenOnly: true,
        participants: true,
        createdAt: true,
        fromAddress: true,
        toAddress: true,
        owner: {
          select: {
            id: true,
            image: true,
            name: true,
          }
        },
        members: {
          select: {
            id: true,
            image: true,
            name: true,
          }
        },
        requests: {
          where: {
            userId: currentUserId
          },
          select: {
            userId: true,
            id: true,
          }
        },
        departure: true,
      }
    });
    return [data];
  }
  
  function getNextDay(date: string) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString();
  }
  const bindings: any[] = [currentUserId, womenOnly, offset];

  let query = `
      SELECT c.id, c.description, c."womenOnly", c."participants", c."createdAt", c."departure", c."fromAddress", c."toAddress",
      array_agg(DISTINCT jsonb_build_object('name', m.name, 'image', m.image, 'id', m.id)) AS members,
      jsonb_build_object('name', o.name, 'image', o.image, 'id', o.id) AS owner,
      array_agg(DISTINCT jsonb_build_object('requestId', r.id, 'userId', r."userId")) FILTER (WHERE r."userId" = $1) AS requests
    FROM "Channel" c
    LEFT JOIN "Request" r ON r."channelId" = c.id
    LEFT JOIN LATERAL (
        SELECT
            m.name,
            m.image,
            m.id
        FROM "_ChannelMembers" cm
        JOIN "User" m ON m.id = cm."B"
        WHERE cm."A" = c.id
    ) m ON true
    LEFT JOIN "User" o ON o.id = c."ownerId"
    WHERE true
  `;

  if (fromLocation) {
    query += `
      AND ST_DWithin(
        c."from", 
        ST_MakePoint($${bindings.length + 1}, $${bindings.length + 2})::geography, 
        1000
      )
    `;
    bindings.push(fromLocation.longitude, fromLocation.latitude);
  }

  if (toLocation) {
    query += `
      AND ST_DWithin(
        c."to", 
        ST_MakePoint($${bindings.length + 1}, $${bindings.length + 2})::geography, 
        1000
      )
    `;
    bindings.push(toLocation.longitude, toLocation.latitude);
  }

  if (timeOfDay) {
    const nextDay = getNextDay(timeOfDay);
    query += `
      AND c.departure BETWEEN $${bindings.length + 1}::timestamp AND $${bindings.length + 2}::timestamp
    `;
    bindings.push(timeOfDay, nextDay);
  } else {
    query += `
      AND c.departure > $${bindings.length + 1}::timestamp
    `;
    bindings.push(new Date().toISOString());
  }

  query += `
    AND c."womenOnly" = $2
    GROUP BY c.id, c.description, c."womenOnly", c."participants", c."ownerId", c."createdAt", c."departure", c."fromAddress", "toAddress", o.name, o.image, o.id
    ORDER BY c.departure ASC
    LIMIT 10
    OFFSET $3;
  `;

  return await db.$queryRawUnsafe<findChannelOutput[]>(query, ...bindings);
}

export async function DeleteChannelById(channelId:number, currentUserId:string) {
  try {
    const channel = await db.channel.findUnique({
      where: {id: channelId},
      include: {owner: true}
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    if (channel.owner.id !== currentUserId) {
      throw new Error("Unathorized");
    }

    await db.channel.delete({
      where: {id: channelId}
    })
  } catch(e) {
    console.error(e);
    throw new Error("Unable to delete channel");
  }
}