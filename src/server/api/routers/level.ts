import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const levelRouter = createTRPCRouter({
  getLevel: protectedProcedure.query(async ({}) => {
    const levelData = await db.query.levels.findMany();
    return levelData;
  }),
});
