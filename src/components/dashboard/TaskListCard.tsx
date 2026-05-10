import { CheckSquare, AlertCircle, Clock, FileText, LayoutDashboard, Users } from "lucide-react";

interface Task {
  id: number;
  title: string;
  status: "completed" | "in-progress" | "pending";
  icon: string;
}

const tasks: Task[] = [
  { id: 1, title: "Design system update", status: "completed", icon: "layout" },
  { id: 2, title: "Client presentation prep", status: "in-progress", icon: "file" },
  { id: 3, title: "Team sprint planning", status: "pending", icon: "users" },
  { id: 4, title: "Code review session", status: "pending", icon: "clock" },
  { id: 5, title: "Deploy to production", status: "in-progress", icon: "alert" },
];

const iconMap: Record<string, React.ReactNode> = {
  layout: <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />,
  file: <FileText className="h-4 w-4" strokeWidth={1.5} />,
  users: <Users className="h-4 w-4" strokeWidth={1.5} />,
  clock: <Clock className="h-4 w-4" strokeWidth={1.5} />,
  alert: <AlertCircle className="h-4 w-4" strokeWidth={1.5} />,
};

const statusColors: Record<string, { bg: string; dot: string; label: string }> = {
  completed: { bg: "bg-green-50", dot: "bg-green-500", label: "Done" },
  "in-progress": { bg: "bg-amber-50", dot: "bg-amber-500", label: "In Progress" },
  pending: { bg: "bg-gray-50", dot: "bg-gray-400", label: "Pending" },
};

const iconColors: Record<string, string> = {
  layout: "text-purple-500 bg-purple-50",
  file: "text-blue-500 bg-blue-50",
  users: "text-orange-500 bg-orange-50",
  clock: "text-teal-500 bg-teal-50",
  alert: "text-red-500 bg-red-50",
};

export default function TaskListCard() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#f3f4f6] shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-[#0f8b5f]/10 flex items-center justify-center">
            <CheckSquare className="h-[18px] w-[18px] text-[#0f8b5f]" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-[#111827]">Project Tasks</h3>
        </div>
        <span className="text-xs font-medium text-[#0f8b5f] bg-[#0f8b5f]/10 px-3 py-1 rounded-full">
          {tasks.filter((t) => t.status === "completed").length}/{tasks.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => {
          const status = statusColors[task.status];
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f4f5f7] transition-colors group cursor-pointer"
            >
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[task.icon]}`}
              >
                {iconMap[task.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{task.title}</p>
              </div>
              <span
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${status.bg} text-[${status.dot}]`}
                style={{ color: task.status === "completed" ? "#0f8b5f" : task.status === "in-progress" ? "#d97706" : "#9ca3af" }}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>

      <button className="mt-5 w-full py-2.5 rounded-xl border border-dashed border-[#d1d5db] text-[#9ca3af] text-sm hover:border-[#0f8b5f] hover:text-[#0f8b5f] transition-colors">
        + Add new task
      </button>
    </div>
  );
}
