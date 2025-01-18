"use client";

import * as React from "react";
import { Book, GraduationCap, User, BarChart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-menu";
import { NavUser } from "./user-nav";
import { useSession } from "next-auth/react";

const data = {
  navMain: [
    {
      title: "Course",
      url: "/instructor/courses",
      icon: Book,
    },
    {
      title: "Learning",
      url: "/learning",
      icon: GraduationCap,
    },
    {
      title: "Instructor",
      url: "/instructor/courses",
      icon: User,
    },
    {
      title: "Performance",
      url: "/instructor/performance",
      icon: BarChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={session?.user} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
