import { useState, useEffect, useMemo } from 'react';
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
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(LEX_START_DATE);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(LEX_END_DATE);
    endDate.setHours(0, 0, 0, 0);
    
    if (today >= startDate && today <= endDate) {
      return today;
    }
    return startDate;
  });
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline');

  const dateStr = toDateString(selectedDate);

  const { data: schedules = [], refetch } = useQuery({
    queryKey: ['schedules', dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('date', dateStr)
        .order('time_start', { ascending: true });
      
      if (error) throw error;
      
      // Ensure proper time sorting (e.g., "08:00" comes before "13:00")
      return [...data].sort((a, b) => {
        return a.time_start.localeCompare(b.time_start);
      });
    },
  });

  // Refetch when date changes
  useEffect(() => {
    refetch();
  }, [dateStr, refetch]);

  const navigate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    if (d >= LEX_START_DATE && d <= LEX_END_DATE) setSelectedDate(d);
  };

  // Debug logging
  useEffect(() => {
    console.log('Current date:', dateStr);
    console.log('Schedules count:', schedules.length);
    if (schedules.length > 0) {
      console.log('First schedule time:', schedules[0].time_start);
      console.log('Last schedule time:', schedules[schedules.length - 1].time_start);
    }
  }, [dateStr, schedules]);

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