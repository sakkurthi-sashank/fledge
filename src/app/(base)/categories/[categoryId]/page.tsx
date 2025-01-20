"use client";

import { Categories } from "@/app/_components/categories";
import CourseCard from "@/app/_components/course/course-card";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

const CoursesByCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: categoryData } = api.categories.getCategories.useQuery();
  const { data: coursesData } = api.courses.getCoursesByCategory.useQuery({
    id: categoryId,
  });

  return (
    <div className="pb-16 md:mt-5 md:px-10 xl:px-16">
      <Categories categories={categoryData} selectedCategory={categoryId} />
      <div className="flex flex-wrap justify-center gap-7">
        {coursesData?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesByCategory;
