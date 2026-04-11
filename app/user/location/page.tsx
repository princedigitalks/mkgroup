"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Pencil, Trash2, Check, X, MapPin, Phone, Mail, Globe, Map } from "lucide-react";

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  mapLink: string;
}

const emptyLocation: Omit<Location, "id"> = { name: "", address: "", phone: "", email: "", website: "", mapLink: "" };
const inputCls = "w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
const labelCls = "text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1";

export default function LocationPage() {
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: "Main Clinic", address: "123, Vesu Main Road, Surat, Gujarat - 395007", phone: "9374714610", email: "clinic@example.com", website: "www.example.com", mapLink: "https://maps.google.com" },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempData, setTempData] = useState<Omit<Location, "id">>(emptyLocation);
  const [showForm, setShowForm] = useState(false);
  const [newData, setNewData] = useState<Omit<Location, "id">>(emptyLocation);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const startEdit = (loc: Location) => { setEditingId(loc.id); setTempData({ name: loc.name, address: loc.address, phone: loc.phone, email: loc.email, website: loc.website, mapLink: loc.mapLink }); };
  const saveEdit = () => { setLocations(locations.map((l) => l.id === editingId ? { ...l, ...tempData } : l)); setEditingId(null); };
  const addLocation = () => { if (!newData.name.trim()) return; setLocations([...locations, { id: Date.now(), ...newData }]); setNewData(emptyLocation); setShowForm(false); };

  const fields: { key: keyof Omit<Location, "id">; label: string; icon: React.ElementType; placeholder: string }[] = [
    { key: "name", label: "Location Name", icon: MapPin, placeholder: "e.g. Main Clinic" },
    { key: "address", label: "Address", icon: MapPin, placeholder: "Full address" },
    { key: "phone", label: "Phone", icon: Phone, placeholder: "Phone number" },
    { key: "email", label: "Email", icon: Mail, placeholder: "Email address" },
    { key: "website", label: "Website", icon: Globe, placeholder: "www.example.com" },
    { key: "mapLink", label: "Google Map Link", icon: Map, placeholder: "https://maps.google.com/..." },
  ];

  const renderForm = (data: Omit<Location, "id">, onChange: (k: string, v: string) => void) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ key, label, icon: Icon, placeholder }) => (
        <div key={key} className={key === "address" || key === "mapLink" ? "sm:col-span-2" : ""}>
          <label className={labelCls}>{label}</label>
          <div className="relative">
            <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={data[key]} onChange={(e) => onChange(key, e.target.value)} placeholder={placeholder} className={inputCls} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Locations</h2>
            <p className="text-sm text-gray-400 mt-0.5">{locations.length} location{locations.length !== 1 ? "s" : ""} added</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Add Location
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white border border-blue-200 p-6 space-y-4">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">New Location</p>
            {renderForm(newData, (k, v) => setNewData((p) => ({ ...p, [k]: v })))}
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowForm(false); setNewData(emptyLocation); }} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addLocation} className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Add Location</button>
            </div>
          </div>
        )}

        {/* Locations List */}
        <div className="space-y-3">
          {locations.length === 0 && <div className="bg-white border border-gray-200 px-6 py-12 text-center text-base text-gray-400">No locations added yet.</div>}
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span className="text-base font-bold text-gray-900">{loc.name || "Unnamed Location"}</span>
                </div>
                <div className="flex items-center gap-1">
                  {editingId === loc.id ? (
                    <>
                      <button onClick={saveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50"><Check size={15} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-red-500 hover:bg-red-50"><X size={15} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(loc)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={15} /></button>
                      {deleteId === loc.id ? (
                        <>
                          <button onClick={() => { setLocations(locations.filter((l) => l.id !== loc.id)); setDeleteId(null); }} className="p-1.5 text-red-600 hover:bg-red-50"><Check size={15} /></button>
                          <button onClick={() => setDeleteId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100"><X size={15} /></button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteId(loc.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="p-6">
                {editingId === loc.id ? renderForm(tempData, (k, v) => setTempData((p) => ({ ...p, [k]: v }))) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: MapPin, label: "Address", value: loc.address },
                      { icon: Phone, label: "Phone", value: loc.phone },
                      { icon: Mail, label: "Email", value: loc.email },
                      { icon: Globe, label: "Website", value: loc.website },
                    ].map(({ icon: Icon, label, value }) => value ? (
                      <div key={label} className="flex items-start gap-2.5">
                        <Icon size={15} className="text-blue-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-400 font-medium">{label}</p>
                          <p className="text-base text-gray-800 font-medium truncate">{value}</p>
                        </div>
                      </div>
                    ) : null)}
                    {loc.mapLink && (
                      <div className="sm:col-span-2 pt-1">
                        <a href={loc.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                          <Map size={15} /> Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
