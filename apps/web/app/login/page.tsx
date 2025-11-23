"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 border p-8 rounded-lg shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        {searchParams.get("verified") && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            Email verified! You can log in now.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded transition duration-200 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {error}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
