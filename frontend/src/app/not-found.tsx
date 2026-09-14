import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-100 tracking-tighter">
            404
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 tracking-tight">
            Page not found
          </h2>
          <p className="mt-4 text-base text-neutral-500">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or deleted.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-soft transition-all"
          >
            Return Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-sm transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
