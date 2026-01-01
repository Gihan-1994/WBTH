"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      if (authError === "CredentialsSignin") {
        setError("Invalid email or password.");
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting sign in...");
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      console.log("Sign in response:", res);

      if (res?.error) {
        console.error("Sign in error:", res.error);
        setError("Invalid email or password.");
      } else if (res?.ok) {
        console.log("Sign in successful, redirecting...");
        router.push("/dashboard");
        router.refresh();
      } else {
        console.warn("Unknown sign in state");
        setError("An unknown error occurred. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg border border-white/20 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-600">Sign in to continue your journey</p>
      </div>

      {/* Verified Message */}
      {searchParams.get("verified") && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm rounded-xl border border-green-200 animate-slide-in-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Email verified! You can log in now.
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-slide-in-down">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-slide-in-down">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              Login
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 text-sm rounded-xl border border-red-200 animate-slide-in-down">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        )}
      </form>

      {/* Register Link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10">
        {/* @ts-ignore */}
        <Suspense fallback={
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-in-down {
          animation: slide-in-down 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
