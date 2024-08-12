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

interface findChannelOutput {
  description: string;
  id: number;
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
  user_requests?: {
    userId: string;
    requestId: number;
  }[];
  womenOnly: boolean;
  createdAt: Date;
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
 * @param timeOfDay 
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
  timeOfDay?: Date,
) {
  function getNextDay(date: Date) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }
  const bindings: any[] = [currentUserId, womenOnly, offset];

  let query = `
    SELECT c.id, c.description, c."womenOnly", c."participants", c."createdAt",
      array_agg(DISTINCT jsonb_build_object('name', m.name, 'image', m.image, 'id', m.id)) AS members,
      jsonb_build_object('name', o.name, 'image', o.image, 'id', o.id) AS owner,
      array_agg(DISTINCT jsonb_build_object('requestId', r.id, 'userId', r."userId")) FILTER (WHERE r."userId" = $1) AS user_requests
    FROM "Channel" c
    JOIN "Request" r ON r."channelId" = c.id
    JOIN LATERAL (
        SELECT
            m.name,
            m.image,
            m.id
        FROM "_ChannelMembers" cm
        JOIN "User" m ON m.id = cm."B"
        WHERE cm."A" = c.id
    ) m ON true
    JOIN "User" o ON o.id = c."ownerId"
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
    const nextDay = getNextDay(timeOfDay).toISOString();
    query += `
      AND c.departure BETWEEN $${bindings.length + 1}::timestamp AND $${bindings.length + 2}::timestamp
    `;
    bindings.push(timeOfDay.toISOString(), nextDay);
  } else {
    query += `
      AND c.departure > $${bindings.length + 1}::timestamp
    `;
    bindings.push(new Date().toISOString());
  }

  query += `
    AND c."womenOnly" = $2
    GROUP BY c.id, c.description, c."womenOnly", c."participants", c."ownerId", c."createdAt", o.name, o.image, o.id
    ORDER BY c.departure ASC
    LIMIT 10
    OFFSET $3;
  `;

  return await db.$queryRawUnsafe<findChannelOutput[]>(query, ...bindings);
}