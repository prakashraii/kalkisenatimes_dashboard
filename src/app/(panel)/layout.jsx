"use client";

import AdminShell from "@/components/AdminShell";
import AuthGuard from "@/components/AuthGuard";

export default function PanelLayout({ children }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
