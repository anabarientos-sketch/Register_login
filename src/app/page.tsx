"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f6f6f7] text-[#4b4b4b] font-sans overflow-hidden">

      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 flex justify-between items-center bg-[#e8eef2]/80 backdrop-blur border-b border-[#d1d7dc] shadow-lg">
        <h1 className="relative text-2xl sm:text-4xl font-bold text-[#5a7d5a]">
          Angelika's Dashboard
        </h1>

        <nav className="space-x-2 sm:space-x-4 flex items-center">
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-full border border-[#5a7d5a] hover:bg-[#5a7d5a] hover:text-white transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-full bg-[#5a7d5a] text-white font-semibold hover:bg-[#4e6d4e] transition"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-4 sm:px-12 py-20 sm:py-32">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-[#4e6d4e]">
          Your Personal Dashboard Awaits
        </h2>

        <p className="max-w-xl text-[#4e6d4e] mb-6 text-base sm:text-xl leading-relaxed">
          Log in or register to unlock your private dashboard.
        </p>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-4 max-w-6xl">
          {[ 
            {
              title: "Secure Login",
              text: "Protected with token-based, modern authentication.",
            },
            {
              title: "Calming UI",
              text: "Inspired by lily-of-the-valley, soft and pleasant on eyes.",
            },
            {
              title: "Easy Navigation",
              text: "Everything is always one click away.",
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-[#f0f4f7]/90 backdrop-blur rounded-xl border border-[#d1d7dc] shadow-lg hover:shadow-[0_0_18px_#5a7d5a] hover:border-[#5a7d5a] transition transform hover:-translate-y-1 fade-card"
              style={{ animationDelay: `${0.2 * i}s` }}
            >
              <h3 className="text-xl font-semibold text-[#6c8f6c]">{item.title}</h3>
              <p className="text-[#4e6d4e] mt-2 text-sm">{item.text}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-[#4e6d4e] bg-[#f6f6f7]/80 backdrop-blur shadow-inner">
        <p className="hover:text-[#5a7d5a] transition">
          © {new Date().getFullYear()} Angelika • All rights reserved
        </p>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-card {
          opacity: 0;
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
