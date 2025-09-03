"use client";

import React, { useState } from "react";

type UploadResult = {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
  originalName: string;
};

export default function AuditorUploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults([]);

    if (!files || files.length === 0) {
      setError("Please choose one or more files.");
      return;
    }

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setResults(data.uploaded || []);
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Auditor Uploads
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Drag & drop photos, invoices, drawings, and supporting evidence.
          Files are stored in Vercel Blob and can feed your sustainability dashboard.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
        <label
          htmlFor="files"
          className="mb-3 block text-sm font-medium text-slate-700"
        >
          Select files (images, PDFs, spreadsheets)
        </label>
        <input
          id="files"
          type="file"
          multiple
          onChange={(e) => setFiles(e.currentTarget.files)}
          className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
        />

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>

        {error && (
          <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </form>

      {results.length > 0 && (
        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Uploaded files</h2>
          <p className="mt-1 text-sm text-slate-600">
            Public URLs below can be previewed and linked in your dashboard.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Size (KB)</th>
                  <th className="py-2 pr-4">URL</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.pathname + i} className="border-t">
                    <td className="py-2 pr-4 font-medium">{r.originalName}</td>
                    <td className="py-2 pr-4">{r.contentType}</td>
                    <td className="py-2 pr-4">{Math.round(r.size / 1024)}</td>
                    <td className="py-2 pr-4">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 underline"
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
