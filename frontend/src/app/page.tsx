"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-neutral-900">
            TaskFlow
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="max-w-2xl">
              <motion.h1
                variants={fadeUpVariant}
                className="text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.1]"
              >
                Master your work with absolute clarity.
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                className="mt-6 text-xl text-neutral-500 leading-relaxed max-w-lg"
              >
                TaskFlow is a professional task management system designed to
                organize your projects, prioritize your focus, and sync your
                progress in real-time.
              </motion.p>
              <motion.div variants={fadeUpVariant} className="mt-10">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-soft transition-all"
                >
                  Start organizing today
                </Link>
              </motion.div>
            </div>

            {/* Layered Card Metaphor */}
            <motion.div
              variants={fadeUpVariant}
              className="relative mx-auto w-full max-w-md lg:max-w-full"
            >
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square">
                {/* Back card */}
                <div className="absolute inset-0 bg-neutral-100 rounded-2xl transform translate-x-4 translate-y-4 border border-neutral-200"></div>
                {/* Middle card */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-soft transform translate-x-2 translate-y-2 border border-neutral-100 p-6 flex flex-col gap-4">
                  <div className="h-4 w-1/3 bg-neutral-100 rounded"></div>
                  <div className="h-20 w-full bg-neutral-50 rounded border border-neutral-100"></div>
                  <div className="h-20 w-full bg-neutral-50 rounded border border-neutral-100"></div>
                </div>
                {/* Front card */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-soft-lg border border-neutral-100 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-neutral-900">
                      Q3 Marketing Launch
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                      High Priority
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm mb-8">
                    Finalize the landing page copy, configure the new design
                    foundation, and verify real-time sync across all devices
                    before Friday.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white"></div>
                      <span className="text-sm font-medium text-neutral-600">
                        Assigned to you
                      </span>
                    </div>
                    <div className="text-sm text-neutral-400 font-medium">
                      Due in 2 days
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Product Showcase */}
        <section className="py-24 bg-neutral-50 border-y border-neutral-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2
                variants={fadeUpVariant}
                className="text-3xl font-bold text-neutral-900 tracking-tight"
              >
                Built for focus and performance
              </motion.h2>
              <motion.p
                variants={fadeUpVariant}
                className="mt-4 text-lg text-neutral-500"
              >
                Everything you need to manage tasks, without the clutter.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              viewport={{ once: true, margin: "-100px" }}
              className="mx-auto max-w-5xl"
            >
              <div className="rounded-xl border border-neutral-200 bg-white shadow-soft-lg overflow-hidden">
                {/* Browser Chrome */}
                <div className="h-12 border-b border-neutral-100 bg-neutral-50 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                  </div>
                  <div className="mx-auto w-1/2 h-6 bg-white border border-neutral-200 rounded text-center text-xs text-neutral-400 flex items-center justify-center font-mono">
                    app.taskflow.com/dashboard
                  </div>
                </div>
                {/* Screenshot Container */}
                <div className="relative aspect-[16/10] bg-neutral-100">
                  <Image
                    src="/dashboard-screenshot.png"
                    alt="TaskFlow Dashboard Interface"
                    fill
                    className="object-cover"
                    onError={(e: any) => {
                      e.currentTarget.srcset =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 1000"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle">Dashboard Screenshot Pending</text></svg>';
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 max-w-2xl"
          >
            <motion.h2
              variants={fadeUpVariant}
              className="text-3xl font-bold text-neutral-900 tracking-tight"
            >
              Essential features, thoughtfully executed
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Feature 1 - Spans 2 columns */}
            <motion.div
              variants={fadeUpVariant}
              className="md:col-span-2 bg-neutral-50 rounded-2xl p-8 border border-neutral-100 flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="relative z-10 max-w-md">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Powerful Organization
                </h3>
                <p className="text-neutral-500">
                  Create, edit, and organize tasks with customizable statuses
                  and priorities. Filter your view instantly to find exactly
                  what needs your attention right now.
                </p>
              </div>
              <div className="mt-12 relative z-10 flex gap-2">
                <span className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-200 rounded-md text-neutral-700 shadow-sm">
                  Todo
                </span>
                <span className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-200 rounded-md text-neutral-700 shadow-sm">
                  In Progress
                </span>
                <span className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-200 rounded-md text-neutral-700 shadow-sm">
                  Done
                </span>
              </div>
            </motion.div>

            {/* Feature 2 - Spans 1 column */}
            <motion.div
              variants={fadeUpVariant}
              className="bg-primary-900 border border-neutral-100 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Secure Access
                </h3>
                <p className="text-neutral-500">
                  Enterprise-grade authentication with Google OAuth integration
                  and secure JSON Web Tokens. Your data stays completely
                  private.
                </p>
              </div>
              <div className="mt-12 relative z-10">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 - Spans 3 columns */}
            <motion.div
              variants={fadeUpVariant}
              className="md:col-span-3 bg-white rounded-2xl p-8 border border-neutral-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Real-time Synchronization
                </h3>
                <p className="text-neutral-500">
                  Experience instant updates across all your devices via
                  WebSockets. When a task status changes on your phone, your
                  desktop dashboard updates in milliseconds without a page
                  refresh.
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">
                    Connected
                  </div>
                  <div className="text-xs text-neutral-500">Latency: 12ms</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
        {/* FAQ Section */}
        <section className="py-24 bg-white border-t border-neutral-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeUpVariant}
                className="text-3xl font-bold text-neutral-900 tracking-tight"
              >
                Frequently Asked Questions
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeUpVariant}>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Is my task data secure?
                </h3>
                <p className="text-neutral-500">
                  Yes. We use industry-standard encryption in transit and secure
                  JSON Web Tokens for authentication. Your data is isolated and
                  only accessible to your authenticated account.
                </p>
              </motion.div>
              <motion.div variants={fadeUpVariant}>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  How does the real-time sync work?
                </h3>
                <p className="text-neutral-500">
                  TaskFlow uses WebSockets to maintain a persistent connection
                  between your browser and our servers. When any change is made,
                  it is instantly broadcasted to all your active sessions in
                  milliseconds.
                </p>
              </motion.div>
              <motion.div variants={fadeUpVariant}>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Can I sign in with Google?
                </h3>
                <p className="text-neutral-500">
                  Absolutely. We support secure one-tap Google OAuth so you
                  don't have to remember another password.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
