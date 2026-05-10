import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Download,
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onNavigate: (id: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const menuItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "consultation", label: "Consultation", icon: Users },
  { id: "check", label: "Eligibility", icon: CheckSquare },
  { id: "ielts-prep", label: "IELTS Prep", icon: CalendarDays },
];

const generalItems: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

export default function Sidebar({ activeItem, onNavigate, mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#f5f5f5] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-5 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="h-10 w-10 rounded-xl bg-[#0f8b5f] flex items-center justify-center shadow-sm shadow-[#0f8b5f]/20">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#111827] tracking-tight">ProManage</h1>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-3 px-3">
              Menu
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/${item.id}`)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#0f8b5f] text-white shadow-md shadow-[#0f8b5f]/20"
                        : "text-[#6b7280] hover:bg-white hover:text-[#111827] hover:shadow-sm"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.5} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* General Section */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-3 px-3">
              General
            </p>
            <nav className="space-y-1">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/${item.id}`)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#0f8b5f] text-white shadow-md shadow-[#0f8b5f]/20"
                        : "text-[#6b7280] hover:bg-white hover:text-[#111827] hover:shadow-sm"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.5} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Download App Promo */}
          <div className="bg-gradient-to-br from-[#0f8b5f] to-[#27ae60] rounded-2xl p-4 mb-4 text-white shadow-lg shadow-[#0f8b5f]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Download App</p>
              </div>
            </div>
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              Get the full experience on your mobile device.
            </p>
            <button className="w-full py-2 rounded-lg bg-white text-[#0f8b5f] text-xs font-semibold hover:bg-white/90 transition-colors">
              Get Started
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
