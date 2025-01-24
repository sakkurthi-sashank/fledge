import { db } from "@/lib/db";
import { auth } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();
    const { courseId } = params;

    if (!user?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: user?.user.id },
    });

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    const unpusblishedCourse = await db.course.update({
      where: { id: courseId, instructorId: user?.user.id },
      data: { isPublished: false },
    });

    return NextResponse.json(unpusblishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
