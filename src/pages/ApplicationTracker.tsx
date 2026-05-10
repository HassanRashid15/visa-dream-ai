import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Clock, Search, Bell,
  Menu, X, LogOut, Settings, ChevronDown, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

// --- Types ---
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
}

// --- Components ---

function Sidebar({ activeItem, onNavigate, mobileOpen, onClose }: {
  activeItem: string;
  onNavigate: (id: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const mainItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "consultation", label: "Consultation", icon: Users },
  ];

  const otherItems: SidebarItem[] = [
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-[#f8f9fb] border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
          <div className="h-9 w-9 rounded-lg bg-[#4e73df] flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 tracking-tight">VisaDreams</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Main Menu</p>
            <div className="space-y-1">
              {mainItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-[#4e73df] shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Other</p>
            <div className="space-y-1">
              {otherItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-[#4e73df] shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopNavbar({ onMenuClick, userName }: { onMenuClick: () => void; userName: string }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 lg:left-[250px]">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Good Morning, {userName}</h2>
            <p className="text-sm text-gray-400">Your performance summary this week</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4e73df] to-[#224abe] flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, change, changeType }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <span className={`flex items-center gap-1 text-xs font-medium ${changeType === "up" ? "text-green-500" : "text-red-500"}`}>
          {changeType === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </span>
      </div>
    </div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Performance Line Chart</h3>
          <p className="text-sm text-gray-400 mt-1">Lorem ipsum is simply dummy text of the printing</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#4e73df]"></span>
            This week
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#36b9cc]"></span>
            Last week
          </span>
        </div>
      </div>
      {/* Chart Placeholder */}
      <div className="h-64 flex items-end justify-between gap-2 px-4">
        {[40, 55, 45, 70, 60, 80, 65, 75, 55, 70, 85, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gradient-to-t from-[#4e73df]/20 to-[#4e73df]/50 rounded-t" style={{ height: `${h}%` }}></div>
            <span className="text-[10px] text-gray-400">{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i % 7]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryWidget() {
  return (
    <div className="bg-gradient-to-br from-[#4e73df] to-[#224abe] rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Status Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-blue-100 text-sm">Closed</p>
          <p className="text-blue-100 text-xs">Value</p>
          <p className="text-3xl font-bold mt-1">357</p>
        </div>
        {/* Mini chart placeholder */}
        <div className="h-16 flex items-end gap-1">
          {[30, 50, 40, 60, 45, 70, 55, 80, 65, 90].map((h, i) => (
            <div key={i} className="flex-1 bg-white/20 rounded-t" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CircularProgress({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-14">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
          <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className="text-[#4e73df]" strokeDasharray={`${value}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">{value}%</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-800">{sublabel}</p>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function ApplicationTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const userName = user?.name?.split(" ")[0] || "John";

  const handleNavigate = (id: string) => {
    setActiveItem(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        onNavigate={handleNavigate}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-[250px]">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userName={userName} />

        {/* Dashboard Content */}
        <main className="pt-16 px-4 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard title="Bounce Rate" value="32.53%" change="-0.5%" changeType="down" />
              <StatCard title="Page Views" value="7,682" change="+0.1%" changeType="up" />
              <StatCard title="New Sessions" value="68.8" change="-68.8" changeType="down" />
              <StatCard title="Avg. Time on Site" value="2m:35s" change="+0.8%" changeType="up" />
              <StatCard title="New Sessions" value="68.8" change="-68.8" changeType="down" />
              <StatCard title="Avg. Time on Site" value="2m:35s" change="+0.8%" changeType="up" />
            </div>

            {/* Chart + Summary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartPlaceholder />
              </div>
              <div className="space-y-6">
                <SummaryWidget />
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <CircularProgress value={26.8} label="Total Visitors" sublabel="26.80%" />
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Visits per day</p>
                        <p className="text-2xl font-bold text-gray-800">9065</p>
                      </div>
                      <div className="h-12 w-12 rounded-full border-4 border-[#36b9cc] flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">visits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Market Overview</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    This month <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Market Overview Content Placeholder</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Todo List</h3>
                <div className="space-y-3">
                  {["Review Documents", "Schedule Consultation", "Upload IELTS", "Check Financials"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="h-5 w-5 rounded border-2 border-gray-300"></div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2.5 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-[#4e73df] hover:text-[#4e73df] transition-colors text-sm">
                  + Add new task
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
