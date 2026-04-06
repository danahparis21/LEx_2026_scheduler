import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toDateString, LEX_START_DATE, LEX_END_DATE } from '@/lib/constants';
import DayHeader from './DayHeader';
import ScheduleCard from './ScheduleCard';
import CalendarView from './CalendarView';
import DayPdfButton from './DayPdfButton';
import { CalendarDays, List } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScheduleView() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    if (today >= LEX_START_DATE && today <= LEX_END_DATE) return today;
    return LEX_START_DATE;
  });
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline');

  const dateStr = toDateString(selectedDate);

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('date', dateStr)
        .order('time_start');
      if (error) throw error;
      return data;
    },
  });

  const navigate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    if (d >= LEX_START_DATE && d <= LEX_END_DATE) setSelectedDate(d);
  };

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            view === 'timeline' ? 'gradient-pink text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'
          }`}
        >
          <List size={14} /> Timeline
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            view === 'calendar' ? 'gradient-pink text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'
          }`}
        >
          <CalendarDays size={14} /> Calendar
        </button>
      </div>

      {view === 'timeline' ? (
        <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DayHeader date={selectedDate} onPrev={() => navigate(-1)} onNext={() => navigate(1)} />
          <DayPdfButton date={dateStr} />
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No activities scheduled for this day</p>
              <p className="text-2xl mt-2">🌸</p>
            </div>
          ) : (
            <div className="space-y-0">
              {schedules.map((s, i) => (
                <ScheduleCard key={s.id} schedule={s} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <CalendarView selectedDate={selectedDate} onSelectDate={setSelectedDate} onSwitchToTimeline={() => setView('timeline')} />
      )}
    </div>
  );
}
