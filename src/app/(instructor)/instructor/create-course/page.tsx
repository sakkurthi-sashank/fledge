"use client";

import CreateCourseForm from "@/app/_components/course/create-course";
import { api } from "@/trpc/react";

export default function CreateCoursePage() {
  const { data: categoryData } =
    api.categories.getCategoriesWithSubCategory.useQuery();

  if (!categoryData) {
    return null;
  }

  return (
    <div>
      <CreateCourseForm
        categories={categoryData?.map((category) => ({
          label: category.name ?? "Hello",
          value: category.id,
          subCategories: category.subCategories.map((subcategory) => ({
            label: subcategory.name ?? "Hello",
            value: subcategory.id,
          })),
        }))}
      />
    </div>
  );
}
