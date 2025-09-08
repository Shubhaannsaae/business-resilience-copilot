"use client";
import { useState, useEffect } from "react";
import ChatUI from "../../../components/ChatUI";

const Icon = ({ path, className }: { path: string, className?: string }) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={path} />
  </svg>
);

export default function CopilotPage() {
  const [snapshotId, setSnapshotId] = useState("");
  const [snapshotDetails, setSnapshotDetails] = useState<any>(null);

  useEffect(() => {
    if (snapshotId) {
      fetchSnapshotDetails(snapshotId);
    }
  }, [snapshotId]);

  async function fetchSnapshotDetails(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/snapshots/${id}`,
        {
          headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY as string },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSnapshotDetails(data);
    } catch (error) {
      console.error('Failed to fetch snapshot details:', error);
      setSnapshotDetails(null);
    }
  }

  async function onAsk(q: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/copilot/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": process.env.NEXT_PUBLIC_API_KEY as string },
      body: JSON.stringify({ snapshot_id: Number(snapshotId), question: q })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.answer as string;
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-secondary p-8 rounded-xl border border-highlight shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Resilience Copilot</h2>
        <p className="text-light-accent mb-8">Ask questions and get AI-powered insights about your business.</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary p-6 rounded-lg border border-highlight">
              <label htmlFor="snapshot-id" className="block text-sm font-medium text-light-accent mb-2">Snapshot ID</label>
              <input
                id="snapshot-id"
                className="w-full bg-secondary border border-highlight rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-300"
                placeholder="Enter Snapshot ID"
                value={snapshotId}
                onChange={e => setSnapshotId(e.target.value)}
              />
            </div>

            {snapshotDetails && (
              <div className="bg-primary p-6 rounded-lg border border-highlight animate-fadeIn">
                <h3 className="text-lg font-bold text-white mb-4">Snapshot Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-light-accent">ID: <span className="font-mono text-white">{snapshotDetails.id}</span></p>
                  <p className="text-light-accent">Created At: <span className="font-mono text-white">{new Date(snapshotDetails.created_at).toLocaleString()}</span></p>
                  <p className="text-light-accent">Transactions: <span className="font-mono text-white">{snapshotDetails.num_transactions}</span></p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <ChatUI onAsk={onAsk} />
          </div>
        </div>
      </div>
    </main>
  );
}
