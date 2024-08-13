import { Channel } from "@/app/api/channel/route";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

const db = prisma.$extends({
  model: {
    channel: {
      async create(data: Channel) {
        const fromPoint = `POINT(${data.from.longitude} ${data.from.latitude})`;
        const toPoint = `POINT(${data.to.longitude} ${data.to.latitude})`;
        await prisma.$queryRaw`
        WITH inserted_channel AS (
            INSERT INTO "Channel" ("description", "departure", "from", "to", "fromAddress", "toAddress", "womenOnly", "participants", "ownerId") 
            VALUES (${data.description}, ${data.departure}, 
              ST_GeomFromText(${fromPoint}, 4326), 
              ST_GeomFromText(${toPoint}, 4326),
              ${data.from.address},
              ${data.to.address}, 
              ${data.womenOnly},
              ${data.participants},
              ${data.ownerId})
              RETURNING id
          )
          INSERT INTO "_ChannelMembers" ("A", "B")
          SELECT id, ${data.ownerId}
          FROM inserted_channel;
        `;
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
export default db;
