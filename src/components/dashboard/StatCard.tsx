import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  highlighted?: boolean;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, change, changeType = "up", highlighted = false, icon }: StatCardProps) {
  if (highlighted) {
    return (
      <div className="bg-gradient-to-br from-[#0f8b5f] to-[#27ae60] rounded-[20px] p-6 text-white shadow-lg shadow-[#0f8b5f]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              {icon || <TrendingUp className="h-5 w-5" strokeWidth={2} />}
            </div>
            <p className="text-sm font-medium text-white/80">{title}</p>
          </div>
          <h3 className="text-3xl font-bold">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-200" strokeWidth={2} />
              <span className="text-sm text-green-200">{change}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#f3f4f6] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-[#f4f5f7] flex items-center justify-center">
          {icon || <TrendingUp className="h-5 w-5 text-[#6b7280]" strokeWidth={1.5} />}
        </div>
        <p className="text-sm font-medium text-[#6b7280]">{title}</p>
      </div>
      <h3 className="text-3xl font-bold text-[#111827]">{value}</h3>
      {change && (
        <div className="flex items-center gap-1 mt-2">
          {changeType === "up" ? (
            <ArrowUpRight className="h-4 w-4 text-[#0f8b5f]" strokeWidth={2} />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" strokeWidth={2} />
          )}
          <span className={`text-sm ${changeType === "up" ? "text-[#0f8b5f]" : "text-red-500"}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
