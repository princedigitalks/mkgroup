"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Plus, CreditCard, BarChart3, Users, Clock4, Eye, EyeOff, UserPlus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUserAdmin, toggleUserStatus, clearError } from "@/lib/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import CommonTable from "@/components/CommonTable";
import { toast } from "sonner";

const inputCls = "w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition-all rounded-md";
const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1";

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, totalRecords, currentPage, loading, error } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", number: "", password: "", refer: "", role: "user" });

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => { dispatch(fetchUsers({ page: 1, search: searchQuery })); }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const overview = useMemo(() => [
    { label: "Total Cards", value: totalRecords.toString(), icon: CreditCard },
    { label: "System Users", value: totalRecords.toString(), icon: Users },
    { label: "Total Visits", value: "1,294", icon: BarChart3 },
  ], [totalRecords]);

  const handlePageChange = (page: number) => dispatch(fetchUsers({ page, search: searchQuery }));

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setIsUpdatingStatus(userId);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const result = await dispatch(toggleUserStatus({ userId, status: newStatus }));
    if (toggleUserStatus.fulfilled.match(result)) toast.success(`User status updated to ${newStatus}`);
    setIsUpdatingStatus(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(createUserAdmin(formData));
    if (createUserAdmin.fulfilled.match(result)) {
      setFormData({ name: "", email: "", number: "", password: "", refer: "", role: "user" });
      toast.success("User and Card created successfully!");
    }
  };

  const columns = [
    {
      header: "Name", accessor: "name",
      render: (row: any) => <p className="font-semibold text-gray-900">{row.name}</p>
    },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "number" },
    {
      header: "Status", accessor: "status",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button
            disabled={isUpdatingStatus === row._id}
            onClick={() => handleToggleStatus(row._id, row.status)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${row.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${row.status === "active" ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
          <span className={`text-xs font-semibold ${row.status === "active" ? "text-emerald-600" : "text-gray-400"}`}>{row.status}</span>
        </div>
      )
    },
    {
      header: "Created", accessor: "createdAt",
      render: (row: any) => {
        const d = new Date(row.createdAt);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      }
    },
  ];

  return (
    <DashboardLayout type="admin">
      <div className="space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overview.map((item) => (
            <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <item.icon size={22} className="text-gray-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Create Card Form */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <UserPlus size={15} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Create New Card</h3>
                <p className="text-xs text-gray-400 mt-0.5">Enter user credentials below</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
              <Clock4 size={12} /> System Ready
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelCls}>Mobile Number</label>
                <input required value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} className={inputCls} placeholder="9876543210" />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputCls + " pr-10"} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Refer Code</label>
                <input value={formData.refer} onChange={(e) => setFormData({ ...formData, refer: e.target.value })} className={inputCls} placeholder="Optional" />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors disabled:opacity-60">
                  {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={15} /> Create Card</>}
                </button>
              </div>
            </div>
            {error && <p className="mt-3 text-xs font-semibold text-red-500">{error}</p>}
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">All Cards</h3>
              <p className="text-xs text-gray-400 mt-0.5">Manage users and their card status</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-emerald-500 rounded-full" />
              <span className="text-xs text-gray-400 font-medium">Live</span>
            </div>
          </div>
          <div className="p-6">
            <CommonTable
              columns={columns}
              data={users}
              isLoading={loading}
              totalRecords={totalRecords}
              currentPage={currentPage}
              limit={10}
              onPageChange={handlePageChange}
              onSearch={(q) => setSearchQuery(q)}
              searchPlaceholder="Search by name, email, or number..."
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
