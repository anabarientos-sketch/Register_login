"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { saveToken } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { API_BASE } from "@/app/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill both fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.accessToken) {
        setError(data.message || "Invalid login.");
        setLoading(false);
        return;
      }

      saveToken(data.accessToken);
      router.push("/dashboard");
    } catch {
      setError("Server error.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f9faf9] via-[#edf5ed] to-[#e0e8e0] text-[#3b4b3b]">
      <Card className="w-full max-w-sm p-6 shadow-xl rounded-xl bg-[#ffffffee] border border-[#d4e0d4] backdrop-blur-sm">
        <CardContent>
          {/* Title */}
          <h1 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-[#7cb17c] via-[#a0d0a0] to-[#7cb17c] text-transparent bg-clip-text">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              className="bg-[#f0f7f0] text-[#3b4b3b] border-[#c8dcc8] placeholder-[#6b8a6b]"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              type="password"
              className="bg-[#f0f7f0] text-[#3b4b3b] border-[#c8dcc8] placeholder-[#6b8a6b]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <Button
              className="w-full bg-[#a0d0a0] hover:bg-[#7cb17c] text-white transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Checking..." : "Login"}
            </Button>
          </form>

          <Button
            variant="link"
            className="w-full text-[#7cb17c] hover:text-[#4b7c4b] mt-2 transition"
            onClick={() => router.push("/register")}
          >
            Create Account
          </Button>

          <Button
            variant="link"
            className="w-full text-[#7cb17c] hover:text-[#4b7c4b] mt-1 transition"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
