"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { API_BASE } from "@/app/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username || !password || !email) {
      setError("Please fill out all fields.");
      return;
    }

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed.");
      return;
    }

    setSuccess(true);
    setUsername("");
    setPassword("");
    setEmail("");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#0d0d0d] text-white">
      <Card className="w-full max-w-sm p-6 shadow-xl rounded-xl bg-[#1a1a1a] border border-[#262626]">
        <CardContent>
          <h1 className="text-xl font-bold mb-4 text-center text-[#ff6b00]">
            Register
          </h1>

          {success ? (
            <div className="text-center space-y-4">
              <p className="text-green-500 font-medium">
                Registered successfully! You can now login.
              </p>
              <Button
                className="w-full bg-[#ff6b00] hover:bg-[#e86400]"
                onClick={() => router.push("/login")}
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                className="bg-[#262626] text-white border-[#333]"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                type="password"
                className="bg-[#262626] text-white border-[#333]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                className="bg-[#262626] text-white border-[#333]"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <Button
                className="w-full bg-[#ff6b00] hover:bg-[#e86400]"
                type="submit"
              >
                Register
              </Button>
            </form>
          )}

          {!success && (
            <Button
              variant="link"
              className="mt-2 w-full text-[#ff6b00]"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          )}

          <Button
            variant="link"
            className="w-full text-[#ff6b00]"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
