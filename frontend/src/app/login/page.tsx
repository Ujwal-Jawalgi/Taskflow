"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError("");
      const response = await api.post("/auth/login", data);
      login(response.data.accessToken, response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.response?.data?.error?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setServerError("");
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      login(response.data.accessToken, response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(
        err.response?.data?.error?.message || "Google login failed",
      );
    }
  };

  const handleGoogleError = () => {
    setServerError("Google Login Failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-soft border border-neutral-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to your TaskFlow account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors text-neutral-900 bg-white"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors pr-10 text-neutral-900 bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none focus:text-indigo-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-sm"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              shape="rectangular"
              text="signin_with"
            />
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-neutral-500">Don't have an account? </span>
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
