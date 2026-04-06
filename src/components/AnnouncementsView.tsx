import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Megaphone, MapPin, Clock, Info } from 'lucide-react';

export default function AnnouncementsView() {
  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="gradient-pink p-2 rounded-lg">
          <Megaphone size={18} className="text-primary-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Announcements</h2>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No announcements yet</p>
          <p className="text-2xl mt-2">📢</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4 shadow-sm"
            >
              <h3 className="font-bold text-sm text-foreground mb-3">{a.title}</h3>
              <div className="space-y-2">
                {a.what && (
                  <div className="flex items-start gap-2">
                    <div className="gradient-warm p-1 rounded-md mt-0.5">
                      <Info size={12} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">What</p>
                      <p className="text-xs text-foreground">{a.what}</p>
                    </div>
                  </div>
                )}
                {a.where && (
                  <div className="flex items-start gap-2">
                    <div className="gradient-warm p-1 rounded-md mt-0.5">
                      <MapPin size={12} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Where</p>
                      <p className="text-xs text-foreground">{a.where}</p>
                    </div>
                  </div>
                )}
                {a.when && (
                  <div className="flex items-start gap-2">
                    <div className="gradient-warm p-1 rounded-md mt-0.5">
                      <Clock size={12} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">When</p>
                      <p className="text-xs text-foreground">{a.when}</p>
                    </div>
                  </div>
                )}
                {a.extra && (
                  <div className="mt-2 bg-accent rounded-lg p-2">
                    <p className="text-xs text-accent-foreground">{a.extra}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
