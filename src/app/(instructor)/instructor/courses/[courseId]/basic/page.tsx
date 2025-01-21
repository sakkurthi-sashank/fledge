"use client";

import AlertBanner from "@/app/_components/alert-banner";
import EditCourseForm from "@/app/_components/course/edit-course-form";
import { LoadingSpinner } from "@/app/_components/loading-spinner";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

const CourseBasics = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: categoriesData, isLoading: isCategoryDataLoading } =
    api.categories.getCategoriesWithSubCategory.useQuery();
  const { data: coursesData, isLoading: isCourseDataLoading } =
    api.courses.getCoursesByInstructorIdAndCourseId.useQuery({
      courseId,
    });
  const { data: levelData } = api.levels.getLevel.useQuery();

  if (isCategoryDataLoading || isCourseDataLoading) {
    return <LoadingSpinner />;
  }

  const requiredFields = [
    coursesData?.title,
    coursesData?.description,
    coursesData?.categoryId,
    coursesData?.subCategoryId,
    coursesData?.levelId,
    coursesData?.imageUrl,
    coursesData?.price,
    coursesData?.sections.some((section) => section.isPublished),
  ];
  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      />
      <EditCourseForm
        course={coursesData!}
        categories={
          categoriesData?.map((category) => ({
            label: category.name!,
            value: category.id,
            subCategories: category.subCategories.map((subcategory) => ({
              label: subcategory.name!,
              value: subcategory.id,
            })),
          }))!
        }
        levels={
          levelData?.map((level) => ({
            label: level.name!,
            value: level.id,
          }))!
        }
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default CourseBasics;
