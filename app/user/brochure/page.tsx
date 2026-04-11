"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, Check, X, FileText, Download, Upload } from "lucide-react";

interface Brochure {
  id: number;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
}

export default function BrochurePage() {
  const [brochures, setBrochures] = useState<Brochure[]>([
    { id: 1, title: "Company Profile 2025", fileName: "company-profile.pdf", fileUrl: "#", fileSize: "2.4 MB", uploadedAt: "2025-01-15" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") setSelectedFile(file);
    else alert("Please select a PDF file.");
  };

  const handleUpload = () => {
    if (!title.trim() || !selectedFile) return;
    setBrochures([...brochures, { id: Date.now(), title: title.trim(), fileName: selectedFile.name, fileUrl: URL.createObjectURL(selectedFile), fileSize: formatSize(selectedFile.size), uploadedAt: new Date().toISOString().split("T")[0] }]);
    setTitle(""); setSelectedFile(null); setShowForm(false);
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Brochures</h2>
            <p className="text-sm text-gray-400 mt-0.5">{brochures.length} PDF{brochures.length !== 1 ? "s" : ""} uploaded</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Upload PDF</>}
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <div className="bg-white border border-blue-200 p-6 space-y-4">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upload New Brochure</p>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1">Title / Name *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Company Profile 2025"
                className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1">PDF File *</label>
              <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer px-6 py-10 flex flex-col items-center gap-3">
                <Upload size={28} className="text-gray-400" />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-base font-semibold text-blue-600">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">{formatSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-base text-gray-500 font-medium">Click to select PDF file</p>
                    <p className="text-sm text-gray-400">Only PDF files accepted</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowForm(false); setTitle(""); setSelectedFile(null); }} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={handleUpload} disabled={!title.trim() || !selectedFile} className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload size={14} /> Upload
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {brochures.length === 0 && <div className="px-6 py-12 text-center text-base text-gray-400">No brochures uploaded yet.</div>}
          {brochures.map((b, idx) => (
            <div key={b.id} className={`flex items-center gap-4 px-6 py-5 transition-colors ${idx % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}`}>
              <div className="h-12 w-12 bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <FileText size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">{b.title}</p>
                <p className="text-sm text-gray-400 truncate mt-0.5">{b.fileName} · {b.fileSize} · {b.uploadedAt}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={b.fileUrl} download={b.fileName} className="flex items-center gap-1.5 border border-blue-300 bg-blue-50 text-blue-700 px-3 py-2 text-sm font-semibold hover:bg-blue-100 transition-colors rounded-lg">
                  <Download size={14} /> Download
                </a>
                {deleteId === b.id ? (
                  <>
                    <button onClick={() => { setBrochures(brochures.filter((x) => x.id !== b.id)); setDeleteId(null); }} className="p-1.5 text-red-600 hover:bg-red-50"><Check size={15} /></button>
                    <button onClick={() => setDeleteId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100"><X size={15} /></button>
                  </>
                ) : (
                  <button onClick={() => setDeleteId(b.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
