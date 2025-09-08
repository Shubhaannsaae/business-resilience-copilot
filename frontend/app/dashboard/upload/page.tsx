'use client';
import { useState, useEffect } from 'react';

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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [snapshotId, setSnapshotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [snapshotDetails, setSnapshotDetails] = useState(null);

  useEffect(() => {
    if (snapshotId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/snapshots/${snapshotId}`,
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setSnapshotDetails(data);
        });
    }
  }, [snapshotId]);

  async function upload() {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-csv`, {
        method: 'POST',
        headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string },
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSnapshotId(data.snapshot_id);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setFile(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
  };

  return (
    <main className="p-4 sm:p-6 md:p-8 lg:p-10 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-title">Upload Your Business Data</h1>
          <p className="text-muted-foreground mt-2">
            Upload a CSV file with your business transactions. The file must include the following columns: <code className="bg-muted text-accent-foreground px-2 py-1 rounded-md">date</code>, <code className="bg-muted text-accent-foreground px-2 py-1 rounded-md">type</code>, <code className="bg-muted text-accent-foreground px-2 py-1 rounded-md">amount</code>, and <code className="bg-muted text-accent-foreground px-2 py-1 rounded-md">counterparty</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Upload File</h2>
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-64 px-6 py-10 text-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                isDragOver
                  ? 'border-primary bg-muted'
                  : 'border-border hover:border-primary/80 hover:bg-muted/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icon path="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v2" className="text-muted-foreground w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">{file ? file.name : 'Drag & drop your file here'}</h3>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
              <input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            </label>

            <div className="flex justify-end mt-6">
              <button onClick={upload} disabled={!file || loading} className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold transform hover:scale-105 transition-all duration-300 disabled:bg-muted disabled:cursor-not-allowed shadow-lg">
                <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                <span>{loading ? 'Uploading...' : 'Upload & Analyze'}</span>
              </button>
            </div>
          </div>

          {snapshotDetails && (
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Snapshot Details</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">ID:</span> <span className="font-mono">{snapshotDetails.id}</span></p>
                <p><span className="font-semibold">Created At:</span> {new Date(snapshotDetails.created_at).toLocaleString()}</p>
                <p><span className="font-semibold">Transaction Count:</span> {snapshotDetails.transaction_count}</p>
              </div>
            </div>
          )}
        </div>

        {snapshotId && !snapshotDetails && (
          <div className="mt-8 p-4 bg-green-900/10 border border-green-700/20 rounded-lg shadow-inner">
            <p className="text-green-400">Successfully created snapshot: <span className="font-mono text-white">{snapshotId}</span></p>
          </div>
        )}
      </div>
    </main>
  );
}
