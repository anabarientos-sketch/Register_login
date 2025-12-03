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
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f0] via-[#e8f0e8] to-[#dfe8df] p-6 flex justify-center text-[#3b4b3b]">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#4f7a4f]">
          Positions Dashboard
        </h1>

        <div className="flex justify-center gap-3">
          <Button className="bg-[#a0d0a0] hover:bg-[#7cb17c] text-white" onClick={fetchPositions}>
            Refresh
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="bg-[#ffffffee] border border-[#d4e0d4] shadow-md backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-center mb-4 text-[#4f7a4f]">
              {editingId ? "Edit Position" : "Create Position"}
            </h2>

            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Position Code"
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value)}
                required
                className="bg-[#edf5ed] text-[#3b4b3b] border-[#c8dcc8] placeholder-[#6b8a6b]"
              />
              <Input
                placeholder="Position Name"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                required
                className="bg-[#edf5ed] text-[#3b4b3b] border-[#c8dcc8] placeholder-[#6b8a6b]"
              />

              <div className="flex gap-2">
                <Button className="flex-1 bg-[#a0d0a0] hover:bg-[#7cb17c] text-white" type="submit">
                  {editingId ? "Update" : "Create"}
                </Button>

                {editingId && (
                  <Button
                    variant="outline"
                    className="flex-1 border-[#a0d0a0] text-[#4f7a4f] hover:bg-[#edf5ed]"
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

            {error && <p className="text-red-600 text-center mt-3">{error}</p>}
          </CardContent>
        </Card>

        <Card className="bg-[#ffffffee] border border-[#d4e0d4] shadow-md backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-center mb-4 text-[#4f7a4f]">
              Positions List {loading && "(loading...)"}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-[#f9f9f9] border text-left">
                <thead className="bg-[#edf5ed]">
                  <tr>
                    <th className="px-4 py-2 border border-[#c8dcc8]">ID</th>
                    <th className="px-4 py-2 border border-[#c8dcc8]">Code</th>
                    <th className="px-4 py-2 border border-[#c8dcc8]">Name</th>
                    <th className="px-4 py-2 border border-[#c8dcc8]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {positions.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        No positions found.
                      </td>
                    </tr>
                  )}

                  {positions.map((p) => (
                    <tr key={p.position_id} className="border-t border-[#c8dcc8]">
                      <td className="px-4 py-2 border border-[#c8dcc8]">{p.position_id}</td>
                      <td className="px-4 py-2 border border-[#c8dcc8]">{p.position_code}</td>
                      <td className="px-4 py-2 border border-[#c8dcc8]">{p.position_name}</td>
                      <td className="px-4 py-2 border border-[#c8dcc8]">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#a0d0a0] text-[#4f7a4f] hover:bg-[#edf5ed]"
                            onClick={() => startEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
