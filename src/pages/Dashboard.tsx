import { useState } from "react";
import { Plus, Download } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import TrackerContent from "@/components/dashboard/TrackerContent";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex font-sans">
      {/* Sidebar */}
      <Sidebar
        activeItem="dashboard"
        onNavigate={() => {}}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-[240px]">
        {/* Top Navbar */}
        <TopNavbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userName="John Doe"
          userEmail="john@example.com"
        />

        {/* Dashboard Content */}
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Application Tracker</h1>
                <p className="text-sm text-[#9ca3af] mt-1">
                  Monitor your UK visa application progress and manage documents.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0f8b5f] text-white text-sm font-semibold hover:bg-[#0d7a52] transition-colors shadow-md shadow-[#0f8b5f]/20">
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  Add Document
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#e5e7eb] bg-white text-[#6b7280] text-sm font-medium hover:border-[#0f8b5f] hover:text-[#0f8b5f] transition-colors">
                  <Download className="h-4 w-4" strokeWidth={1.5} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Tracker Content */}
            <TrackerContent />

          </div>
        </main>
      </div>
    </div>
  );
}
