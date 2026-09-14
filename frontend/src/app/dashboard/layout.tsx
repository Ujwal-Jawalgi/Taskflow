import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View and manage your tasks, filter by priority and status in real-time.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
