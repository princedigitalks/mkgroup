"use client";

import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Camera, Phone, MapPin, Clock, Globe, User, Pencil, Check, X, Loader2, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProfile, updateProfile } from "@/lib/redux/slices/authSlice";
import { toast } from "sonner";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils";
import Cropper, { Area } from 'react-easy-crop';

const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(null);

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // IMPORTANT: use image/png to keep transparent background
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    };
    image.onerror = (error) => reject(error);
  });
};

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
    logo: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");
  
  // Cropper states
  const [cropType, setCropType] = useState<"profile" | "logo" | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);


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
        number: formatPhoneNumber(user.number || ""),
        location: user.location || "",
        timing: user.timing || "",
        website: user.website || "",
        profileImage: user.profileImage || "",
        logo: user.logo || "",
      });
    }
  }, [user]);

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(field === "number" ? formatPhoneNumber(value) : value);
  };

  const saveField = () => {
    if (editingField) {
      const finalValue = editingField === "number" ? formatPhoneNumber(tempValue) : tempValue;
      setLocalProfile((prev) => ({ ...prev, [editingField]: finalValue }));
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setCropType("profile");
        setShowCropper(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (!originalImage || !croppedAreaPixels || !cropType) return;
    try {
      const blob = await getCroppedImg(originalImage, croppedAreaPixels);
      if (blob) {
        const file = new File(
          [blob],
          cropType === "profile" ? "profile.png" : "logo.png",
          { type: "image/png" }
        );
        if (cropType === "profile") {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
        } else {
          setSelectedLogo(file);
          setLogoPreviewUrl(URL.createObjectURL(file));
        }
        setShowCropper(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleSaveProfile = async () => {
    // Ensure any open editing field value is captured before submitting
    const finalProfile = { ...localProfile };
    if (editingField) {
      const finalValue = editingField === "number" ? formatPhoneNumber(tempValue) : tempValue;
      finalProfile[editingField as keyof typeof localProfile] = finalValue;
      setLocalProfile(finalProfile);
      setEditingField(null);
    }

    const formData = new FormData();
    formData.append("name", finalProfile.name);
    formData.append("number", cleanPhoneNumber(finalProfile.number));
    formData.append("location", finalProfile.location);
    formData.append("timing", finalProfile.timing);
    formData.append("website", finalProfile.website);

    if (selectedFile) formData.append("profileImage", selectedFile);
    if (selectedLogo) formData.append("logo", selectedLogo);

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
    { key: "location", label: "Address", icon: MapPin, placeholder: "Enter address" },
    { key: "timing", label: "Timing", icon: Clock, placeholder: "e.g. Mon-Sat: 9AM - 6PM" },
    { key: "website", label: "Website", icon: Globe, placeholder: "Enter website URL" },
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
      <div className="mx-auto space-y-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative">
           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Profile Settings</p>
            <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Profile Image</p>
              <div className="relative">
                <div className="h-28 w-28 bg-[#eeeeee] border border-gray-200 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner">
                  {getImageUrl() ? (
                    <img src={getImageUrl()} alt="Profile" className="h-full w-full object-contain" />
                  ) : (
                    <User size={36} className="text-gray-300" />
                  )}
                </div>
                <button onClick={() => fileRef.current?.click()} className="absolute -bottom-2 -right-2 h-9 w-9 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors rounded-full border-2 border-white shadow-lg cursor-pointer"><Camera size={16} /></button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Company Logo</p>
              <div className="relative">
                <div className="h-28 w-28 bg-[#eeeeee] border border-gray-200 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner">
                  {getLogoUrl() ? (
                    <img src={getLogoUrl()} alt="Logo" className="h-full w-full object-contain p-2" />
                  ) : (
                    <Globe size={36} className="text-gray-300" />
                  )}
                </div>
                <button onClick={() => logoRef.current?.click()} className="absolute -bottom-2 -right-2 h-9 w-9 bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors rounded-full border-2 border-white shadow-lg cursor-pointer"><Camera size={16} /></button>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-50">
            {fields.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="flex items-start justify-between py-4 gap-4 group">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-9 w-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                    <Icon size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                    {editingField === key ? (
                      <div className="space-y-2 w-full">
                        <input
                          autoFocus
                          value={tempValue}
                          onChange={(e) => {
                            const val = key === "number" ? formatPhoneNumber(e.target.value) : e.target.value;
                            setTempValue(val);
                            // Instantly store in localProfile so hitting primary save button captures typing flawlessly
                            setLocalProfile(prev => ({ ...prev, [key]: val }));
                          }}
                          onKeyDown={(e) => e.key === "Enter" && saveField()}
                          placeholder={placeholder}
                          className="w-full border-b-2 border-blue-600 bg-blue-50/50 px-2 py-1 text-sm font-semibold focus:outline-none transition-all"
                        />
                        {key === "timing" && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {[
                              "Mon-Sat: 9:00 AM - 6:00 PM",
                              "Mon-Sat: 10:00 AM - 7:00 PM",
                              "Mon-Fri: 9:00 AM - 6:00 PM",
                              "Mon-Sun: 9:00 AM - 9:00 PM",
                              "24 Hours Open"
                            ].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  setTempValue(preset);
                                  setLocalProfile(prev => ({ ...prev, timing: preset }));
                                }}
                                className="text-[9px] font-extrabold bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 px-2.5 py-1 rounded-full transition-all cursor-pointer border border-gray-200 hover:border-blue-600 shadow-2xs"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {(localProfile as any)[key] || <span className="text-gray-300 italic font-normal">Not set</span>}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  {editingField === key ? (
                    <>
                      <button onClick={saveField} className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 transition-all rounded-lg flex items-center justify-center cursor-pointer">
                        <Check size={18} />
                      </button>
                      <button onClick={cancelEdit} className="h-8 w-8 text-red-500 hover:bg-red-50 transition-all rounded-lg flex items-center justify-center cursor-pointer">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(key, (localProfile as any)[key])}
                      className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full mt-8 bg-blue-600 text-white py-4 text-sm font-black uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {loading ? "Saving Changes..." : "Save Profile Changes"}
          </button>

        {showCropper && originalImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full flex flex-col items-center shadow-2xl animate-slide-in">
              <h3 className="text-gray-900 text-sm font-black uppercase tracking-wider mb-4">
                {cropType === "profile" ? "Adjust Profile Picture" : "Adjust Company Logo"}
              </h3>
              
              <div className="relative w-full h-[300px] bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] bg-white rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                <Cropper
                  image={originalImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={cropType === "profile" ? 1 : 300 / 128}
                  cropShape={cropType === "profile" ? "round" : "rect"}
                  restrictPosition={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <p className="text-[10px] text-gray-400 font-bold mt-3">Pinch or drag to crop like mobile apps</p>

              <div className="w-full mt-4 flex items-center gap-3">
                <span className="text-xs text-gray-400 font-bold">Zoom</span>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.1" 
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))} 
                  className={`w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                    cropType === "profile" ? "accent-blue-600" : "accent-purple-600"
                  }`}
                />
                <span className="text-xs text-gray-700 font-bold w-8">{zoom.toFixed(1)}x</span>
              </div>

              <div className="flex gap-3 mt-6 w-full">
                <button 
                  type="button" 
                  onClick={() => setShowCropper(false)} 
                  className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleCrop} 
                  className={`flex-1 text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    cropType === "profile" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25" : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/25"
                  }`}
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
    </DashboardLayout>
  );
}
