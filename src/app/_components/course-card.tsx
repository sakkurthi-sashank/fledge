"use client";

import {
  type levels,
  type sections,
  type subCategory,
  type courses,
} from "@/server/db/schema";
import { api } from "@/trpc/react";
import { type InferSelectModel } from "drizzle-orm";
import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourseCard = ({
  course,
}: {
  course: InferSelectModel<typeof courses> & {
    subCategory: InferSelectModel<typeof subCategory> | null;
  } & { sections: InferSelectModel<typeof sections>[] } & {
    level?: InferSelectModel<typeof levels> | null;
  };
}) => {
  const { data: instructorData } = api.users.getUserById.useQuery({
    id: course.instructorId!,
  });

  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="cursor-pointer rounded-lg border"
    >
      <Image
        src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
        alt={course.title ?? "No Title"}
        width={500}
        height={300}
        className="h-[180px] w-[320px] rounded-t-xl object-cover"
      />
      <div className="flex flex-col gap-2 px-4 py-3">
        <h2 className="hover:[#FDAB04] text-lg font-bold">{course.title}</h2>
        <div className="flex justify-between text-sm font-medium">
          {instructorData && (
            <div className="flex items-center gap-2">
              <Image
                src={
                  instructorData.image
                    ? instructorData.image
                    : "/avatar_placeholder.jpg"
                }
                alt={
                  instructorData.name ? instructorData.name : "Instructor photo"
                }
                width={30}
                height={30}
                className="rounded-full"
              />
              <p>{instructorData.name ?? instructorData.email.split("@")[0]}</p>
            </div>
          )}
          {course.level?.id && (
            <div className="flex gap-2">
              <Gem size={20} />
              <p>{course.level?.name}</p>
            </div>
          )}
        </div>

        <p className="text-sm font-bold">$ {course.price}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
