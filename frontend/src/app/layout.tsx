import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Footer from "../components/Footer";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // Replace with production URL when deployed
  title: {
    template: "%s | TaskFlow",
    default: "TaskFlow | Master your work with absolute clarity",
  },
  description:
    "TaskFlow is a professional task management system designed to organize your projects, prioritize your focus, and sync your progress in real-time.",
  openGraph: {
    title: "TaskFlow",
    description: "Master your work with absolute clarity.",
    url: "/",
    siteName: "TaskFlow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow",
    description: "Master your work with absolute clarity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} font-sans bg-background text-foreground`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
