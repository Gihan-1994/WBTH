"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyEmailContent() {
  const search = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = search.get("token");
    const email = search.get("email");

    if (!token || !email) {
      setMessage("Invalid verification link.");
      return;
    }

    fetch(
      `/api/auth/verify-email?token=${token}&email=${encodeURIComponent(
        email
      )}`
    )
      .then((res) => {
        if (res.redirected) {
          router.push(res.url);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.error) setMessage(data.error);
      })
      .catch(() => setMessage("Something went wrong."));
  }, [search, router]);

  return <p>{message}</p>;
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      {/* @ts-ignore */}
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
