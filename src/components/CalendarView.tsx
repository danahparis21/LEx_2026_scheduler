import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LEX_START_DATE, LEX_END_DATE, toDateString, getDayNumber } from '@/lib/constants';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  onSwitchToTimeline: () => void;
}

export default function CalendarView({ selectedDate, onSelectDate, onSwitchToTimeline }: CalendarViewProps) {
  const { data: allSchedules = [] } = useQuery({
    queryKey: ['all-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schedules').select('date');
      if (error) throw error;
      return data;
    },
  });

  const scheduledDates = new Set(allSchedules.map(s => s.date));

  const days: Date[] = [];
  const d = new Date(LEX_START_DATE);
  while (d <= LEX_END_DATE) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  const handleSelect = (date: Date) => {
    onSelectDate(date);
    onSwitchToTimeline();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-lg font-bold mb-4 text-foreground">LEx Program Calendar</h2>
      <p className="text-xs text-muted-foreground mb-4">April 6 – 17, 2026</p>
      <div className="grid grid-cols-4 gap-2">
        {days.map((day) => {
          const ds = toDateString(day);
          const isSelected = toDateString(selectedDate) === ds;
          const hasEvents = scheduledDates.has(ds);
          const dayNum = getDayNumber(day);

          return (
            <button
              key={ds}
              onClick={() => handleSelect(day)}
              className={`rounded-xl p-3 text-center transition-all ${
                isSelected
                  ? 'gradient-pink text-primary-foreground shadow-lg scale-105'
                  : hasEvents
                  ? 'bg-accent text-accent-foreground hover:shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              <div className="text-lg font-extrabold">Day {dayNum}</div>
              <div className="text-[10px] font-medium mt-0.5">
                {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              {hasEvents && !isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
