import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-neutral-900"
          >
            TaskFlow
          </Link>
          <p className="mt-4 text-sm text-neutral-500 max-w-xs">
            The professional task management system designed for absolute
            clarity and real-time performance.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900 mb-4">Product</h4>
          <ul className="space-y-3 text-sm text-neutral-500">
            <li>
              <Link
                href="/login"
                className="hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="hover:text-primary-600 transition-colors"
              >
                Create Account
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/Ujwal-Jawalgi/Taskflow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 transition-colors"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
          <ul className="space-y-3 text-sm text-neutral-500">
            <li>
              <Link
                href="/privacy"
                className="hover:text-primary-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-primary-600 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-neutral-200 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between">
        <p>
          © {new Date().getFullYear()} TaskFlow Inc by Ujwal. All rights
          reserved.
        </p>
        <p className="mt-4 md:mt-0">Built with Next.js & Node</p>
      </div>
    </footer>
  );
}
