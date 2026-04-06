import { useState, useEffect } from 'react';
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

  const { data: schedules = [], isLoading, refetch } = useQuery({
    queryKey: ['schedules', dateStr],
    queryFn: async () => {
      console.log('Fetching schedules for date:', dateStr);
      
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('date', dateStr);
      
      if (error) {
        console.error('Error fetching schedules:', error);
        throw error;
      }
      
      console.log('Raw data from Supabase:', data);
      
      // Sort by time_start (handle both "08:00" and "8:00 AM" formats)
      const sorted = [...data].sort((a, b) => {
        const timeA = convertTo24Hour(a.time_start);
        const timeB = convertTo24Hour(b.time_start);
        return timeA.localeCompare(timeB);
      });
      
      console.log('Sorted schedules:', sorted);
      return sorted;
    },
    enabled: true, // Always fetch when date changes
  });

  // Helper function to convert various time formats to 24-hour for sorting
  const convertTo24Hour = (timeStr: string) => {
    // If already in 24-hour format like "08:00"
    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      return timeStr;
    }
    
    // Handle "8:00 AM" or "1:00 PM" format
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hour = parseInt(match[1]);
      const minute = match[2];
      const period = match[3].toUpperCase();
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return `${hour.toString().padStart(2, '0')}:${minute}`;
    }
    
    return timeStr; // fallback
  };

  // Force refetch when date changes
  useEffect(() => {
    console.log('Date changed to:', dateStr);
    refetch();
  }, [dateStr, refetch]);

  const navigate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    if (d >= LEX_START_DATE && d <= LEX_END_DATE) setSelectedDate(d);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

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
              <p className="text-2xl mt-2">📅</p>
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