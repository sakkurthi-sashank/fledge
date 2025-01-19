"use client";

import CourseCard from "@/app/_components/course-card";
import { api } from "@/trpc/react";

const LearningPage = () => {
  const { data: purchasedCoursesData } =
    api.courses.purchasedCourses.useQuery();

  return (
    <div className="px-4 py-6 md:mt-5 md:px-10 xl:px-16">
      <h1 className="text-2xl font-bold">Your courses</h1>
      <div className="mt-7 flex flex-wrap gap-7">
        {purchasedCoursesData?.map((purchase) => (
          <CourseCard key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
