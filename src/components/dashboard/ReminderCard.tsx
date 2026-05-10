import { CalendarDays, Clock, Video } from "lucide-react";

export default function ReminderCard() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#f3f4f6] shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <CalendarDays className="h-[18px] w-[18px] text-amber-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-[#111827]">Reminder</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-[#f4f5f7] rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0f8b5f]/10 flex items-center justify-center flex-shrink-0">
              <Video className="h-5 w-5 text-[#0f8b5f]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Team Standup Meeting</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Clock className="h-3.5 w-3.5 text-[#9ca3af]" strokeWidth={1.5} />
                <span className="text-xs text-[#9ca3af]">10:00 AM - 11:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f4f5f7] rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Video className="h-5 w-5 text-blue-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Client Review Call</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Clock className="h-3.5 w-3.5 text-[#9ca3af]" strokeWidth={1.5} />
                <span className="text-xs text-[#9ca3af]">2:00 PM - 3:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full mt-5 py-3 rounded-xl bg-[#0f8b5f] text-white text-sm font-semibold hover:bg-[#0d7a52] transition-colors shadow-md shadow-[#0f8b5f]/20">
        View Calendar
      </button>
    </div>
  );
}
