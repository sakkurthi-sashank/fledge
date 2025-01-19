"use client";

import { api } from "@/trpc/react";
import React from "react";
import { Categories } from "../_components/categories";
import CourseCard from "../_components/course-card";

export default function HomePage() {
  const { data: categoryData } = api.categories.getCategories.useQuery();
  const { data: coursesData } = api.courses.getCoursesByCategory.useQuery({
    id: undefined,
  });

  return (
    <div className="pb-16 md:mt-5 md:px-10 xl:px-16">
      <Categories categories={categoryData} selectedCategory={null} />
      <div className="flex flex-wrap justify-center gap-7">
        {coursesData?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
