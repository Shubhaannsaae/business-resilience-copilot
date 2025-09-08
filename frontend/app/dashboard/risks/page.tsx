"use client";
import { useState, useEffect } from "react";
import RiskCard from "../../../components/RiskCard";

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

export default function RisksPage() {
  const [snapshotId, setSnapshotId] = useState("");
  const [risks, setRisks] = useState(null as any[] | null);
  const [loading, setLoading] = useState(false);
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

  async function run() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/risk/analyze?snapshot_id=${snapshotId}`,
        {
          method: "POST",
          headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY as string }
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setRisks(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-secondary p-8 rounded-xl border border-highlight shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Risk Analysis</h2>
        <p className="text-light-accent mb-8">Enter a snapshot ID to analyze potential business risks.</p>

        <div className="flex items-start gap-8">
          <div className="w-1/3 space-y-6">
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

            <button
              onClick={run}
              disabled={!snapshotId || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-accent text-white font-bold transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg"
            >
              <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <span>{loading ? "Analyzing..." : "Analyze Risks"}</span>
            </button>
          </div>

          <div className="w-2/3">
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
              {risks?.map((r, i) => (
                <RiskCard
                  key={i}
                  title={r.title}
                  severity={r.severity}
                  priority={r.priority}
                  suggestion={r.suggestion}
                />
              ))}
            </div>
            {!risks && !loading && (
              <div className="text-center py-20">
                <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                <p className="text-lg text-light-accent">Enter a snapshot ID and click Analyze to view risks.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
