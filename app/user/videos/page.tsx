"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, Check, X, Video, Upload, Play } from "lucide-react";

interface VideoItem {
  id: number;
  url: string;
  name: string;
  title: string;
  size: string;
  uploadedAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [playing, setPlaying] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newVideos: VideoItem[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      title: file.name.replace(/\.[^/.]+$/, ""),
      size: formatSize(file.size),
      uploadedAt: new Date().toLocaleDateString(),
    }));
    setVideos((prev) => [...prev, ...newVideos]);
    e.target.value = "";
  };

  const saveTitle = (id: number) => {
    setVideos(videos.map((v) => v.id === id ? { ...v, title: tempTitle || v.name } : v));
    setEditingTitle(null);
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-4">

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Video Gallery</h2>
            <p className="text-sm text-gray-400 mt-0.5">{videos.length} video{videos.length !== 1 ? "s" : ""} uploaded</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} /> Add Videos
          </button>
          <input ref={fileRef} type="file" accept="video/*" multiple className="hidden" onChange={handleFiles} />
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div
            onClick={() => fileRef.current?.click()}
            className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl px-6 py-16 flex flex-col items-center gap-3 cursor-pointer transition-colors"
          >
            <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <Video size={28} className="text-blue-400" />
            </div>
            <p className="text-base font-semibold text-gray-500">Click to upload videos</p>
            <p className="text-sm text-gray-400">MP4, MOV, WEBM supported</p>
          </div>
        )}

        {/* Video Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  {playing === video.id ? (
                    <video
                      src={video.url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                      onEnded={() => setPlaying(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <video src={video.url} className="w-full h-full object-contain opacity-60" />
                      <button
                        onClick={() => setPlaying(video.id)}
                        className="absolute h-12 w-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                      >
                        <Play size={20} className="text-blue-600 ml-1" fill="currentColor" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-4 py-3">
                  {editingTitle === video.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveTitle(video.id); if (e.key === "Escape") setEditingTitle(null); }}
                        className="flex-1 border border-blue-500 bg-blue-50 px-2 py-1 text-sm rounded-md focus:outline-none"
                      />
                      <button onClick={() => saveTitle(video.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14} /></button>
                      <button onClick={() => setEditingTitle(null)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setTempTitle(video.title); setEditingTitle(video.id); }}
                      className="w-full text-left group"
                    >
                      <p className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{video.title}</p>
                    </button>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{video.size} · {video.uploadedAt}</p>
                    {deleteId === video.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => { setVideos(videos.filter((v) => v.id !== video.id)); setDeleteId(null); }} className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                        <button onClick={() => setDeleteId(null)} className="px-2 py-1 text-xs font-semibold border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(video.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add more tile */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors min-h-[180px]"
            >
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-400">Add More Videos</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
