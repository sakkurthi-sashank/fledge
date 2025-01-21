"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const CoursesPage = () => {
  const { data: coursesData } = api.courses.getCoursesByInstructorId.useQuery();

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>
      <div className="mt-5">
        <DataTable columns={columns} data={coursesData ?? []} />
      </div>
    </div>
  );
};

export default CoursesPage;
