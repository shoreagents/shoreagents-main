import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - ShoreAgents",
  description: "Admin dashboard for ShoreAgents administrators",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
