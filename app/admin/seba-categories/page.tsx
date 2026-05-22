"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CommonTable from "@/components/CommonTable";
import { Plus, LayoutDashboard, Trash2, X, Tags, Pencil } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const inputCls = "w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5";

export default function SebaCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "", subCategories: "" });
  const [subCategoriesList, setSubCategoriesList] = useState<string[]>([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/seba/category`);
      if (data.status === "Success") {
        // Sort categories alphabetically by name
        const sortedCats = [...data.data].sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCategories(sortedCats);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name: formData.name,
      subCategories: subCategoriesList.map(s => s.trim()).filter(Boolean)
    };

    try {
      if (isEditing && editingId) {
        const response = await api.put(`/seba/category/${editingId}`, payload);
        if (response.data.status === "Success") {
          toast.success("Category updated successfully!");
          closeDrawer();
          fetchCategories();
        }
      } else {
        const response = await api.post('/seba/category', payload);
        if (response.data.status === "Success") {
          toast.success("Category created successfully!");
          closeDrawer();
          fetchCategories();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", subCategories: "" });
    setSubCategoriesList([]);
  };

  const handleEdit = (category: any) => {
    setIsEditing(true);
    setEditingId(category._id);
    setFormData({
      name: category.name,
      subCategories: ""
    });
    setSubCategoriesList(category.subCategories || []);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await api.delete(`/seba/category/${id}`);
      if (response.data.status === "Success") {
        toast.success("Deleted successfully");
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    {
      header: "Category Name", accessor: "name",
      render: (row: any) => (
        <div className="py-1">
          <p className="font-bold text-gray-900 text-sm">{row.name}</p>
          {row.subCategories && row.subCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[...row.subCategories].sort((a: string, b: string) => a.localeCompare(b)).map((sub: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold border border-indigo-100">
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      header: "Actions", accessor: "_id",
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            title="Edit Category"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete Category"
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
              <Tags size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Business Categories</h3>
          </div>
          <button 
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData({ name: "", subCategories: "" });
              setSubCategoriesList([""]);
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus size={16} className="stroke-[2.5]" /> Add Category
          </button>
        </div>
 
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end transition-all">
            <div className="w-[450px] bg-white h-screen max-h-screen shadow-2xl p-6 flex flex-col border-l border-gray-100 animate-slide-in">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Tags size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                    {isEditing ? "Edit Category" : "Add New Category"}
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
                    <label className={labelCls}>Category Name *</label>
                    <input 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className={inputCls} 
                      placeholder="e.g. Builder & Developers" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={labelCls}>Sub Categories</label>
                      <button
                        type="button"
                        onClick={() => setSubCategoriesList([...subCategoriesList, ""])}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} className="stroke-[2.5]" /> Add Sub Category
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {subCategoriesList.map((subCat, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={subCat}
                            onChange={(e) => {
                              const newList = [...subCategoriesList];
                              newList[index] = e.target.value;
                              setSubCategoriesList(newList);
                            }}
                            className={inputCls}
                            placeholder={`e.g. Sub Category ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newList = subCategoriesList.filter((_, idx) => idx !== index);
                              setSubCategoriesList(newList);
                            }}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm shrink-0"
                            title="Delete Sub Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {subCategoriesList.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                          No sub categories added. Click "+ Add Sub Category" to start.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
 
                <div className="border-t pt-4 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={closeDrawer} 
                    className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} className="stroke-[2.5]" />
                        {isEditing ? "Save Changes" : "Create"}
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
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Categories List</h3>
          </div>
          <div className="p-6">
            <CommonTable
              columns={columns}
              data={categories}
              isLoading={loading}
              totalRecords={categories.length}
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
