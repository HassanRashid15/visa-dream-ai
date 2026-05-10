import { Play, Pause, Square, Timer } from "lucide-react";

export default function TimeTrackerCard() {
  return (
    <div className="bg-gradient-to-br from-[#0f8b5f] to-[#0a6b49] rounded-[20px] p-6 text-white shadow-lg shadow-[#0f8b5f]/25 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 h-24 w-24 bg-white/5 rounded-full -ml-8 -mb-8"></div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Timer className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold">Time Tracker</h3>
        </div>

        <div className="text-center mb-6">
          <p className="text-xs text-white/60 mb-2">Current Session</p>
          <p className="text-5xl font-bold tracking-wider font-mono">02:45:30</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Website Redesign</p>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">In Progress</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[65%] bg-white/60 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <Square className="h-4 w-4" strokeWidth={2} />
          </button>
          <button className="h-14 w-14 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg">
            <Play className="h-5 w-5 text-[#0f8b5f] ml-0.5" strokeWidth={2} fill="#0f8b5f" />
          </button>
          <button className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <Pause className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
