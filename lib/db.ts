import { PrismaClient } from "@prisma/client";
import { channel } from "diagnostics_channel";

declare global {
  var prisma: PrismaClient | undefined;
}

type MyPoint = {
  latitude: number;
  longitude: number;
};

export type Channel = {
  name: string;
  description: string;
  departure: Date;
  from: MyPoint;
  to: MyPoint;
  ownerId: string;
};

const prisma = globalThis.prisma || new PrismaClient();

const extendedDB = prisma.$extends({
  model: {
    channel: {
      async create(data: Channel) {
        const fromPoint = `POINT(${data.from.longitude} ${data.from.latitude})`;
        const toPoint = `POINT(${data.to.longitude} ${data.to.latitude})`;
        const result: any = await prisma.$queryRaw`
        INSERT INTO "Channel" (name, description, departure, "from", "to", ownerId) 
        VALUES (${data.name}, ${data.description}, ${data.departure}, 
                ST_GeomFromText(${fromPoint}, 4326), 
                ST_GeomFromText(${toPoint}, 4326), 
                ${data.ownerId}) RETURNING id;
        `;
        const newChannelId = result[0].id;
        await prisma.request.updateMany({
          where: {
            userId: data.ownerId,
            channelId: newChannelId,
            status: "PENDING",
          },
          data: {
            status: "APPROVED",
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
