import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input }) => {
      const userData = db.query.users.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, input.id);
        },
      });

      return userData;
    }),
});
