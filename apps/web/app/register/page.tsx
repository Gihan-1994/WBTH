"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, User, Eye, EyeOff, MapPin, Home, Compass, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["tourist", "guide", "accommodation_provider"], {
    message: "Please select a valid role",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: "tourist",
    label: "Tourist",
    description: "Explore destinations and book unique experiences",
    icon: Compass,
  },
  {
    value: "guide",
    label: "Guide",
    description: "Share your local expertise with travelers",
    icon: MapPin,
  },
  {
    value: "accommodation_provider",
    label: "Host",
    description: "List your property for travelers to stay",
    icon: Home,
  },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "tourist",
    },
  });

  const selectedRole = watch("role");

  async function handleNextStep() {
    const isValid = await trigger(["name", "email", "password"]);
    if (isValid) {
      setStep(2);
    }
  }

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const resData = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(resData.error ?? "Something went wrong");
      } else {
        setMsg(
          "Account created! Please check your email for verification link."
        );
        reset();
        setStep(1);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen w-full">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 z-10"></div>
          <img
            src="/images/login-art-43.png"
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 flex flex-col justify-center items-center p-12 text-center h-full w-full">
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-white mb-4">
                Start Your Journey Today
              </h2>
              <p className="text-lg text-indigo-100">
                Join thousands of travelers discovering authentic experiences around the world.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">WBTH</span>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                  step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 rounded-full transition-all ${
                  step >= 2 ? "bg-indigo-600" : "bg-gray-200"
                }`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                  step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  2
                </div>
              </div>

              {/* Header */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 ? "Create your account" : "How will you use WBTH?"}
              </h1>
              <p className="text-gray-500 text-base">
                {step === 1 ? "Enter your personal information" : "Select your role to personalize your experience"}
              </p>
            </div>

            {/* Success Message */}
            {msg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-emerald-700 text-sm font-medium">{msg}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        {...register("name")}
                        className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                          errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                          errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        {...register("password")}
                        className={`block w-full pl-12 pr-12 py-3.5 bg-gray-50 border ${
                          errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 mt-6"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Role Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Role Cards */}
                  <div className="space-y-4">
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedRole === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setValue("role", option.value as RegisterFormValues["role"])}
                          className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                              {option.label}
                            </p>
                            <p className={`text-sm mt-0.5 ${isSelected ? "text-indigo-600" : "text-gray-500"}`}>
                              {option.description}
                            </p>
                          </div>
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" {...register("role")} />

                  {/* Buttons */}
                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
            </p>

            {/* Copyright */}
            <p className="mt-6 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} WBTH. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}