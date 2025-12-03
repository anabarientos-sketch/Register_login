"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-[#e8f0e8] via-[#f6f9f6] to-[#ffffff] text-[#4b4b4b] font-sans overflow-hidden">

      {/* Header */}
      <header className="w-full py-4 px-6 sm:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-[#d1d7dc] shadow-md">
        <h1 className="text-2xl sm:text-4xl font-bold text-[#5a7d5a] tracking-wide">
          Angelika's Dashboard
        </h1>

        <nav className="space-x-3 sm:space-x-5 flex items-center">
          <Link
            href="/login"
            className="px-4 py-2 text-sm sm:text-base rounded-full border border-[#5a7d5a] hover:bg-[#5a7d5a] hover:text-white transition-all duration-200"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 text-sm sm:text-base rounded-full bg-[#5a7d5a] text-white font-semibold hover:bg-[#4e6d4e] transition-all duration-200"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 sm:px-12 py-24 sm:py-36">
        <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 text-[#4e6d4e] leading-tight animate-fade-in">
          Welcome to Your Dashboard
        </h2>

        <p className="max-w-xl text-[#4e6d4e] mb-10 text-base sm:text-xl leading-relaxed animate-fade-in delay-200">
          Access all your tools, data, and reports in one place. Log in or register to start managing your workspace efficiently.
        </p>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl w-full">
          {[
            {
              title: "Manage Your Tasks",
              text: "Create, update, and track all tasks directly from your dashboard for efficient workflow management.",
            },
            {
              title: "Monitor Progress",
              text: "View real-time updates on ongoing projects, task completion, and team activities at a glance.",
            },
            {
              title: "Quick Navigation",
              text: "Access all modules, reports, and settings with a single click – everything you need is right here.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-[#d1d7dc] shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 * i}s` }}
            >
              <h3 className="text-xl font-semibold text-[#6c8f6c]">{item.title}</h3>
              <p className="text-[#4e6d4e] mt-2 text-sm">{item.text}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-[#4e6d4e] bg-white/80 backdrop-blur-md shadow-inner">
        <p className="hover:text-[#5a7d5a] transition-colors duration-200">
          © {new Date().getFullYear()} Angelika • All rights reserved
        </p>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.8s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
