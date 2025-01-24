import { redirect } from "next/navigation";

import CreateSectionForm from "@/components/sections/CreateSectionForm";
import { db } from "@/lib/db";
import { auth } from "@/server/auth";

const CourseCurriculumPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const user = await auth();

  if (!user?.user) {
    return redirect("/login");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: user.user.id,
    },
    include: {
      sections: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  return <CreateSectionForm course={course} />;
};

export default CourseCurriculumPage;
