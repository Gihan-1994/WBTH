"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
    } else {
      setMsg(
        "Registered! Check the verification link in server logs (dev) or email (prod)."
      );
      form.reset();
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 border p-6 rounded"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {msg && <p className="text-green-600 text-sm">{msg}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}
