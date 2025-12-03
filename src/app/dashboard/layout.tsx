"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, logoutUser } from "@/app/lib/auth";

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

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#f0f4f0] via-[#e8f0e8] to-[#dfe8df] text-[#3b4b3b]">
      <header className="bg-[#f9f9f9] shadow-md border-b border-[#d4e0d4] flex items-center justify-between p-4">
        <h2 className="font-bold text-xl text-[#4f7a4f]">Dashboard</h2>

        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-[#a0d0a0] hover:bg-[#7cb17c] text-white rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
