import { getDayNumber, getDayName, formatDate } from '@/lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DayHeaderProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

export default function DayHeader({ date, onPrev, onNext }: DayHeaderProps) {
  const dayNum = getDayNumber(date);
  const dayName = getDayName(date);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-hero rounded-2xl p-5 text-primary-foreground mb-4 shadow-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <button onClick={onPrev} className="p-1 rounded-full hover:bg-primary-foreground/20 transition">
          <ChevronLeft size={20} />
        </button>
        <p className="text-sm font-medium opacity-90">{formatDate(date)}</p>
        <button onClick={onNext} className="p-1 rounded-full hover:bg-primary-foreground/20 transition">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">Day {dayNum}</h1>
        <p className="text-sm font-medium opacity-80">{dayName}</p>
      </div>
    </motion.div>
  );
}
