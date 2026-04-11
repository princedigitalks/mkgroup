"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Mail, 
  ChevronRight,
  LogOut,
  Info,
  Video,
  CreditCard,
  User,
  ShieldCheck,
  Database,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  type: "user" | "admin";
}

export default function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    const authKey = type === 'admin' ? 'mkgroup_admin_auth' : 'mkgroup_user_auth';
    localStorage.removeItem(authKey);
    document.cookie = `${authKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
    router.push(type === 'admin' ? '/admin/login' : '/user/login');
  };

  const adminLinks = [
    { label: "Card Maker", href: "/admin", icon: CreditCard },
    { label: "Dropbox", href: "/admin/dropbox", icon: Database },
    { label: "Logout", action: handleLogout, icon: LogOut, color: "text-red-500 hover:bg-red-50" },
  ];

  const userLinks = [
    { label: "Dashboard", href: "/user", icon: LayoutDashboard },
    { label: "Profile Card", href: "/user/profile", icon: User },
    { label: "QR Card", href: "/user/qr", icon: QrCode },
    { label: "Photo Gallery", href: "/user/photos", icon: ImageIcon },
    { label: "Video Gallery", href: "/user/videos", icon: Video },
    { label: "Brochure", href: "/user/brochure", icon: FileText },
    { label: "About Us", href: "/user/about", icon: Info },
    { label: "Inquiry", href: "/user/inquiry", icon: Mail },
    { label: "Logout", action: handleLogout, icon: LogOut, color: "text-red-500 hover:bg-red-50" },
  ];

  const links = type === "admin" ? adminLinks : userLinks;

  return (
    <div className={cn(
      "flex h-screen flex-col border-r w-72 fixed left-0 top-0 z-40 backdrop-blur-xl",
      type === "admin" ? "bg-white/95 border-gray-200" : "bg-gradient-to-b from-blue-50/70 via-white to-white border-blue-100"
    )}>
      <div className="flex h-20 items-center px-7 border-b border-inherit">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg",
          type === 'admin' ? "bg-black shadow-black/20" : "bg-blue-600 shadow-blue-200"
        )}>
          {type === 'admin' ? <ShieldCheck size={18} /> : <User size={18} />}
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
          {type === 'admin' ? 'Admin' : 'User'} <span className={type === 'admin' ? "text-gray-400" : "text-blue-600"}>Panel</span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href && link.label !== "Logout";
            
            const content = (
              <>
                <link.icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? (type === 'admin' ? "text-black" : "text-blue-600") : "text-gray-400"
                )} />
                {link.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 animate-pulse" />}
              </>
            );

            if (link.action) {
              return (
                <button
                  key={link.label}
                  onClick={link.action}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all group border border-transparent",
                    link.color || "text-gray-500 hover:bg-white hover:border-gray-100 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href!}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all group border",
                  isActive 
                    ? (type === 'admin'
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200"
                        : "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100")
                    : "text-gray-500 border-transparent hover:bg-white hover:border-gray-100 hover:text-gray-900 hover:shadow-sm"
                )}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-inherit">
        <div className={cn(
          "rounded-3xl p-4 flex items-center gap-3",
          type === 'admin' ? "bg-gray-50 border border-gray-100" : "bg-blue-50/70 border border-blue-100"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs",
            type === 'admin' ? "bg-black text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-100"
          )}>
            {type === 'admin' ? 'A' : 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-gray-900 truncate">
              {type === 'admin' ? 'Admin Access' : 'User Account'}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
