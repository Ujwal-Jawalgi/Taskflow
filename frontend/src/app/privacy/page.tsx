import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | TaskFlow",
  description:
    "Understand how TaskFlow collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-neutral-900"
          >
            TaskFlow
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <article className="prose prose-neutral prose-lg max-w-none">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-8">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 mb-10">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-neutral-600 mb-6">
            When you register for an account with TaskFlow, we collect the
            minimum amount of personal data necessary to provide our service.
            This includes:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 mb-6 space-y-2">
            <li>
              Your name and email address for account identification and
              authentication.
            </li>
            <li>
              Profile information you choose to provide via Google OAuth or
              direct signup.
            </li>
            <li>
              The tasks, projects, and related metadata you create within the
              application.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-neutral-600 mb-6">
            We use your data strictly to operate and improve the TaskFlow
            platform. Your email is used to securely authenticate your sessions.
            Your task data is stored securely in our PostgreSQL database and is
            strictly accessible only to your authenticated account. We do not
            sell, rent, or share your personal information with third parties
            for marketing purposes.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            3. Authentication and Cookies
          </h2>
          <p className="text-neutral-600 mb-6">
            TaskFlow uses secure JSON Web Tokens (JWT) for authentication. We
            use highly secure, HTTP-only, SameSite cookies to manage your login
            sessions securely. We do not use third-party tracking cookies,
            analytics cookies, or advertising cookies. Because our cookies are
            strictly necessary for the core functionality of the app, we do not
            require a separate cookie consent banner.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            4. Data Security
          </h2>
          <p className="text-neutral-600 mb-6">
            We implement industry-standard security measures to protect your
            data. All passwords are cryptographically hashed using bcrypt. Data
            transmitted between your browser and our servers is encrypted in
            transit using TLS/SSL.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            5. Your Rights
          </h2>
          <p className="text-neutral-600 mb-6">
            You have the right to access, modify, or permanently delete your
            personal information at any time. If you wish to delete your account
            and all associated task data, please contact our support team.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            6. Contact Us
          </h2>
          <p className="text-neutral-600 mb-6">
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at
            privacy@taskflow.example.com.
          </p>
        </article>
      </main>

      <footer className="border-t border-neutral-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
