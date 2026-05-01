"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CommonTable from "@/components/CommonTable";
import { Plus, LayoutDashboard, Trash2, X, Image as ImageIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const inputCls = "w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5";

export default function SebaSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({ type: "sponsor", image: null as File | null });

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

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("type", formData.type);
      form.append("image", formData.image);

      const response = await api.post('/seba/sponsor', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.status === "Success") {
        toast.success("Created successfully!");
        setFormData({ type: "sponsor", image: null });
        setIsDrawerOpen(false);
        fetchSponsors();
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
              <ImageIcon size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">SEBA Sponsors</h3>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus size={16} className="stroke-[2.5]" /> Add Sponsor
          </button>
        </div>

        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end transition-all">
            <div className="w-[450px] bg-white h-screen max-h-screen shadow-2xl p-6 flex flex-col border-l border-gray-100 animate-slide-in">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center">
                    <ImageIcon size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Add New Sponsor</h3>
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
                    <label className={labelCls}>Image *</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      required 
                      onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 px-3 py-2.5 rounded-lg bg-white shadow-sm" 
                    />
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
                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={16} className="stroke-[2.5]" /> Add</>}
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
