"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, logoutUser } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/button";
import { LogOut, Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setTokenLoaded(true);
    }
  }, [router]);

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  if (!tokenLoaded) return null;

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      {/* Sidebar */}
      <aside
        className={`${open ? "w-64" : "w-20"} transition-all bg-[#1a1a1a] shadow-xl border-r border-[#262626] relative flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#262626]">
            <h2 className="font-bold text-lg text-[#ff6b00]">{open ? "Dashboard" : "DB"}</h2>
            <button onClick={() => setOpen(!open)}>
              <Menu className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="w-full px-3 mb-4">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" /> {open && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#ff6b00]">Dashboard</h1>
        </header>
        {children}
      </main>
    </div>
  );
}
