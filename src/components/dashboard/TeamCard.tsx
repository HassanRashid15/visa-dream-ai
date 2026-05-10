import { Users, MoreHorizontal } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: "online" | "offline" | "busy";
  initials: string;
  color: string;
}

const members: TeamMember[] = [
  { id: 1, name: "Alex Johnson", role: "Product Designer", status: "online", initials: "AJ", color: "bg-blue-500" },
  { id: 2, name: "Sarah Miller", role: "Frontend Dev", status: "online", initials: "SM", color: "bg-purple-500" },
  { id: 3, name: "Mike Chen", role: "Backend Dev", status: "busy", initials: "MC", color: "bg-orange-500" },
  { id: 4, name: "Emily Davis", role: "Project Manager", status: "offline", initials: "ED", color: "bg-pink-500" },
];

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  busy: "bg-amber-500",
  offline: "bg-gray-300",
};

const statusLabels: Record<string, string> = {
  online: "Active",
  busy: "In Meeting",
  offline: "Offline",
};

export default function TeamCard() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#f3f4f6] shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Users className="h-[18px] w-[18px] text-indigo-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-[#111827]">Team Members</h3>
        </div>
        <button className="p-2 rounded-xl hover:bg-[#f4f5f7] transition-colors">
          <MoreHorizontal className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.5} />
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f4f5f7] transition-colors cursor-pointer"
          >
            <div className="relative">
              <div
                className={`h-10 w-10 rounded-xl ${member.color} flex items-center justify-center text-white text-sm font-bold`}
              >
                {member.initials}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
              ></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111827]">{member.name}</p>
              <p className="text-xs text-[#9ca3af]">{member.role}</p>
            </div>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#f4f5f7] text-[#6b7280]">
              {statusLabels[member.status]}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-medium text-[#6b7280] hover:border-[#0f8b5f] hover:text-[#0f8b5f] transition-colors">
        View All Members
      </button>
    </div>
  );
}
