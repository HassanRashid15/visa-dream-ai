import { Target } from "lucide-react";

interface ProgressCardProps {
  percentage?: number;
  label?: string;
}

export default function ProgressCard({ percentage = 75, label = "Project Completion" }: ProgressCardProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#f3f4f6] shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-9 w-9 rounded-xl bg-[#0f8b5f]/10 flex items-center justify-center">
          <Target className="h-[18px] w-[18px] text-[#0f8b5f]" strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-[#111827]">Project Progress</h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#f4f5f7"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#0f8b5f"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#111827]">{percentage}%</span>
            <span className="text-xs text-[#9ca3af] mt-0.5">Complete</span>
          </div>
        </div>

        <p className="text-sm text-[#6b7280] mt-4 text-center">{label}</p>

        <div className="flex items-center gap-4 mt-4 w-full">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#111827]">12</p>
            <p className="text-[10px] text-[#9ca3af]">Total</p>
          </div>
          <div className="w-px h-8 bg-[#e5e7eb]"></div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#0f8b5f]">9</p>
            <p className="text-[10px] text-[#9ca3af]">Done</p>
          </div>
          <div className="w-px h-8 bg-[#e5e7eb]"></div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-amber-500">3</p>
            <p className="text-[10px] text-[#9ca3af]">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
