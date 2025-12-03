"use client";

import React, { useEffect, useState } from "react";
import { getToken, logoutUser } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/app/lib/config";

interface Position {
  position_id?: number;
  position_code: string;
  position_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPositions();
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  async function fetchPositions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/positions`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to load positions");

      const data = await res.json();
      setPositions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load positions");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      position_code: positionCode,
      position_name: positionName,
    };

    try {
      const res = await fetch(
        editingId
          ? `${API_BASE}/positions/${editingId}`
          : `${API_BASE}/positions`,
        {
          method: editingId ? "PUT" : "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save position");
      }

      setPositionCode("");
      setPositionName("");
      setEditingId(null);
      fetchPositions();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    }
  }

  function startEdit(position: Position) {
    setEditingId(position.position_id ?? null);
    setPositionCode(position.position_code);
    setPositionName(position.position_name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("Delete this position?")) return;

    try {
      const res = await fetch(`${API_BASE}/positions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Delete failed");

      fetchPositions();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  }

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#f6f8f6] p-6 flex justify-center text-[#3b4b3b]">
      <div className="w-full max-w-2xl space-y-6">

        <h1 className="text-3xl font-bold text-center text-[#4f7a4f] tracking-tight">
          📝 To-Do List
        </h1>

        {/* Top Buttons */}
        <div className="flex justify-center gap-3">
          <Button className="bg-[#9fcea0] hover:bg-[#7caf7c] text-white" onClick={fetchPositions}>
            Refresh
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Form Card */}
        <Card className="bg-white border border-[#d4e0d4] shadow-sm rounded-xl">
          <CardContent className="p-5 space-y-4">
            <h2 className="text-lg font-semibold text-center text-[#4f7a4f]">
              {editingId ? "✏️ Edit Task" : "➕ Add New Task"}
            </h2>

            <form onSubmit={handleCreateOrUpdate} className="space-y-3">
              <Input
                placeholder="Task Code"
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value)}
                required
                className="bg-[#f1f5f1] border-[#c8dcc8]"
              />
              <Input
                placeholder="Task Name"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                required
                className="bg-[#f1f5f1] border-[#c8dcc8]"
              />

              <div className="flex gap-2">
                <Button className="flex-1 bg-[#9fcea0] hover:bg-[#7caf7c] text-white">
                  {editingId ? "Update Task" : "Add Task"}
                </Button>

                {editingId && (
                  <Button
                    variant="outline"
                    className="flex-1 border-[#9fcea0] text-[#4f7a4f]"
                    onClick={() => {
                      setEditingId(null);
                      setPositionCode("");
                      setPositionName("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            {error && <p className="text-red-600 text-center">{error}</p>}
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card className="bg-white border border-[#d4e0d4] shadow-sm rounded-xl">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-center text-[#4f7a4f] mb-4">
              Tasks {loading && "(loading...)"} 
            </h2>

            <div className="space-y-2">
              {positions.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-6">No tasks yet.</p>
              )}

              {positions.map((p) => (
                <div
                  key={p.position_id}
                  className="flex items-center justify-between bg-[#f9fcf9] border border-[#d9e6d9] rounded-lg px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-[#3b4b3b]">{p.position_name}</p>
                    <p className="text-xs text-[#6b8a6b]">Code: {p.position_code}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#9fcea0] text-[#4f7a4f]"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(p.position_id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
