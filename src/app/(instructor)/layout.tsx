"use client";

import type React from "react";
import { Navbar } from "../_components/navbar";
import { AuthWrapper } from "../_components/auth-wrapper";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <Navbar>{children}</Navbar>
    </AuthWrapper>
  );
}
