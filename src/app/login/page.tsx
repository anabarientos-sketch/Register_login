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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    // 🚨 HARD FRONTEND VALIDATION (BLOCKS DASHBOARD ALWAYS)
    if (!username.trim() || !password.trim() || !email.trim()) {
      setError("Please fill all fields. Login cannot continue.");
      return; // ⛔ STOP IMMEDIATELY
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      // 🚨 BLOCK dashboard even if backend wrongly sends success
      if (!res.ok || !data?.accessToken) {
        setError(
          res.status === 404
            ? "No registered character found. Please register first."
            : data.message || "Invalid login. Try again."
        );
        setLoading(false);
        return; // ⛔ STOP, DON'T NAVIGATE
      }

      // 🟩 FINAL CHECK: accessToken MUST exist
      if (!data.accessToken || data.accessToken.length < 10) {
        setError("Invalid login token. Cannot continue.");
        setLoading(false);
        return; // ⛔ STILL BLOCK
      }

      // 🟩 LOGIN SUCCESS
      saveToken(data.accessToken);
      router.push("/dashboard");

    } catch {
      setError("Server error. Try again later.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#0d0d0d] text-white">
      <Card className="w-full max-w-sm p-6 shadow-xl rounded-xl bg-[#1a1a1a] border border-[#262626]">
        <CardContent>
          <h1 className="text-xl font-bold mb-4 text-center text-[#ff6b00]">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              className="bg-[#262626] text-white border-[#333]"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="password"
              className="bg-[#262626] text-white border-[#333]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              className="bg-[#262626] text-white border-[#333]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              className="w-full bg-[#ff6b00] hover:bg-[#e86400]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Checking..." : "Login"}
            </Button>
          </form>

          <Button
            variant="link"
            className="mt-2 w-full text-[#ff6b00]"
            onClick={() => router.push("/register")}
          >
            Create an Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
