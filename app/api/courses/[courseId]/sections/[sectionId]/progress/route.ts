import { db } from "@/lib/db";
import { auth } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const user = await auth();
    const { isCompleted } = await req.json();

    if (!user?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    let progress = await db.progress.findUnique({
      where: {
        studentId_sectionId: {
          studentId: user?.user.id,
          sectionId,
        },
      },
    });

    if (progress) {
      progress = await db.progress.update({
        where: {
          studentId_sectionId: {
            studentId: user?.user.id,
            sectionId,
          },
        },
        data: {
          isCompleted,
        },
      });
    } else {
      progress = await db.progress.create({
        data: {
          studentId: user?.user.id,
          sectionId,
          isCompleted,
        },
      });
    }

    return NextResponse.json(progress, { status: 200 });
  } catch (err) {
    console.log("[sectionId_progress_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
