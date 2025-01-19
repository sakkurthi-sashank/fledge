import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const courseRouter = createTRPCRouter({
  getCoursesByCategory: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const courseData = await db.query.courses.findMany({
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
        where(fields, operators) {
          return input.id
            ? operators.and(
                operators.eq(fields.id, input.id),
                operators.eq(fields.isPublished, true),
              )
            : operators.eq(fields.isPublished, true);
        },
        with: {
          category: true,
          subCategory: true,
          level: true,
          sections: {
            where(fields, operators) {
              return operators.eq(fields.isPublished, true);
            },
          },
        },
      });

      return courseData;
    }),

  purchasedCourses: protectedProcedure.query(async ({ ctx }) => {
    const purchasedCoursesData = await db.query.purchases.findMany({
      where(fields, operators) {
        return operators.eq(fields.customerId, ctx.session.user.id);
      },
      with: {
        course: {
          with: {
            category: true,
            subCategory: true,
            sections: {
              where(fields, operators) {
                return operators.eq(fields.isPublished, true);
              },
            },
          },
        },
      },
    });

    return purchasedCoursesData;
  }),
});
