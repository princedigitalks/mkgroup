"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Trash2, Search, Download, Filter } from "lucide-react";

export default function DropboxPage() {
  const dropboxData = [
    { no: 1, card: "Vesu", name: "Change the photo", number: "9374714610", email: "drsudipjoshi@yahoo.co.in", message: "Change the timing 8:00 am to 8:00 pm", date: "2025-10-01 08:46:46" },
    { no: 2, card: "MMA", name: "Jigar patel", number: "9924902422", email: "drjigardpatel@gmail.com", message: "Pls make one more stand and card", date: "2024-02-12 14:25:30" },
  ];

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Data Records</span>
              <span className="text-xs text-gray-400 font-medium">({dropboxData.length} entries)</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 bg-gray-50 text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <button className="p-2 border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">No</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">Card Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">Patient/User</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">Number</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">Message</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-r border-gray-700">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dropboxData.map((row) => (
                  <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 border-r border-gray-100 text-gray-400 font-medium text-xs">{row.no}</td>
                    <td className="px-4 py-4 border-r border-gray-100">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">{row.card}</span>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-100 font-semibold text-gray-900">{row.name}</td>
                    <td className="px-4 py-4 border-r border-gray-100 text-gray-500 text-xs">{row.number}</td>
                    <td className="px-4 py-4 border-r border-gray-100 text-gray-400 text-xs">{row.email}</td>
                    <td className="px-4 py-4 border-r border-gray-100 text-gray-600 text-xs leading-relaxed max-w-xs">{row.message}</td>
                    <td className="px-4 py-4 border-r border-gray-100 text-gray-400 text-xs whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-4 text-center">
                      <button className="p-1.5 text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
