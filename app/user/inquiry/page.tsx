"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Phone, Mail, MessageSquare, Mic, MicOff, Trash2, Check, X, Plus, Square } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  message: string;
  hasVoice: boolean;
  submittedAt: string;
}

const emptyForm = { name: "", mobile: "", email: "", message: "" };
const inputCls = "w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
const labelCls = "text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1";

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    { id: 1, name: "Rahul Mehta", mobile: "9876543210", email: "rahul@example.com", message: "I want to know more about your services.", hasVoice: false, submittedAt: "2025-02-01" },
  ]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => { const blob = new Blob(chunksRef.current, { type: "audio/webm" }); setAudioBlob(blob); setAudioUrl(URL.createObjectURL(blob)); stream.getTracks().forEach((t) => t.stop()); };
      mr.start(); mediaRecorderRef.current = mr; setRecording(true);
    } catch { alert("Microphone access denied."); }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false); };
  const clearRecording = () => { setAudioBlob(null); setAudioUrl(""); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile) return;
    setInquiries([...inquiries, { id: Date.now(), ...form, hasVoice: !!audioBlob, submittedAt: new Date().toISOString().split("T")[0] }]);
    setForm(emptyForm); clearRecording(); setShowForm(false);
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Inquiries</h2>
            <p className="text-sm text-gray-400 mt-0.5">{inquiries.length} total entr{inquiries.length !== 1 ? "ies" : "y"}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-blue-200 p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">New Inquiry</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <div className="relative"><User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" className={inputCls} /></div>
                </div>
                <div>
                  <label className={labelCls}>Mobile *</label>
                  <div className="relative"><Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input name="mobile" value={form.mobile} onChange={handleChange} required placeholder="Mobile number" className={inputCls} /></div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Email</label>
                  <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input name="email" value={form.email} onChange={handleChange} placeholder="Email address" className={inputCls} /></div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Message</label>
                  <div className="relative"><MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" /><textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Write your message..." className="w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none" /></div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Voice Recording</label>
                <div className="flex items-center gap-3 mt-1">
                  {!recording && !audioUrl && (
                    <button type="button" onClick={startRecording} className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg">
                      <Mic size={15} className="text-blue-600" /> Start Recording
                    </button>
                  )}
                  {recording && (
                    <button type="button" onClick={stopRecording} className="flex items-center gap-2 border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-lg">
                      <Square size={15} /> Stop <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    </button>
                  )}
                  {audioUrl && (
                    <div className="flex items-center gap-2 flex-1">
                      <audio src={audioUrl} controls className="h-9 flex-1 min-w-0" />
                      <button type="button" onClick={clearRecording} className="p-1.5 text-red-500 hover:bg-red-50"><X size={15} /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); clearRecording(); }} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Submit Inquiry</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {inquiries.length === 0 ? (
            <div className="px-6 py-12 text-center text-base text-gray-400">No inquiries yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    {["Name", "Mobile", "Email", "Message", "Voice", "Date", "Delete"].map((h, i) => (
                      <th key={h} className={`px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-left ${i < 6 ? "border-r border-blue-600" : "text-center"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq, idx) => (
                    <tr key={inq.id} className={idx % 2 === 0 ? "bg-white hover:bg-blue-50 transition-colors" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
                      <td className="px-4 py-3.5 border-r border-gray-100 font-semibold text-gray-900 whitespace-nowrap">{inq.name}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-600 whitespace-nowrap">{inq.mobile}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-500 whitespace-nowrap">{inq.email || "—"}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-500 max-w-[180px] truncate">{inq.message || "—"}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-center">
                        {inq.hasVoice ? <Mic size={15} className="text-blue-600 mx-auto" /> : <MicOff size={15} className="text-gray-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-500 whitespace-nowrap">{inq.submittedAt}</td>
                      <td className="px-4 py-3.5 text-center">
                        {deleteId === inq.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => { setInquiries(inquiries.filter((i) => i.id !== inq.id)); setDeleteId(null); }} className="p-1 text-red-600 hover:bg-red-50"><Check size={14} /></button>
                            <button onClick={() => setDeleteId(null)} className="p-1 text-gray-400 hover:bg-gray-100"><X size={14} /></button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteId(inq.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
