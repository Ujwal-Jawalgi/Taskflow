import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | TaskFlow",
  description:
    "Read the Terms of Service that govern your use of the TaskFlow application.",
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-neutral-500 mb-10">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-neutral-600 mb-6">
            By creating an account, accessing, or using the TaskFlow service,
            you agree to be bound by these Terms of Service. If you do not agree
            to these terms, please do not use our service.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            2. Description of Service
          </h2>
          <p className="text-neutral-600 mb-6">
            TaskFlow provides a web-based application designed to help
            individuals and teams organize tasks, manage projects, and track
            progress. We reserve the right to modify, suspend, or discontinue
            any aspect of the service at any time without notice.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            3. User Accounts and Security
          </h2>
          <p className="text-neutral-600 mb-6">
            You must provide an accurate email address to create an account. You
            are solely responsible for maintaining the confidentiality of your
            account credentials (whether using a password or Google OAuth). You
            are responsible for all activities that occur under your account.
            You must notify us immediately of any unauthorized use of your
            account.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            4. Acceptable Use Policy
          </h2>
          <p className="text-neutral-600 mb-6">
            You agree not to use the service to:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 mb-6 space-y-2">
            <li>
              Upload or share any content that is unlawful, harmful,
              threatening, or abusive.
            </li>
            <li>
              Attempt to gain unauthorized access to our servers or other users'
              accounts.
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              application.
            </li>
            <li>
              Use the service for any automated scraping or unauthorized API
              access.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-neutral-600 mb-6">
            All content, features, and functionality of the TaskFlow application
            (including design, text, graphics, and software) are owned by
            TaskFlow Inc. You retain full ownership of any task data you input
            into the system.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            6. Account Termination
          </h2>
          <p className="text-neutral-600 mb-6">
            We reserve the right to terminate or suspend your account
            immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach these Terms.
            Upon termination, your right to use the service will cease
            immediately.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-neutral-600 mb-6">
            In no event shall TaskFlow, nor its directors, employees, or
            partners, be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of your use or
            inability to use the service.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">
            8. Contact Information
          </h2>
          <p className="text-neutral-600 mb-6">
            If you have any questions about these Terms, please contact us at
            legal@taskflow.example.com.
          </p>
        </article>
      </main>

      <footer className="border-t border-neutral-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} TaskFlow Inc by Ujwal. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
