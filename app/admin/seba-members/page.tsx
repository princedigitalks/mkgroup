"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CommonTable from "@/components/CommonTable";
import { Plus, Users, Trash2, Check, X, FileText, Phone, MapPin, Building2, Briefcase, Globe, Download } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import { toast } from "sonner";
import api from "@/lib/axios";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils";

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { jsPDF } from "jspdf";

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

const inputCls = "w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all rounded-lg shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5";

export default function SebaMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, inactive: 0 });

  const [formData, setFormData] = useState({
    name: "", category: "", subCategory: "", company: "",
    mobile: formatPhoneNumber(""), address: "", emailWebsite: "", position: "",
    officeNo: formatPhoneNumber(""), area: "", pincode: "", city: "Surat", state: "Gujarat",
    image: null as File | null, natureOfBusiness: ""
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [categorySelection, setCategorySelection] = useState("");
  const [subCategorySelection, setSubCategorySelection] = useState("");
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [otherCategoryName, setOtherCategoryName] = useState("");

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

    const aspect = 7 / 8;
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
        const file = new File([blob], "passport_photo.png", { type: "image/png" });
        setFormData({ ...formData, image: file });
        setShowCropper(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMembers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      let url = `/seba/member?page=${page}&limit=10`;
      if (filterStatus) url += `&status=${filterStatus}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const { data } = await api.get(url);
      if (data.status === "Success") {
        if (data.total !== undefined) {
          setMembers(data.data);
          setTotalRecords(data.total);
          setCurrentPage(data.page);
          if (data.stats) {
            setStats(data.stats);
          }
        } else {
          setMembers(data.data);
          setTotalRecords(data.data.length);
          setCurrentPage(1);
          const localStats = {
            total: data.data.length,
            active: data.data.filter((m: any) => m.status === "active").length,
            pending: data.data.filter((m: any) => m.status === "pending").length,
            inactive: data.data.filter((m: any) => m.status === "inactive" || m.status === "rejected").length,
          };
          setStats(localStats);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch Members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/seba/category');
        if (data.status === 'Success') {
          const sortedCats = [...data.data].sort((a: any, b: any) => a.name.localeCompare(b.name));
          setCategories(sortedCats);
        }
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof typeof formData]) {
          let value = formData[key as keyof typeof formData];
          if (key === 'mobile' || key === 'officeNo') {
            value = cleanPhoneNumber(value as string);
          }
          form.append(key, value as any);
        }
      });

      if (isEditing && editingId) {
        const response = await api.put(`/seba/member/${editingId}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.status === "Success") {
          toast.success("Updated successfully!");
          closeDrawer();
          fetchMembers(currentPage, searchQuery);
        }
      } else {
        form.append("status", "active"); // Admin creates as active directly
        const response = await api.post('/seba/member', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.status === "Success") {
          toast.success("Created successfully!");
          closeDrawer();
          fetchMembers(1, searchQuery);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: "", category: "", subCategory: "", company: "",
      mobile: formatPhoneNumber(""), address: "", emailWebsite: "", position: "",
      officeNo: formatPhoneNumber(""), area: "", pincode: "", city: "Surat", state: "Gujarat",
      image: null, natureOfBusiness: ""
    });
    setCategorySelection("");
    setSubCategorySelection("");
    setSubCategories([]);
    setShowOtherCategory(false);
    setOtherCategoryName("");
  };

  const handleEdit = (member: any) => {
    setIsEditing(true);
    setEditingId(member._id);
    setFormData({
      name: member.name,
      category: member.category,
      subCategory: member.subCategory || "",
      company: member.company || "",
      mobile: formatPhoneNumber(member.mobile),
      address: member.address || "",
      emailWebsite: member.emailWebsite || "",
      position: member.position || "",
      officeNo: member.officeNo ? formatPhoneNumber(member.officeNo) : "",
      area: member.area || "",
      pincode: member.pincode || "",
      city: member.city || "Surat",
      state: member.state || "Gujarat",
      image: null,
      natureOfBusiness: member.natureOfBusiness || ""
    });
    setCategorySelection(member.category);
    setSubCategorySelection(member.subCategory || "");
    const matchedCat = categories.find(c => c.name === member.category);
    const subs = matchedCat?.subCategories || [];
    const sortedSubs = [...subs].sort((a: string, b: string) => a.localeCompare(b));
    setSubCategories(sortedSubs.map((s: string) => ({ name: s })));
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await api.put(`/seba/member/${id}/status`, { status });
      if (response.data.status === "Success") {
        toast.success(`Marked as ${status}`);
        fetchMembers(currentPage, searchQuery);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const response = await api.delete(`/seba/member/${id}`);
      if (response.data.status === "Success") {
        toast.success("Deleted successfully");
        fetchMembers(currentPage, searchQuery);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };
  
  const handleDownloadPDF = async (member: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper to load image as base64
    const getImageData = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } else {
            reject("Could not get canvas context");
          }
        };
        img.onerror = () => reject("Could not load image");
        img.src = url;
      });
    };

    // 1. Decorative Sidebar
    doc.setFillColor(11, 75, 75); 
    doc.rect(0, 0, 15, pageHeight, 'F');
    
    // 2. Header with Logo
    try {
      // Since this is in admin, we use the Nfc.png from public folder
      const logoData = await getImageData("/Nfc.png");
      doc.addImage(logoData, 'PNG', 20, 15, 20, 20);
    } catch (e) {
      console.error("Logo failed to load for PDF", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(11, 75, 75);
    doc.text("SEBA", 45, 27);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("Surat East Builder Association", 45, 33);
    
    doc.setDrawColor(11, 75, 75);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // 3. Document Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text("MEMBER PROFILE SUMMARY", 25, 52);

    const fields = [
      { label: "FULL NAME", value: member.name },
      { label: "COMPANY NAME", value: member.company },
      { label: "DESIGNATION", value: member.position || "Member" },
      { label: "NATURE OF BUSINESS", value: member.natureOfBusiness || "" },
      { label: "BUSINESS CATEGORY", value: member.category },
      { label: "SUB CATEGORY", value: member.subCategory || "N/A" },
      { label: "PRIMARY MOBILE", value: formatPhoneNumber(member.mobile) },
      { label: "OFFICE NUMBER", value: member.officeNo ? formatPhoneNumber(member.officeNo) : "" },
      { label: "OPERATIONAL AREA", value: member.area },
      { label: "OFFICE ADDRESS", value: member.address },
      { label: "PINCODE", value: member.pincode },
      { label: "CITY", value: member.city },
      { label: "STATE", value: member.state },
      { label: "EMAIL / WEBSITE", value: member.emailWebsite },
    ];

    let y = 65;
    fields.forEach((field, index) => {
      const rawVal = field.value?.toString().trim()
      const val = rawVal && rawVal !== "" ? rawVal : ""
      const splitText = doc.splitTextToSize(val, index < 7 ? 110 : 160)
      
      const rowHeight = (splitText.length * 5) + 8

      if (index % 2 === 0) {
        doc.setFillColor(245, 248, 248)
        doc.rect(20, y - 5, 170, rowHeight, 'F')
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(8.5)
      doc.setTextColor(11, 75, 75)
      doc.text(field.label, 25, y)
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(40, 40, 40)
      doc.text(splitText, 25, y + 5)
      
      y += rowHeight + 2
    });

    // 4. Member Photo (Drawn LAST to be on top)
    if (member.image) {
      try {
        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${member.image}`;
        const logoData = await getImageData(imageUrl);
        
        // Shadow effect for photo
        doc.setFillColor(230, 230, 230);
        doc.rect(152, 47, 40, 50, 'F');
        
        doc.addImage(logoData, 'JPEG', 150, 45, 40, 50);
        doc.setDrawColor(11, 75, 75);
        doc.setLineWidth(0.8);
        doc.rect(150, 45, 40, 50);
      } catch (e) {
        console.error("PDF Photo add failed", e);
      }
    }

    // 6. Footer
    doc.setFillColor(11, 75, 75);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("CONFIDENTIAL ADMIN RECORD", pageWidth / 2, pageHeight - 12, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 7, { align: 'center' });

    doc.save(`${member.name}_SEBA_Profile.pdf`);
  };


  const columns = [
    {
      header: "Member Profile", accessor: "name",
      render: (row: any) => (
        <div className="flex items-center gap-4 py-1">
          <div className={`h-12 w-12 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm flex-shrink-0 ${row.image ? 'flex items-center justify-center p-1' : ''}`}>
            {row.image ? (
              <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${row.image}`} className="max-h-full max-w-full object-contain" alt={row.name} />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-lg rounded-lg">
                {row.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs font-semibold text-indigo-600 mt-0.5">{row.position || "Member"}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{row.memberId}</p>
          </div>
        </div>
      )
    },
    {
      header: "Contact Details", accessor: "mobile",
      render: (row: any) => (
        <div className="space-y-1 text-xs">
          <p className="flex items-center gap-1.5 text-gray-700 font-medium"><Phone size={13} className="text-gray-400" /> {formatPhoneNumber(row.mobile)}</p>
          {row.officeNo && <p className="flex items-center gap-1.5 text-gray-500"><Phone size={13} className="text-gray-400" /> {formatPhoneNumber(row.officeNo)}</p>}
          {row.emailWebsite && <p className="flex items-center gap-1.5 text-blue-600 hover:underline"><Globe size={13} className="text-gray-400" /> {row.emailWebsite}</p>}
        </div>
      )
    },
    {
      header: "Organization", accessor: "company",
      render: (row: any) => (
        <div className="space-y-1 text-xs">
          <p className="flex items-center gap-1.5 text-gray-800 font-bold"><Building2 size={13} className="text-gray-400" /> {row.company || "N/A"}</p>
          <p className="flex items-center gap-1.5 text-gray-600 font-medium">
            <Briefcase size={13} className="text-gray-400 shrink-0" /> 
            <span className="truncate">{[row.category, row.subCategory].filter(Boolean).join(' • ')}</span>
          </p>
          {row.natureOfBusiness && (
            <p className="text-[10px] font-bold text-emerald-600 pl-4.5">Nature: {row.natureOfBusiness}</p>
          )}
          <p className="flex items-center gap-1.5 text-gray-500"><MapPin size={13} className="text-gray-400" /> {row.area}</p>
        </div>
      )
    },
    {
      header: "Application Form", accessor: "pdf",
      render: (row: any) => (
        <div>
          <button 
            onClick={() => handleDownloadPDF(row)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-indigo-100 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
          >
            <Download size={13} /> Download PDF
          </button>
        </div>
      )
    },
    {
      header: "Status", accessor: "status",
      render: (row: any) => {
        const statusColors: any = {
          active: "bg-emerald-50 text-emerald-700 border-emerald-200",
          pending: "bg-amber-50 text-amber-700 border-amber-200",
          inactive: "bg-gray-50 text-gray-600 border-gray-200",
          rejected: "bg-red-50 text-red-700 border-red-200"
        };
        const color = statusColors[row.status] || "bg-gray-50 text-gray-600 border-gray-200";
        return (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${color}`}>
            {row.status.toUpperCase()}
          </span>
        );
      }
    },
    {
      header: "Actions", accessor: "_id",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button 
            onClick={() => handleEdit(row)} 
            title="Edit Details" 
            className="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 rounded-xl transition-all shadow-sm"
          >
            <FileText size={16} className="stroke-[2.5]" />
          </button>

          {row.status !== "active" && (
            <button 
              onClick={() => handleUpdateStatus(row._id, 'active')} 
              title="Activate" 
              className="p-2 text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-xl transition-all shadow-sm"
            >
              <Check size={16} className="stroke-[2.5]" />
            </button>
          )}
          
          {(row.status === "active" || row.status === "pending") && (
            <button 
              onClick={() => handleUpdateStatus(row._id, 'inactive')} 
              title="Deactivate / Reject" 
              className="p-2 text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded-xl transition-all shadow-sm"
            >
              <X size={16} className="stroke-[2.5]" />
            </button>
          )}

          <button 
            onClick={() => handleDelete(row._id)} 
            title="Delete Permanently"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all shadow-sm"
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
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Members</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.total}</h3>
            </div>
            <div className="h-12 w-12 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Users size={22} />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.active}</h3>
            </div>
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Check size={22} className="stroke-[3]" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
              <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{stats.pending}</h3>
            </div>
            <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Plus size={22} className="stroke-[3]" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inactive</p>
              <h3 className="text-3xl font-extrabold text-gray-500 mt-1">{stats.inactive}</h3>
            </div>
            <div className="h-12 w-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
              <X size={22} className="stroke-[3]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center shadow">
              <Users size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">SEBA Members Directory</h3>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus size={16} className="stroke-[2.5]" /> Add Member
          </button>
        </div>

        {/* Slide-over Drawer with Blur Overlay */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end transition-all">
            <div className="w-[500px] bg-white h-screen max-h-screen shadow-2xl p-6 flex flex-col border-l border-gray-100 animate-slide-in overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center shadow">
                    <Users size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                    {isEditing ? "Edit SEBA Member" : "Add SEBA Member"}
                  </h3>
                </div>
                <button 
                  onClick={closeDrawer} 
                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="First & Last Name" />
                    </div>
                    <div>
                      <label className={labelCls}>Position</label>
                      <input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className={inputCls} placeholder="e.g. Director / Media Head" />
                    </div>
                  </div>
                  
                  <div>
                    <label className={labelCls}>Nature of Business</label>
                    <input value={formData.natureOfBusiness} onChange={(e) => setFormData({ ...formData, natureOfBusiness: e.target.value })} className={inputCls} placeholder="e.g. Tiles / Real Estate Developer" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Category *</label>
                      <SearchableSelect 
                        options={categories}
                        value={categorySelection}
                        onChange={(val) => {
                          setCategorySelection(val);
                          setShowOtherCategory(val === 'Others');
                          setSubCategorySelection("");
                          const matchedCat = categories.find(c => c.name === val);
                          const subs = matchedCat?.subCategories || [];
                          const sortedSubs = [...subs].sort((a: string, b: string) => a.localeCompare(b));
                          setSubCategories(sortedSubs.map((s: string) => ({ name: s })));
                          if (val !== 'Others') {
                            setFormData(prev => ({ ...prev, category: val, subCategory: "" }));
                          }
                        }}
                        placeholder="Select Category"
                      />
                      {showOtherCategory && (
                        <input 
                          required 
                          className={`${inputCls} mt-2`} 
                          placeholder="Write category name" 
                          value={otherCategoryName}
                          onChange={(e) => {
                            setOtherCategoryName(e.target.value);
                            setFormData(prev => ({ ...prev, category: e.target.value }));
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Sub Category</label>
                      <SearchableSelect 
                        options={subCategories}
                        value={subCategorySelection}
                        onChange={(val) => {
                          setSubCategorySelection(val);
                          setFormData(prev => ({ ...prev, subCategory: val === 'Others' ? '' : val }));
                        }}
                        placeholder="Select Sub Category"
                        showOthers={true}
                      />
                      {subCategorySelection === 'Others' && (
                        <input 
                          required 
                          className={`${inputCls} mt-2`} 
                          placeholder="Write sub category name" 
                          value={formData.subCategory}
                          onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Company Name</label>
                    <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputCls} placeholder="M K Group" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Mobile No. *</label>
                      <input required value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: formatPhoneNumber(e.target.value) })} className={inputCls} placeholder="Primary Contact" />
                    </div>
                    <div>
                      <label className={labelCls}>Office No.</label>
                      <input value={formData.officeNo} onChange={(e) => setFormData({ ...formData, officeNo: formatPhoneNumber(e.target.value) })} className={inputCls} placeholder="Secondary Contact" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email / Website</label>
                    <input value={formData.emailWebsite} onChange={(e) => setFormData({ ...formData, emailWebsite: e.target.value })} className={inputCls} placeholder="www.domain.com" />
                  </div>

                  <div>
                    <label className={labelCls}>Pincode (Auto-fills below)</label>
                    <input 
                      maxLength={6}
                      value={formData.pincode} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, pincode: val });
                        if (val.length === 6) {
                          fetch(`https://api.postalpincode.in/pincode/${val}`)
                            .then(res => res.json())
                            .then(data => {
                              if (data[0].Status === "Success") {
                                const post = data[0].PostOffice[0];
                                setFormData(prev => ({
                                  ...prev,
                                  pincode: val,
                                  city: post.District,
                                  state: post.State,
                                  area: post.Name
                                }));
                              }
                            });
                        }
                      }} 
                      className={inputCls} 
                      placeholder="395xxx" 
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Area / Locality *</label>
                    <input 
                      required 
                      value={formData.area} 
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })} 
                      className={inputCls} 
                      placeholder="e.g. Adajan / Surat" 
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Office Address *</label>
                    <textarea 
                      value={formData.address} 
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                      className={`${inputCls} h-[80px] py-2 resize-none`} 
                      placeholder="Full physical address" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>City</label>
                      <input 
                        value={formData.city} 
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                        className={inputCls}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>State</label>
                      <input 
                        value={formData.state} 
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                        className={inputCls}
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={labelCls}>Passport Photo</label>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 px-3 py-2.5 rounded-lg bg-white shadow-sm" />
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
                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isEditing ? "Update Details" : <><Plus size={16} className="stroke-[2.5]" /> Create Member</>}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">SEBA Members Directory</h3>
            </div>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)} 
              className="border border-gray-300 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer transition-all"
            >
              <option value="">Status: ALL RECORDS</option>
              <option value="active">Status: ACTIVE</option>
              <option value="pending">Status: PENDING</option>
              <option value="inactive">Status: INACTIVE</option>
            </select>
          </div>
          <div className="p-6">
            <CommonTable
              columns={columns}
              data={members}
              isLoading={loading}
              totalRecords={totalRecords}
              currentPage={currentPage}
              limit={10}
              onPageChange={(page) => fetchMembers(page, searchQuery)}
              onSearch={(q) => setSearchQuery(q)}
              searchPlaceholder="Search members by name, company, position, area..."
            />
          </div>
        </div>

        {showCropper && originalImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full flex flex-col items-center shadow-2xl">
              <h3 className="text-gray-900 text-sm font-extrabold uppercase tracking-wider mb-4">Adjust Passport Photo</h3>
              
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
