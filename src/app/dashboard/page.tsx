'use client';

import React, { useEffect, useState } from 'react';
import { getToken, logoutUser } from '@/app/lib/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/app/lib/config';

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

  const [positionCode, setPositionCode] = useState('');
  const [positionName, setPositionName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPositions();
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  async function fetchPositions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/positions`, {
        method: 'GET',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to load positions');
      const data = await res.json();
      setPositions(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Position = {
      position_code: positionCode,
      position_name: positionName,
    };

    try {
      let res: Response;

      if (editingId) {
        res = await fetch(`${API_BASE}/positions/${editingId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/positions`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save position');
      }

      setPositionCode('');
      setPositionName('');
      setEditingId(null);

      fetchPositions();
    } catch (error: any) {
      setError(error.message || 'Failed to save');
    }
  }

  function startEdit(position: Position) {
    setEditingId(position.position_id ?? null);
    setPositionCode(position.position_code);
    setPositionName(position.position_name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('Delete this position?')) return;

    try {
      const res = await fetch(`${API_BASE}/positions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error('Delete failed');

      fetchPositions();
    } catch (error: any) {
      setError(error.message || 'Delete failed');
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setPositionCode('');
    setPositionName('');
  }

  function handleLogout() {
    logoutUser();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">

        {/* TOP HEADER — MATCH LOGIN STYLE */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#ff6b00]">Positions Dashboard</h1>
          <p className="text-white mt-1">
            Manage your system positions
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={fetchPositions}>Refresh</Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>

        {/* FORM CARD */}
        <Card className="shadow-md bg-[#1a1a1a] border border-[#262626]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#ff6b00] text-center">
              {editingId ? 'Edit Position' : 'Create Position'}
            </h2>

            <form
              onSubmit={handleCreateOrUpdate}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            >
              <Input
                placeholder="Position Code"
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value)}
                required
                className="text-white"
              />
              <Input
                placeholder="Position Name"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                required
                className="text-white"
              />

              <div className="flex gap-2">
                <Button className="flex-1" type="submit">
                  {editingId ? 'Update' : 'Create'}
                </Button>

                {editingId && (
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* POSITIONS LIST */}
        <Card className="shadow-md bg-[#1a1a1a] border border-[#262626]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#ff6b00] text-center">
              Positions List {loading && '(loading...)'}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-black bg-white rounded">
                <thead className="bg-[#262626] text-[#ff6b00]">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-black">
                  {positions.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No positions found.
                      </td>
                    </tr>
                  )}

                  {positions.map((p) => (
                    <tr key={p.position_id} className="border-t border-[#262626]">
                      <td className="px-4 py-2">{p.position_id}</td>
                      <td className="px-4 py-2">{p.position_code}</td>
                      <td className="px-4 py-2">{p.position_name}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
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
