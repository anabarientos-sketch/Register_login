"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/app/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setTokenLoaded(true);
    }
  }, [router]);

  if (!tokenLoaded) return null;

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] text-white">
      <header className="bg-[#1a1a1a] shadow-xl border-b border-[#262626] flex items-center justify-between p-4">
        <h2 className="font-bold text-xl text-[#ff6b00]">Dashboard</h2>

        {/* Logout removed here */}
        <div className="flex items-center space-x-4">
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold text-[#ff6b00] mb-6"></h1>
        {children}
      </main>
    </div>
  );
}
