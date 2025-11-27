"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d0d] text-white font-sans">

      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-[#1a1a1a] shadow-md border-b border-[#262626]">
        <h1 className="text-4xl font-bold text-[#ff6b00]">Angelika's Dashboard</h1>
        <nav className="space-x-4 flex items-center">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full border border-[#ff6b00] hover:bg-[#ff6b00] hover:text-black transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full bg-[#ff6b00] text-black font-semibold hover:bg-[#e86400] transition"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 sm:px-12 py-32">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#ff6b00]">
          Your Personal Dashboard Awaits
        </h2>
        <p className="max-w-xl text-zinc-300 mb-6 text-lg sm:text-xl leading-relaxed">
          Log in or register to access your personalized dashboard. View your account details, monitor your activity, and explore a dark-themed, cozy interface designed for your convenience.
        </p>

        {/* Buttons with Link wrapper */}
        <div className="flex gap-4 flex-wrap justify-center mb-12">
          <Link href="/login">
            <Button size="lg" className="rounded-full bg-[#ff6b00] hover:bg-[#e86400] text-black px-8 py-4 text-lg shadow-lg">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" className="rounded-full border border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-black px-8 py-4 text-lg shadow-lg">
              Register
            </Button>
          </Link>
        </div>

        {/* Optional Dashboard Preview Image */}
        <div className="mt-4 w-64 h-64 relative rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/stories/dashboard-preview.jpg"
            alt="Dashboard Preview"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-xl"
          />
        </div>
      </main>
    </div>
  );
}
