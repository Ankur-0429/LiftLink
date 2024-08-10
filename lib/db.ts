import { Channel } from "@/type";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

const extendedDB = prisma.$extends({
  model: {
    channel: {
      async create(data: Channel) {
        const fromPoint = `POINT(${data.from.longitude} ${data.from.latitude})`;
        const toPoint = `POINT(${data.to.longitude} ${data.to.latitude})`;
        const result: any = await prisma.$queryRaw`
        INSERT INTO "Channel" (description, departure, "from", "to", ownerId) 
        VALUES (${data.description}, ${data.departure}, 
                ST_GeomFromText(${fromPoint}, 4326), 
                ST_GeomFromText(${toPoint}, 4326), 
                ${data.ownerId}) RETURNING id;
        `;
        const channelId = result[0].id;
        await prisma.channel.update({
          where: { id: channelId },
          data: {
            members: {
              connect: { id: data.ownerId },
            },
          },
        });
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
export default extendedDB;
