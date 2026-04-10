"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Camera, Phone, MapPin, Clock, Globe, User, Pencil, Check, X } from "lucide-react";

interface ProfileData {
  name: string;
  phone: string;
  address: string;
  timing: string;
  website: string;
  image: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "Dr. Sudip Joshi",
    phone: "+91 93747 14610",
    address: "123, Vesu Main Road, Surat, Gujarat - 395007",
    timing: "Mon - Sat: 8:00 AM – 8:00 PM",
    website: "www.example.com",
    image: "",
  });

  const [editing, setEditing] = useState<Partial<ProfileData>>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (field: keyof ProfileData) => {
    setEditingField(field);
    setEditing({ [field]: profile[field] });
  };

  const saveEdit = () => {
    if (editingField) {
      setProfile((prev) => ({ ...prev, ...editing }));
    }
    setEditingField(null);
    setEditing({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditing({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: url }));
    }
  };

  const fields: { key: keyof ProfileData; label: string; icon: React.ElementType; placeholder: string }[] = [
    { key: "name", label: "Full Name", icon: User, placeholder: "Enter full name" },
    { key: "phone", label: "Phone Number", icon: Phone, placeholder: "Enter phone number" },
    { key: "address", label: "Address", icon: MapPin, placeholder: "Enter address" },
    { key: "timing", label: "Timing", icon: Clock, placeholder: "e.g. Mon-Sat: 9AM - 6PM" },
    { key: "website", label: "Website", icon: Globe, placeholder: "Enter website URL" },
  ];

  return (
    <DashboardLayout type="user">
      <div className=" mx-auto space-y-8">
        {/* Profile Card Preview */}
        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile Card</p>

          {/* Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                {profile.image ? (
                  <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User size={36} className="text-gray-300" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 h-7 w-7 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Camera size={13} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <p className="text-xs text-gray-400 mt-3">Click camera to change photo</p>
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-100">
            {fields.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="flex items-start justify-between py-3 gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                    {editingField === key ? (
                      <input
                        autoFocus
                        value={editing[key] ?? ""}
                        onChange={(e) => setEditing({ [key]: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        placeholder={placeholder}
                        className="w-full border border-blue-500 bg-blue-50 px-2 py-1 text-sm focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {profile[key] || <span className="text-gray-300 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {editingField === key ? (
                    <>
                      <button onClick={saveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 text-red-500 hover:bg-red-50 transition-colors">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(key)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button className="w-full mt-5 bg-blue-600 text-white py-2.5 text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors">
            Save Profile
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
