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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim() || !email.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setUsername("");
      setPassword("");
      setEmail("");
    } catch {
      setError("Server error. Try again later.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f9faf9] via-[#edf5ed] to-[#e0e8e0] text-[#3b4b3b]">
      <Card className="w-full max-w-sm p-6 shadow-xl rounded-xl bg-[#ffffffee] border border-[#d4e0d4] backdrop-blur-sm">
        <CardContent>
          {/* Title */}
          <h1 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-[#7cb17c] via-[#a0d0a0] to-[#7cb17c] text-transparent bg-clip-text">
            Register
          </h1>

          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-green-700 font-medium">
                Registered successfully! You can now login.
              </p>

              <Button
                className="w-full bg-[#a0d0a0] hover:bg-[#7cb17c] text-white transition"
                onClick={() => router.push("/login")}
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                className="bg-[#f0f7f0] text-[#3b4b3b] border-[#c8dcc8] placeholder-[#6b8a6b]"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                className="bg-[#f0f7f0] text-[#3b4b3b] border-[#c8dcc8] placeholder-[#6b8a6b]"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </form>
          )}

          {!success && (
            <Button
              variant="link"
              className="mt-2 w-full text-[#7cb17c] hover:text-[#4b7c4b] transition"
              onClick={() => router.push("/login")}
            >
              Already have an account?
            </Button>
          )}

          <Button
            variant="link"
            className="w-full text-[#7cb17c] hover:text-[#4b7c4b] transition"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
