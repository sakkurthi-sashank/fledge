import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const InstructorLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await auth();

  if (!user?.user.id) {
    return redirect("/login");
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default InstructorLayout;
