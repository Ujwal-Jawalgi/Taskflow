import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new TaskFlow account and start organizing your work with absolute clarity.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
