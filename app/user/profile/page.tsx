"use client";

import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Camera, Phone, MapPin, Clock, Globe, User, Pencil, Check, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProfile, updateProfile } from "@/lib/redux/slices/authSlice";
import { toast } from "sonner";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [localProfile, setLocalProfile] = useState({
    name: "",
    number: "",
    location: "",
    timing: "",
    website: "",
    profileImage: "",
    secondaryNumber: "",
    whatsappNumber: "",
    facebookLink: "",
    instagramLink: "",
    messageNumber: "",
    logo: "",
    companyName: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setLocalProfile({
        name: user.name || "",
        number: user.number || "",
        location: user.location || "",
        timing: user.timing || "",
        website: user.website || "",
        profileImage: user.profileImage || "",
        secondaryNumber: user.secondaryNumber || "",
        whatsappNumber: user.whatsappNumber || "",
        facebookLink: user.facebookLink || "",
        instagramLink: user.instagramLink || "",
        messageNumber: user.messageNumber || "",
        logo: user.logo || "",
        companyName: user.companyName || "",
      });
    }
  }, [user]);

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveField = () => {
    if (editingField) {
      setLocalProfile((prev) => ({ ...prev, [editingField]: tempValue }));
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("name", localProfile.name);
    formData.append("number", localProfile.number);
    formData.append("location", localProfile.location);
    formData.append("timing", localProfile.timing);
    formData.append("website", localProfile.website);
    formData.append("secondaryNumber", localProfile.secondaryNumber);
    formData.append("whatsappNumber", localProfile.whatsappNumber);
    formData.append("facebookLink", localProfile.facebookLink);
    formData.append("instagramLink", localProfile.instagramLink);
    formData.append("messageNumber", localProfile.messageNumber);
    formData.append("companyName", localProfile.companyName);

    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    if (selectedLogo) {
      formData.append("logo", selectedLogo);
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      setSelectedFile(null);
      setSelectedLogo(null);
      setPreviewUrl("");
      setLogoPreviewUrl("");
    } catch (err: any) {
      toast.error(err || "Failed to update profile");
    }
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User, placeholder: "Enter full name" },
    { key: "number", label: "Phone Number", icon: Phone, placeholder: "Enter phone number" },
    { key: "secondaryNumber", label: "Secondary Number", icon: Phone, placeholder: "Enter secondary number" },
    { key: "whatsappNumber", label: "WhatsApp Number", icon: Phone, placeholder: "Enter WhatsApp number" },
    { key: "messageNumber", label: "Message (SMS) Number", icon: Phone, placeholder: "Enter SMS number" },
    { key: "location", label: "Address", icon: MapPin, placeholder: "Enter address" },
    { key: "timing", label: "Timing", icon: Clock, placeholder: "e.g. Mon-Sat: 9AM - 6PM" },
    { key: "website", label: "Website", icon: Globe, placeholder: "Enter website URL" },
    { key: "companyName", label: "Company Name", icon: Globe, placeholder: "Enter company name" },
    { key: "facebookLink", label: "Facebook Link", icon: Globe, placeholder: "Enter Facebook URL" },
    { key: "instagramLink", label: "Instagram Link", icon: Globe, placeholder: "Enter Instagram URL" },
  ];

  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (localProfile.profileImage) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${localProfile.profileImage}`;
    }
    return "";
  };

  const getLogoUrl = () => {
    if (logoPreviewUrl) return logoPreviewUrl;
    if (localProfile.logo) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${localProfile.logo}`;
    }
    return "";
  };

  if (loading && !user) {
    return (
      <DashboardLayout type="user">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="user">
      <div className=" mx-auto space-y-8">
        {/* Profile Card Preview */}
        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile Card</p>

          {/* Image */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Profile Image</p>
              <div className="relative">
                <div className="h-24 w-24 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {getImageUrl() ? (
                    <img src={getImageUrl()} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User size={36} className="text-gray-300" />
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 h-7 w-7 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  <Camera size={13} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Company Logo</p>
              <div className="relative">
                <div className="h-24 w-24 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {getLogoUrl() ? (
                    <img src={getLogoUrl()} alt="Logo" className="h-full w-full object-contain" />
                  ) : (
                    <Globe size={36} className="text-gray-300" />
                  )}
                </div>
                <button
                  onClick={() => logoRef.current?.click()}
                  className="absolute -bottom-2 -right-2 h-7 w-7 bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
                  disabled={loading}
                >
                  <Camera size={13} />
                </button>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
            </div>
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
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveField()}
                        placeholder={placeholder}
                        className="w-full border border-blue-500 bg-blue-50 px-2 py-1 text-sm focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {(localProfile as any)[key] || <span className="text-gray-300 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {editingField === key ? (
                    <>
                      <button onClick={saveField} className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 text-red-500 hover:bg-red-50 transition-colors">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(key, (localProfile as any)[key])}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full mt-5 bg-blue-600 text-white py-2.5 text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 rounded-lg"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

