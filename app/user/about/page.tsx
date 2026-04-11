"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";

export default function AboutPage() {
  const [title, setTitle] = useState("About Us");
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const [description, setDescription] = useState(
    "We are a dedicated team committed to providing the best services to our clients."
  );
  const [editingDesc, setEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState("");

  const [bullets, setBullets] = useState([
    "10+ years of experience",
    "500+ satisfied clients",
    "24/7 customer support",
  ]);
  const [editingBullet, setEditingBullet] = useState<number | null>(null);
  const [tempBullet, setTempBullet] = useState("");
  const [newBullet, setNewBullet] = useState("");
  const [addingBullet, setAddingBullet] = useState(false);

  const saveBullet = (index: number) => {
    if (tempBullet.trim()) {
      const updated = [...bullets];
      updated[index] = tempBullet.trim();
      setBullets(updated);
    }
    setEditingBullet(null);
  };

  const deleteBullet = (index: number) => setBullets(bullets.filter((_, i) => i !== index));

  const addBullet = () => {
    if (newBullet.trim()) {
      setBullets([...bullets, newBullet.trim()]);
      setNewBullet("");
      setAddingBullet(false);
    }
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Page Title */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Page Title</span>
            {editingTitle ? (
              <div className="flex gap-1">
                <button onClick={() => { setTitle(tempTitle); setEditingTitle(false); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50"><Check size={15} /></button>
                <button onClick={() => setEditingTitle(false)} className="p-1.5 text-red-500 hover:bg-red-50"><X size={15} /></button>
              </div>
            ) : (
              <button onClick={() => { setTempTitle(title); setEditingTitle(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={15} /></button>
            )}
          </div>
          <div className="px-6 py-5">
            {editingTitle ? (
              <input autoFocus value={tempTitle} onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setTitle(tempTitle); setEditingTitle(false); } if (e.key === "Escape") setEditingTitle(false); }}
                className="w-full border border-blue-500 bg-blue-50 px-3 py-2 text-base focus:outline-none" />
            ) : (
              <p className="text-xl font-bold text-gray-900">{title}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</span>
            {editingDesc ? (
              <div className="flex gap-1">
                <button onClick={() => { setDescription(tempDesc); setEditingDesc(false); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50"><Check size={15} /></button>
                <button onClick={() => setEditingDesc(false)} className="p-1.5 text-red-500 hover:bg-red-50"><X size={15} /></button>
              </div>
            ) : (
              <button onClick={() => { setTempDesc(description); setEditingDesc(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={15} /></button>
            )}
          </div>
          <div className="px-6 py-5">
            {editingDesc ? (
              <textarea autoFocus value={tempDesc} onChange={(e) => setTempDesc(e.target.value)}
                rows={4} className="w-full border border-blue-500 bg-blue-50 px-3 py-2 text-base focus:outline-none resize-none" />
            ) : (
              <p className="text-base text-gray-700 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Key Points</span>
            <button onClick={() => setAddingBullet(true)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg">
              <Plus size={14} /> Add Point
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4">
                <span className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingBullet === i ? (
                    <input autoFocus value={tempBullet} onChange={(e) => setTempBullet(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveBullet(i); if (e.key === "Escape") setEditingBullet(null); }}
                      className="w-full border border-blue-500 bg-blue-50 px-3 py-1.5 text-base focus:outline-none" />
                  ) : (
                    <p className="text-base text-gray-800 font-medium">{bullet}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {editingBullet === i ? (
                    <>
                      <button onClick={() => saveBullet(i)} className="p-1.5 text-emerald-600 hover:bg-emerald-50"><Check size={14} /></button>
                      <button onClick={() => setEditingBullet(null)} className="p-1.5 text-red-500 hover:bg-red-50"><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setTempBullet(bullet); setEditingBullet(i); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={14} /></button>
                      <button onClick={() => deleteBullet(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {addingBullet && (
              <div className="flex items-center gap-3 px-6 py-4">
                <span className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />
                <input autoFocus value={newBullet} onChange={(e) => setNewBullet(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addBullet(); if (e.key === "Escape") { setAddingBullet(false); setNewBullet(""); } }}
                  placeholder="Enter new point..." className="flex-1 border border-blue-500 bg-blue-50 px-3 py-1.5 text-base focus:outline-none" />
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={addBullet} className="p-1.5 text-emerald-600 hover:bg-emerald-50"><Check size={14} /></button>
                  <button onClick={() => { setAddingBullet(false); setNewBullet(""); }} className="p-1.5 text-red-500 hover:bg-red-50"><X size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors rounded-lg">
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
