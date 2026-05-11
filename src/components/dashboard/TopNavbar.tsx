import { Search, Bell, Mail, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { user } = useAuth();
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  
  // Get initials from first and last name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const userInitials = getInitials(userName);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-white rounded-b-3xl shadow-sm fixed top-0 left-0 right-0 z-30 lg:left-[240px] transition-all duration-300">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* Left - Search */}
        <div className="flex items-center gap-5 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-[#f4f5f7] transition-colors"
          >
            <svg className="h-5 w-5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center bg-[#f4f5f7] rounded-2xl px-4 py-3 w-full max-w-lg">
            <Search className="h-5 w-5 text-[#9ca3af] flex-shrink-0" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm ml-3 w-full text-[#111827] placeholder:text-[#9ca3af]"
            />
          </div>
        </div>

        {/* Right - Actions + Profile */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="relative p-3 rounded-2xl hover:bg-[#f4f5f7] transition-colors">
            <Bell className="h-5 w-5 text-[#6b7280]" strokeWidth={1.5} />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Messages */}
          <button className="relative p-3 rounded-2xl hover:bg-[#f4f5f7] transition-colors hidden sm:block">
            <Mail className="h-5 w-5 text-[#6b7280]" strokeWidth={1.5} />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-[#0f8b5f] rounded-full border-2 border-white"></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 ml-2 border-l border-[#e5e7eb]"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-[#111827]">{userName}</p>
                <p className="text-xs text-[#9ca3af]">{userEmail}</p>
              </div>
              <div className="relative">
                <div className="h-11 w-11 rounded-2xl bg-[#e5e7eb] flex items-center justify-center text-[#6b7280] text-sm font-bold">
                  {userInitials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-[#22c55e] rounded-full border-2 border-white"></span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#9ca3af] hidden md:block" strokeWidth={1.5} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-lg py-2 z-50">
                <button
                  onClick={() => { navigate("/dashboard"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  Dashboard
                </button>
                <button
                  onClick={() => { navigate("/consultation"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  Consultation
                </button>
                <button
                  onClick={() => { navigate("/check"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  Eligibility Check
                </button>
                <button
                  onClick={() => { navigate("/ielts-prep"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  IELTS Preparation
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => { setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  Settings
                </button>
                <button
                  onClick={() => { navigate("/"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
