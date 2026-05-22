"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CommonTable from "@/components/CommonTable";
import { Plus, Trash2, X, Image as ImageIcon, Pencil } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils";


const inputCls = "w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5";

export default function SebaSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentAdImage, setCurrentAdImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({ 
    type: "sponsor", 
    image: null as File | null, 
    adImage: null as File | null, 
    nfcNumber: "" 
  });



  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/seba/sponsor`);
      if (data.status === "Success") {
        setSponsors(data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };



  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setCurrentImage(null);
    setCurrentAdImage(null);
    setFormData({ type: "sponsor", image: null, adImage: null, nfcNumber: "" });
  };

  const handleEdit = (sponsor: any) => {
    setIsEditing(true);
    setEditingId(sponsor._id);
    setFormData({
      type: sponsor.type,
      image: null,
      adImage: null,
      nfcNumber: sponsor.nfcNumber ? formatPhoneNumber(sponsor.nfcNumber) : ""
    });
    setCurrentImage(sponsor.image);
    setCurrentAdImage(sponsor.adImage || null);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEditing && !formData.image) {
      toast.error("Please upload an image");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("type", formData.type);
      if (formData.image) {
        form.append("image", formData.image);
      }
      if (formData.adImage) {
        form.append("adImage", formData.adImage);
      }
      form.append("nfcNumber", formData.nfcNumber ? cleanPhoneNumber(formData.nfcNumber) : "");

      let response;
      if (isEditing && editingId) {
        response = await api.put(`/seba/sponsor/${editingId}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/seba/sponsor', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.status === "Success") {
        toast.success(isEditing ? "Updated successfully!" : "Created successfully!");
        closeDrawer();
        fetchSponsors();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const response = await api.delete(`/seba/sponsor/${id}`);
      if (response.data.status === "Success") {
        toast.success("Deleted successfully");
        fetchSponsors();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    {
      header: "Image", accessor: "image",
      render: (row: any) => (
        <div className="h-16 w-32 bg-gray-100 border border-gray-200 overflow-hidden shadow-sm rounded-lg flex items-center justify-center">
          <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${row.image}`} alt={row.type} className="max-h-full max-w-full object-contain" />
        </div>
      )
    },
    {
      header: "Type", accessor: "type",
      render: (row: any) => (
        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
          row.type === 'sponsor' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {row.type}
        </span>
      )
    },
    {
      header: "Actions", accessor: "_id",
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
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
              <ImageIcon size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">SEBA Sponsors</h3>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" /> Add Sponsor
          </button>
        </div>

        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end transition-all">
            <div className="w-[450px] bg-white h-screen max-h-screen shadow-2xl p-6 flex flex-col border-l border-gray-100 animate-slide-in overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center">
                    <ImageIcon size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                    {isEditing ? "Edit Sponsor" : "Add New Sponsor"}
                  </h3>
                </div>
                <button 
                  onClick={closeDrawer} 
                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Type *</label>
                    <select 
                      required 
                      value={formData.type} 
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                      className={inputCls}
                    >
                      <option value="sponsor">Sponsor</option>
                      <option value="co-sponsor">Co-Sponsor</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Image {isEditing ? "(Optional)" : "*"}</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      required={!isEditing && !formData.image} 
                      onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                      onChange={handleImageSelect} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 px-3 py-2.5 rounded-lg bg-white shadow-sm" 
                    />
                    {formData.image ? (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 mb-2 font-bold">✓ Image selected</p>
                        <p className="text-[10px] font-bold text-gray-400 mb-1">New Image Preview:</p>
                        <div className="h-16 w-32 bg-gray-100 border border-gray-200 overflow-hidden shadow-sm rounded-lg flex items-center justify-center">
                          <img src={URL.createObjectURL(formData.image)} className="max-h-full max-w-full object-contain" alt="Preview" />
                        </div>
                      </div>
                    ) : isEditing && currentImage ? (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-gray-400 mb-1">Current Image:</p>
                        <div className="h-16 w-32 bg-gray-100 border border-gray-200 overflow-hidden shadow-sm rounded-lg flex items-center justify-center">
                          <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${currentImage}`} className="max-h-full max-w-full object-contain" alt="Current" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className={labelCls}>Ad Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFormData({ ...formData, adImage: file });
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 px-3 py-2.5 rounded-lg bg-white shadow-sm" 
                    />
                    {formData.adImage && <p className="text-xs text-green-600 mt-2 font-bold">✓ Ad Image selected</p>}
                    {isEditing && currentAdImage && !formData.adImage && (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-gray-400 mb-1">Current Ad Image:</p>
                        <div className="h-16 w-32 bg-gray-100 border border-gray-200 overflow-hidden shadow-sm rounded-lg flex items-center justify-center">
                          <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${currentAdImage}`} className="max-h-full max-w-full object-contain" alt="Current Ad" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>NFC Number (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. 98765 43210"
                      value={formData.nfcNumber}
                      onChange={(e) => setFormData({ ...formData, nfcNumber: formatPhoneNumber(e.target.value) })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-6 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={closeDrawer} 
                    className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || (!isEditing && !formData.image)} 
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isEditing ? (
                          <>Save Changes</>
                        ) : (
                          <>
                            <Plus size={16} className="stroke-[2.5]" /> Add
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Sponsors List</h3>
          </div>
          <div className="p-6">
            <CommonTable
              columns={columns}
              data={sponsors}
              isLoading={loading}
              totalRecords={sponsors.length}
              currentPage={1}
              limit={100}
              onPageChange={() => {}}
              onSearch={() => {}}
            />
          </div>
        </div>



      </div>
    </DashboardLayout>
  );
}
