import React from "react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "../_components/loading-spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
};
