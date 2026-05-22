"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CommonTable from "@/components/CommonTable";
import { Plus, LayoutDashboard, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(null);

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // IMPORTANT: use image/png to keep transparent background
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
};

const inputCls = "w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5";

export default function SebaAssociatedPage() {
  const [associated, setAssociated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", image: null as File | null });

  // Cropper states
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setShowCropper(true);
        setCrop(undefined);
        setCompletedCrop(null);
        setImgRef(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImgRef(e.currentTarget);

    const aspect = 116 / 110;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(initialCrop);

    // Initial completed crop in pixels
    const pixelWidth = (initialCrop.width / 100) * width;
    const pixelHeight = (initialCrop.height / 100) * height;
    const pixelX = (initialCrop.x / 100) * width;
    const pixelY = (initialCrop.y / 100) * height;

    setCompletedCrop({
      unit: 'px',
      x: pixelX,
      y: pixelY,
      width: pixelWidth,
      height: pixelHeight
    });
  };

  const handleCrop = async () => {
    if (!originalImage || !completedCrop || !imgRef) return;
    try {
      const blob = await getCroppedImg(imgRef, completedCrop);
      if (blob) {
        const file = new File([blob], "logo.png", { type: "image/png" });
        setFormData({ ...formData, image: file });
        setShowCropper(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAssociated = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/seba/associated`);
      if (data.status === "Success") {
        setAssociated(data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch Associated data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociated();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("image", formData.image);

      const response = await api.post('/seba/associated', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.status === "Success") {
        toast.success("Created successfully!");
        setFormData({ name: "", image: null });
        setIsDrawerOpen(false);
        fetchAssociated();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const response = await api.delete(`/seba/associated/${id}`);
      if (response.data.status === "Success") {
        toast.success("Deleted successfully");
        fetchAssociated();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    {
      header: "Image", accessor: "image",
      render: (row: any) => (
        <div className="h-12 w-12 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-1">
          <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${row.image}`} alt={row.name} className="max-h-full max-w-full object-contain" />
        </div>
      )
    },
    {
      header: "Name", accessor: "name",
      render: (row: any) => <p className="font-bold text-gray-900 text-sm">{row.name}</p>
    },
    {
      header: "Actions", accessor: "_id",
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center shadow">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">SEBA Associated</h3>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus size={16} className="stroke-[2.5]" /> Add Association
          </button>
        </div>

        {/* Slide-over Drawer with Blur Overlay */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end transition-all">
            <div className="w-[450px] bg-white h-screen max-h-screen shadow-2xl p-6 flex flex-col border-l border-gray-100 animate-slide-in">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center">
                    <LayoutDashboard size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Create SEBA Associated</h3>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)} 
                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Association Name *</label>
                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="e.g. ARCHITECT ASSOCIATION" />
                  </div>
                  <div>
                    <label className={labelCls}>Logo / Image *</label>
                    <input type="file" accept="image/*" required onChange={handleImageSelect} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 px-3 py-2.5 rounded-lg bg-white shadow-sm" />
                  </div>
                </div>

                <div className="border-t pt-4 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsDrawerOpen(false)} 
                    className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60"
                  >
                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={16} className="stroke-[2.5]" /> Create</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">SEBA Associated List</h3>
          </div>
          <div className="p-6">
            <CommonTable
              columns={columns}
              data={associated}
              isLoading={loading}
              totalRecords={associated.length}
              currentPage={1}
              limit={100}
              onPageChange={() => {}}
              onSearch={() => {}}
            />
          </div>
        </div>

        {showCropper && originalImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full flex flex-col items-center shadow-2xl">
              <h3 className="text-gray-900 text-sm font-extrabold uppercase tracking-wider mb-4">Adjust Logo / Image</h3>
              
              {/* Crop Frame */}
              <div className="relative w-full max-h-[400px] bg-gray-900 rounded-lg overflow-auto shadow-inner flex items-center justify-center p-2 border border-gray-100">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    src={originalImage}
                    onLoad={onImageLoad}
                    className="max-h-[350px] w-auto object-contain"
                    alt="Source"
                  />
                </ReactCrop>
              </div>

              <p className="text-[10px] text-gray-500 font-bold mt-3">Drag corners to resize the frame, or drag inside to position it.</p>

              {/* Actions */}
              <div className="flex gap-3 mt-6 w-full">
                <button 
                  type="button" 
                  onClick={() => setShowCropper(false)} 
                  className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleCrop} 
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md cursor-pointer"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
