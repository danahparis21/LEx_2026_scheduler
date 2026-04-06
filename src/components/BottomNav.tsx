import { Calendar, Megaphone, FileText, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'schedule' | 'announcements' | 'documents' | 'admin';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  isAdmin: boolean;
}

const tabs: { id: Tab; label: string; icon: typeof Calendar }[] = [
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'announcements', label: 'News', icon: Megaphone },
  { id: 'documents', label: 'Docs', icon: FileText },
  { id: 'admin', label: 'Admin', icon: Shield },
];

export default function BottomNav({ active, onChange, isAdmin }: BottomNavProps) {
  const visibleTabs = tabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {visibleTabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full gradient-pink"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={20}
                className={isActive ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
