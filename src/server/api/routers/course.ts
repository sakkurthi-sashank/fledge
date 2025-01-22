import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { courses } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const courseRouter = createTRPCRouter({
  createCourse: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        categoryId: z.string(),
        subCategoryId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const newCourse = await db
        .insert(courses)
        .values({
          title: input.title,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          instructorId: ctx.session.user.id,
        })
        .returning()
        .execute();

      return newCourse[0];
    }),

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

  getCoursesByInstructorIdAndCourseId: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const courseData = await db.query.courses.findMany({
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.instructorId, ctx.session.user.id),
            operators.eq(fields.id, input.courseId),
          );
        },
        with: {
          sections: true,
        },
      });

      return courseData[0];
    }),

  getCoursesByInstructorId: protectedProcedure.query(async ({ ctx }) => {
    const courseData = await db.query.courses.findMany({
      orderBy(fields, operators) {
        return operators.desc(fields.createdAt);
      },
      where(fields, operators) {
        return operators.eq(fields.instructorId, ctx.session.user.id);
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

  updateCourse: protectedProcedure
    .input(
      z.object({
        coursesId: z.string(),
        title: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.string(),
        subCategoryId: z.string(),
        levelId: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const courseData = db
        .update(courses)
        .set({
          title: input.title,
          subtitle: input.subtitle,
          description: input.description,
          levelId: input.levelId,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          price: input.price,
          imageUrl: input.imageUrl,
        })
        .where(
          and(
            eq(courses.id, input.coursesId),
            eq(courses.instructorId, ctx.session.user.id),
          ),
        );

      return courseData;
    }),
});
