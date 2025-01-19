import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const categoriesRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async () => {
    const categoriesData = await db.query.category.findMany({
      orderBy(fields, operators) {
        return operators.asc(fields.name);
      },
    });
    return categoriesData;
  }),
});
