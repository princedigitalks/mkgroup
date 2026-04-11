"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Pencil, Trash2, Check, X, User, Camera } from "lucide-react";

interface Person {
  id: number;
  name: string;
  role: string;
  image: string;
}

export default function ContactPage() {
  const [persons, setPersons] = useState<Person[]>([
    { id: 1, name: "Dr. Sudip Joshi", role: "Senior Consultant", image: "" },
    { id: 2, name: "Priya Shah", role: "Receptionist", image: "" },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPerson, setTempPerson] = useState<Partial<Person>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", role: "", image: "" });
  const [newPreview, setNewPreview] = useState("");
  const editFileRef = useRef<HTMLInputElement>(null);
  const newFileRef = useRef<HTMLInputElement>(null);

  const startEdit = (person: Person) => { setEditingId(person.id); setTempPerson({ ...person }); };
  const saveEdit = () => { setPersons(persons.map((p) => p.id === editingId ? { ...p, ...tempPerson } as Person : p)); setEditingId(null); setTempPerson({}); };
  const deletePerson = (id: number) => setPersons(persons.filter((p) => p.id !== id));
  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) setTempPerson((p) => ({ ...p, image: URL.createObjectURL(f) })); };
  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { const url = URL.createObjectURL(f); setNewPreview(url); setNewPerson((p) => ({ ...p, image: url })); } };
  const addPerson = () => { if (!newPerson.name.trim()) return; setPersons([...persons, { id: Date.now(), ...newPerson }]); setNewPerson({ name: "", role: "", image: "" }); setNewPreview(""); setShowAddForm(false); };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Contact Persons</h2>
            <p className="text-sm text-gray-400 mt-0.5">{persons.length} person{persons.length !== 1 ? "s" : ""} added</p>
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Add Person
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white border border-blue-200 p-6 space-y-4">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">New Person</p>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="h-20 w-20 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {newPreview ? <img src={newPreview} className="h-full w-full object-cover" alt="" /> : <User size={28} className="text-gray-300" />}
                </div>
                <button onClick={() => newFileRef.current?.click()} className="absolute -bottom-2 -right-2 h-7 w-7 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"><Camera size={13} /></button>
                <input ref={newFileRef} type="file" accept="image/*" className="hidden" onChange={handleNewImage} />
              </div>
              <div className="flex-1 space-y-2.5">
                <input value={newPerson.name} onChange={(e) => setNewPerson((p) => ({ ...p, name: e.target.value }))} placeholder="Full Name *"
                  className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                <input value={newPerson.role} onChange={(e) => setNewPerson((p) => ({ ...p, role: e.target.value }))} placeholder="Role / Designation"
                  className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowAddForm(false); setNewPerson({ name: "", role: "", image: "" }); setNewPreview(""); }} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addPerson} className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Add Person</button>
            </div>
          </div>
        )}

        {/* Persons List */}
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {persons.length === 0 && <div className="px-6 py-12 text-center text-base text-gray-400">No persons added yet.</div>}
          {persons.map((person) => (
            <div key={person.id} className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="relative shrink-0">
                <div className="h-14 w-14 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {editingId === person.id && tempPerson.image ? <img src={tempPerson.image} className="h-full w-full object-cover" alt="" />
                    : person.image ? <img src={person.image} className="h-full w-full object-cover" alt="" />
                    : <User size={24} className="text-gray-300" />}
                </div>
                {editingId === person.id && (
                  <>
                    <button onClick={() => editFileRef.current?.click()} className="absolute -bottom-2 -right-2 h-6 w-6 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"><Camera size={11} /></button>
                    <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditImage} />
                  </>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {editingId === person.id ? (
                  <div className="space-y-2">
                    <input autoFocus value={tempPerson.name ?? ""} onChange={(e) => setTempPerson((p) => ({ ...p, name: e.target.value }))}
                      className="w-full border border-blue-500 bg-blue-50 px-3 py-2 text-base focus:outline-none" placeholder="Full Name" />
                    <input value={tempPerson.role ?? ""} onChange={(e) => setTempPerson((p) => ({ ...p, role: e.target.value }))}
                      className="w-full border border-blue-500 bg-blue-50 px-3 py-2 text-sm focus:outline-none" placeholder="Role / Designation" />
                  </div>
                ) : (
                  <>
                    <p className="text-base font-semibold text-gray-900 truncate">{person.name}</p>
                    <p className="text-sm text-gray-400 truncate mt-0.5">{person.role || "No role set"}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {editingId === person.id ? (
                  <>
                    <button onClick={saveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50"><Check size={15} /></button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-red-500 hover:bg-red-50"><X size={15} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(person)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={15} /></button>
                    <button onClick={() => deletePerson(person.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors rounded-lg">Save Changes</button>
      </div>
    </DashboardLayout>
  );
}
