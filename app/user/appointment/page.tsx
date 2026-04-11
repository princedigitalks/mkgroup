"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, X, Calendar, Clock, User, Phone, MessageSquare, Tag, ChevronDown, Check } from "lucide-react";

interface Appointment {
  id: number;
  name: string;
  mobile: string;
  person: string;
  category: string;
  date: string;
  time: string;
  message: string;
  createdAt: string;
}

const emptyForm = { name: "", mobile: "", person: "", category: "", date: "", time: "", message: "" };

const inputCls = "w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
const labelCls = "text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1";

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, name: "Rahul Mehta", mobile: "9876543210", person: "Dr. Sudip Joshi", category: "Consultation", date: "2025-02-10", time: "10:00", message: "First visit", createdAt: "2025-02-01" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.date) return;
    setAppointments([...appointments, { id: Date.now(), ...form, createdAt: new Date().toISOString().split("T")[0] }]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Appointments</h2>
            <p className="text-sm text-gray-400 mt-0.5">{appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-blue-200 p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">New Appointment</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Name *", icon: User, placeholder: "Patient name", type: "text", required: true },
                  { name: "mobile", label: "Mobile *", icon: Phone, placeholder: "Mobile number", type: "text", required: true },
                  { name: "person", label: "Person", icon: User, placeholder: "Doctor / Staff name", type: "text", required: false },
                  { name: "date", label: "Date *", icon: Calendar, placeholder: "", type: "date", required: true },
                  { name: "time", label: "Time", icon: Clock, placeholder: "", type: "time", required: false },
                ].map(({ name, label, icon: Icon, placeholder, type, required }) => (
                  <div key={name}>
                    <label className={labelCls}>{label}</label>
                    <div className="relative">
                      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name={name} value={(form as any)[name]} onChange={handleChange} required={required} placeholder={placeholder} type={type} className={inputCls} />
                    </div>
                  </div>
                ))}
                <div>
                  <label className={labelCls}>Category</label>
                  <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select name="category" value={form.category} onChange={handleChange} className={inputCls + " appearance-none cursor-pointer"}>
                      <option value="">Select category</option>
                      <option>Consultation</option>
                      <option>Follow-up</option>
                      <option>Emergency</option>
                      <option>Routine Checkup</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Message</label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" />
                  <textarea name="message" value={form.message} onChange={handleChange} rows={2} placeholder="Additional notes..." className="w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Book Appointment</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-base text-gray-400">No appointments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    {["Name", "Mobile", "Person", "Category", "Date", "Time", "Message", "Delete"].map((h, i) => (
                      <th key={h} className={`px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-left ${i < 7 ? "border-r border-blue-600" : "text-center"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, idx) => (
                    <tr key={apt.id} className={idx % 2 === 0 ? "bg-white hover:bg-blue-50 transition-colors" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
                      <td className="px-4 py-3.5 border-r border-gray-100 font-semibold text-gray-900 whitespace-nowrap">{apt.name}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-600 whitespace-nowrap">{apt.mobile}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-600 whitespace-nowrap">{apt.person || "—"}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100">
                        {apt.category ? <span className="bg-blue-100 text-blue-700 px-2.5 py-1 text-xs font-semibold">{apt.category}</span> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-600 whitespace-nowrap">{apt.date}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-600 whitespace-nowrap">{apt.time || "—"}</td>
                      <td className="px-4 py-3.5 border-r border-gray-100 text-gray-500 max-w-[160px] truncate">{apt.message || "—"}</td>
                      <td className="px-4 py-3.5 text-center">
                        {deleteId === apt.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => { setAppointments(appointments.filter((a) => a.id !== apt.id)); setDeleteId(null); }} className="p-1 text-red-600 hover:bg-red-50"><Check size={14} /></button>
                            <button onClick={() => setDeleteId(null)} className="p-1 text-gray-400 hover:bg-gray-100"><X size={14} /></button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteId(apt.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
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
