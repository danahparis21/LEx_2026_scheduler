import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import ScheduleView from '@/components/ScheduleView';
import AnnouncementsView from '@/components/AnnouncementsView';
import DocumentsView from '@/components/DocumentsView';
import AdminPanel from '@/components/AdminPanel';
import FloatingPresence from '@/components/FloatingPresence';
import { useAdmin } from '@/hooks/useAdmin';
import { Sparkles } from 'lucide-react';

type Tab = 'schedule' | 'announcements' | 'documents' | 'admin';

export default function Index() {
  const [tab, setTab] = useState<Tab>('schedule');
  const { isAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="gradient-hero p-1.5 rounded-lg">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-foreground leading-tight">LEx Program Scheduler</h1>
              <p className="text-[9px] text-muted-foreground leading-tight">G2L Learning Express 2026 • NSPFWAC</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'schedule' && <ScheduleView />}
            {tab === 'announcements' && <AnnouncementsView />}
            {tab === 'documents' && <DocumentsView />}
            {tab === 'admin' && <AdminPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating presence */}
      <FloatingPresence />

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={setTab} isAdmin={isAdmin} />
    </div>
  );
}
