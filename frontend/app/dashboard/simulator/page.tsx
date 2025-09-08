'use client';
import { useState, useEffect } from 'react';
import SimulationChart from '../../../components/SimulationChart';

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

export default function SimulatorPage() {
  const [form, setForm] = useState({
    snapshot_id: '',
    sales_change_pct: 0,
    expense_change_pct: 0,
    lose_top_client: false,
    supplier_failure_weeks: 0,
  });

  type SimulationResultType = {
    revenue_monthly: number;
    expenses_monthly: number;
    runway_months: number;
    notes: string[];
  };

  const [result, setResult] = useState<SimulationResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [snapshotDetails, setSnapshotDetails] = useState<any>(null);

  useEffect(() => {
    if (form.snapshot_id) {
      fetchSnapshotDetails(form.snapshot_id);
    }
  }, [form.snapshot_id]);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/simulation/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY as string },
        body: JSON.stringify({ ...form, snapshot_id: Number(form.snapshot_id) }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  const chartData = result
    ? [
        { name: 'Revenue', value: result.revenue_monthly },
        { name: 'Expenses', value: result.expenses_monthly },
        { name: 'Runway (mo)', value: result.runway_months },
      ]
    : [];

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-secondary p-8 rounded-xl border border-highlight shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">What-If Simulator</h2>
        <p className="text-light-accent mb-8">Experiment with different scenarios to understand their impact on your business resilience.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary p-6 rounded-lg border border-highlight">
              <label htmlFor="snapshot-id" className="block text-sm font-medium text-light-accent mb-2">Snapshot ID</label>
              <input
                id="snapshot-id"
                type="text"
                className="w-full bg-secondary border border-highlight rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-300"
                placeholder="Enter Snapshot ID"
                value={form.snapshot_id}
                onChange={(e) => setForm({ ...form, snapshot_id: e.target.value })}
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

            <div className="bg-primary p-6 rounded-lg border border-highlight">
              <h3 className="text-lg font-bold text-white mb-4">Scenario Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sales-change" className="block text-sm font-medium text-light-accent mb-2">Sales Change (%)</label>
                  <input
                    id="sales-change"
                    type="number"
                    className="w-full bg-secondary border border-highlight rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-300"
                    value={form.sales_change_pct}
                    onChange={(e) => setForm({ ...form, sales_change_pct: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label htmlFor="expense-change" className="block text-sm font-medium text-light-accent mb-2">Expense Change (%)</label>
                  <input
                    id="expense-change"
                    type="number"
                    className="w-full bg-secondary border border-highlight rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-300"
                    value={form.expense_change_pct}
                    onChange={(e) => setForm({ ...form, expense_change_pct: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label htmlFor="supplier-failure" className="block text-sm font-medium text-light-accent mb-2">Supplier Failure (weeks)</label>
                  <input
                    id="supplier-failure"
                    type="number"
                    className="w-full bg-secondary border border-highlight rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-300"
                    value={form.supplier_failure_weeks}
                    onChange={(e) => setForm({ ...form, supplier_failure_weeks: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="lose-top-client"
                    type="checkbox"
                    className="h-5 w-5 bg-secondary border-highlight rounded text-accent focus:ring-accent transition-all duration-300"
                    checked={form.lose_top_client}
                    onChange={(e) => setForm({ ...form, lose_top_client: e.target.checked })}
                  />
                  <label htmlFor="lose-top-client" className="ml-3 text-sm font-medium text-light-accent">Lose Top Client</label>
                </div>
              </div>
            </div>

            <button
              onClick={run}
              disabled={!form.snapshot_id || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-accent text-white font-bold transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg"
            >
              <Icon path="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
          </div>

          <div className="lg:col-span-2 bg-primary p-6 rounded-lg border border-highlight flex flex-col justify-center items-center">
            {result ? (
              <>
                <SimulationChart data={chartData} />
                {result.notes?.length > 0 && (
                  <div className="mt-6 w-full">
                    <h4 className="text-md font-semibold text-white mb-2">Notes:</h4>
                    <ul className="text-sm text-light-accent list-disc list-inside space-y-1">
                      {result.notes.map((n: string, i: number) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <Icon path="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                <p className="text-lg text-light-accent">Run a simulation to see the impact on your business.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
