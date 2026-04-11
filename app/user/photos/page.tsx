"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, Check, X, Image as ImageIcon, Upload } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  name: string;
  uploadedAt: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: Photo[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      uploadedAt: new Date().toLocaleDateString(),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Photo Gallery</h2>
            <p className="text-sm text-gray-400 mt-0.5">{photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} /> Add Photos
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        </div>

        {/* Empty State */}
        {photos.length === 0 && (
          <div
            onClick={() => fileRef.current?.click()}
            className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl px-6 py-16 flex flex-col items-center gap-3 cursor-pointer transition-colors"
          >
            <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <ImageIcon size={28} className="text-blue-400" />
            </div>
            <p className="text-base font-semibold text-gray-500">Click to upload photos</p>
            <p className="text-sm text-gray-400">JPG, PNG, WEBP supported</p>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Upload tile */}
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Upload size={22} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-400">Add More</span>
            </div>

            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group rounded-xl overflow-hidden border border-gray-200">
                <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  {deleteId === photo.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setPhotos(photos.filter((p) => p.id !== photo.id)); setDeleteId(null); }}
                        className="h-8 w-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="h-8 w-8 bg-white text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(photo.id)}
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Name tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate">{photo.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
