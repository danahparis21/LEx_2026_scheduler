import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Tables } from '@/integrations/supabase/types';

interface ScheduleCardProps {
  schedule: Tables<'schedules'>;
  index: number;
}

export default function ScheduleCard({ schedule, index }: ScheduleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const timeDisplay = schedule.time_end
    ? `${schedule.time_start} - ${schedule.time_end}`
    : schedule.time_start;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex gap-3 items-start">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center pt-1">
            <div className="w-3 h-3 rounded-full gradient-pink shadow-md" />
            <div className="w-0.5 flex-1 bg-border mt-1" />
          </div>

          {/* Card */}
          <div className="flex-1 bg-card rounded-xl border border-border p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Clock size={13} />
              <span className="text-xs font-semibold">{timeDisplay}</span>
            </div>
            <h3 className="font-bold text-sm text-foreground leading-snug">{schedule.title}</h3>
            <div className="flex items-center justify-between mt-1">
              {schedule.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={12} />
                  <span className="text-xs">{schedule.location}</span>
                </div>
              )}
              <div className="text-muted-foreground">
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-6 overflow-hidden"
          >
            <div className="gradient-soft rounded-xl p-4 mb-3 border border-border">
              <h4 className="font-bold text-sm text-foreground mb-2">{schedule.title}</h4>
              {schedule.location && (
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <MapPin size={14} />
                  <span className="text-xs">{schedule.location}</span>
                </div>
              )}
              {schedule.description && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{schedule.description}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
