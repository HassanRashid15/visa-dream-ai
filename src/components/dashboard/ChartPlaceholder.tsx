export default function ChartPlaceholder() {
  const bars = [45, 70, 55, 85, 60, 75, 90, 65, 80, 55, 70, 95];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#f3f4f6] shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">Project Analytics</h3>
          <p className="text-sm text-[#9ca3af] mt-1">Track your project progress over time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f8b5f]"></span>
            Completed
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]"></span>
            Pending
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 flex items-end justify-between gap-3">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col gap-1.5 justify-end" style={{ height: "200px" }}>
              <div
                className="w-full bg-[#0f8b5f] rounded-full transition-all duration-500"
                style={{ height: `${height * 1.8}px`, opacity: 0.2 + (height / 100) * 0.8 }}
              ></div>
            </div>
            <span className="text-[10px] text-[#9ca3af] font-medium">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
