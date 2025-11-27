"use client";

import { getToken } from "@/app/lib/auth";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent } from "@/app/components/ui/card";

interface JwtPayload {
  username: string;
  role: string;
  exp?: number;
  iat?: number;
}

export default function DashboardHome() {
  const token = getToken();

  let username = "Guest";
  let role = "User";
  let decodedData: any = null;

  if (token) {
    try {
      decodedData = jwtDecode<JwtPayload>(token);
      username = decodedData.username || "Guest";
      role = decodedData.role || "User";
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  return (
    <div className="space-y-8 text-white">
      {/* Welcome Header */}
      <h2 className="text-2xl font-bold text-[#ff6b00]">
        Welcome back, {username}! 👋
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border border-[#262626]">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Account Type</p>
            <h3 className="text-lg font-semibold text-[#ff6b00]">{role}</h3>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#262626]">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Status</p>
            <h3 className="text-lg font-semibold text-green-500">Active</h3>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#262626]">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Token Valid</p>
            <h3 className="text-sm text-gray-300">
              {token ? "Yes" : "No Token Found"}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* JWT Decoded Data */}
      <div>
        <h3 className="text-xl font-bold text-[#ff6b00] mb-2">
          Decoded User Information
        </h3>
        <pre className="p-4 bg-[#1a1a1a] rounded-lg border border-[#262626] text-xs whitespace-pre-wrap break-words">
          {decodedData ? JSON.stringify(decodedData, null, 2) : "No token data found"}
        </pre>
      </div>

      {/* Bearer Token */}
      <div>
        <h3 className="text-xl font-bold text-[#ff6b00] mb-2">Bearer Token</h3>
        <pre className="p-4 bg-[#1a1a1a] rounded-lg border border-[#262626] text-xs whitespace-pre-wrap break-words">
          {token || "No token available"}
        </pre>
      </div>
    </div>
  );
}
