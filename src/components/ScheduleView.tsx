import { useState, useMemo, useEffect } from 'react';
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
    // Normalize today's date to midnight to avoid time-of-day comparison issues
    today.setHours(0, 0, 0, 0);
    
    if (today >= LEX_START_DATE && today <= LEX_END_DATE) return today;
    return LEX_START_DATE;
  });
  
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline');

  // We use useMemo to ensure dateStr stays consistent
  const dateStr = useMemo(() => toDateString(selectedDate), [selectedDate]);

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules', dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('date', dateStr);
        
      if (error) throw error;

      // FIX: Robust Chronological Sorting in JavaScript
      return (data || []).sort((a, b) => {
        // Helper to convert time strings (like "8:00 AM" or "13:00") to a comparable number
        const getMinutes = (timeStr: string) => {
          if (!timeStr) return 0;
          // If your DB uses "08:00", this works. 
          // If it uses "8:00 AM", we convert to 24h for comparison
          const [time, modifier] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          
          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          
          return hours * 60 + minutes;
        };
        return getMinutes(a.time_start) - getMinutes(b.time_start);
      });
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
            view === 'timeline' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <List size={14} /> Timeline
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            view === 'calendar' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <CalendarDays size={14} /> Calendar
        </button>
      </div>

      {view === 'timeline' ? (
        <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DayHeader date={selectedDate} onPrev={() => navigate(-1)} onNext={() => navigate(1)} />
          <DayPdfButton date={dateStr} />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No activities scheduled for this day ({dateStr})</p>
              <p className="text-2xl mt-2">🌸</p>
            </div>
          ) : (
            <div className="space-y-0 mt-4">
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