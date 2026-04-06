import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface DayPdfButtonProps {
  date: string;
}

export default function DayPdfButton({ date }: DayPdfButtonProps) {
  const { data: pdfs = [] } = useQuery({
    queryKey: ['day-pdfs', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('day_pdfs')
        .select('*')
        .eq('date', date);
      if (error) throw error;
      return data;
    },
  });

  if (pdfs.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {pdfs.map((pdf) => (
        <motion.a
          key={pdf.id}
          href={pdf.file_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 gradient-soft rounded-xl p-3 border border-border hover:shadow-md transition-shadow"
        >
          <div className="gradient-pink p-2 rounded-lg">
            <FileText size={16} className="text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{pdf.title}</p>
            <p className="text-[10px] text-muted-foreground">View Full Program</p>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </motion.a>
      ))}
    </div>
  );
}
