import { db } from "@/lib/db";
import { auth } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await auth();

    if (!user?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, categoryId, subCategoryId } = await req.json();

    const newCourse = await db.course.create({
      data: {
        title,
        categoryId,
        subCategoryId,
        instructorId: user.user.id,
      },
    });

    return NextResponse.json(newCourse, { status: 200 });
  } catch (err) {
    console.log("[courses_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
