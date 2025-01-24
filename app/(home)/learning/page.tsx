import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const LearningPage = async () => {
  const user = await auth();

  if (!user?.user) {
    return redirect("/login");
  }

  const purchasedCourses = await db.purchase.findMany({
    where: {
      customerId: user.user.id,
    },
    select: {
      course: {
        include: {
          category: true,
          subCategory: true,
          sections: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="px-4 py-6 md:mt-5 md:px-10 xl:px-16">
      <h1 className="text-2xl font-bold">Your courses</h1>
      <div className="flex flex-wrap gap-7 mt-7">
        {purchasedCourses.map((purchase) => (
          <CourseCard key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
