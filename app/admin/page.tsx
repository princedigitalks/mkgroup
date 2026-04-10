"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Plus, 
  CreditCard,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Clock4,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUserAdmin, toggleUserStatus, clearError } from "@/lib/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import CommonTable from "@/components/CommonTable";
import { toast } from "sonner";

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, totalRecords, currentPage, loading, error } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    refer: "",
    role: "user"
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const overview = useMemo(() => [
    { label: "Active Cards", value: totalRecords.toString(), icon: CreditCard, tone: "from-blue-600 to-indigo-700" },
    { label: "System Users", value: totalRecords.toString(), icon: Users, tone: "from-violet-600 to-fuchsia-700" },
    { label: "Total Visits", value: "1,294", icon: BarChart3, tone: "from-cyan-600 to-blue-700" },
  ], [totalRecords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchUsers({ page: 1, search: searchQuery }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ page, search: searchQuery }));
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setIsUpdatingStatus(userId);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const result = await dispatch(toggleUserStatus({ userId, status: newStatus }));
    if (toggleUserStatus.fulfilled.match(result)) {
      toast.success(`User status updated to ${newStatus}`);
    }
    setIsUpdatingStatus(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(createUserAdmin(formData));
    if (createUserAdmin.fulfilled.match(resultAction)) {
      setFormData({
        name: "", email: "", number: "", password: "",
        refer: "", role: "user"
      });
      toast.success("User and Card created successfully!");
    }
  };

  const columns = [
    { 
      header: "Name", 
      accessor: "name",
      render: (row: any) => (
        <div>
          <p className="font-black text-gray-900">{row.name}</p>
        </div>
      )
    },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "number" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <button 
            disabled={isUpdatingStatus === row._id}
            onClick={() => handleToggleStatus(row._id, row.status)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
              row.status === 'active' ? 'bg-emerald-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                row.status === 'active' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            row.status === 'active' ? 'text-emerald-600' : 'text-gray-400'
          }`}>
            {row.status}
          </span>
        </div>
      )
    },
    { 
      header: "Created", 
      accessor: "createdAt",
      render: (row: any) => {
        const date = new Date(row.createdAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }
  ];

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overview.map((item) => (
            <div key={item.label} className="bg-white border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
              <item.icon size={28} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* Create Card */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">Create New Card</h3>
              <p className="text-xs text-gray-400 mt-0.5">Enter card details below</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Clock4 size={13} /> Last Saved: Just now
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="Enter name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="Enter email" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Mobile Number</label>
                <input className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="Enter number" />
              </div>
            </div>

            <div className="lg:col-span-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Reference Code</label>
              <input className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="Enter refer" />
            </div>

            <div className="lg:col-span-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Category Type</label>
              <select className="w-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all cursor-pointer">
                <option>Clinic</option>
                <option>Hospital</option>
                <option>Individual</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <button className="w-full bg-black text-white px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 active:bg-gray-800 transition-colors">
                <Plus size={16} /> Add Card
              </button>
            </div>
          </div>
        </div>

        {/* Recent Cards */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">Recent Cards</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest edits and publishing status</p>
            </div>
            <button className="text-xs font-semibold text-black hover:underline uppercase tracking-wider">View all</button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentCards.map((card) => (
              <div key={card.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{card.name}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{card.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{card.updated}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${card.status === "Published" ? "text-emerald-600" : "text-amber-600"}`}>
                    {card.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateUser} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Create New Card</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Enter basic user credentials below</p>
                </div>
              </div>
              <div className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <Clock4 size={14} /> System Ready
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 gap-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  placeholder="John Doe" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  placeholder="john@example.com" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <input 
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  placeholder="9876543210" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pr-12" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Refer Code</label>
                <div className="flex gap-3">
                  <input 
                    value={formData.refer}
                    onChange={(e) => setFormData({...formData, refer: e.target.value})}
                    className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                    placeholder="Optional" 
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:scale-[1.05] active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[60px]"
                  >
                    {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={24} />}
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest ml-1">{error}</p>}
          </form>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Recent Cards</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Latest edits and publishing status</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Data</p>
              </div>
            </div>

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
