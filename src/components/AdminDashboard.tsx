import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogOut, Plus, Trash2, Calendar, Megaphone, FileText, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AdminTab = 'schedules' | 'announcements' | 'documents' | 'pdfs';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>('schedules');
  const qc = useQueryClient();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
        <button onClick={onLogout} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-destructive transition">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {([
          { id: 'schedules' as const, icon: Calendar, label: 'Schedules' },
          { id: 'announcements' as const, icon: Megaphone, label: 'Announcements' },
          { id: 'documents' as const, icon: FileText, label: 'Documents' },
          { id: 'pdfs' as const, icon: Upload, label: 'Day PDFs' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
              tab === t.id ? 'gradient-pink text-primary-foreground shadow' : 'bg-muted text-muted-foreground'
            }`}
          >
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'schedules' && <ScheduleAdmin qc={qc} />}
      {tab === 'announcements' && <AnnouncementAdmin qc={qc} />}
      {tab === 'documents' && <DocumentAdmin qc={qc} />}
      {tab === 'pdfs' && <DayPdfAdmin qc={qc} />}
    </div>
  );
}

function ScheduleAdmin({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [form, setForm] = useState({ date: '', time_start: '', time_end: '', title: '', location: '', description: '' });

  const { data: schedules = [] } = useQuery({
    queryKey: ['admin-schedules'],
    queryFn: async () => {
      const { data } = await supabase.from('schedules').select('*').order('date').order('time_start');
      return data || [];
    },
  });

  const addMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('schedules').insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Schedule added!');
      setForm({ date: '', time_start: '', time_end: '', title: '', location: '', description: '' });
      qc.invalidateQueries({ queryKey: ['schedules'] });
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
      qc.invalidateQueries({ queryKey: ['all-schedules'] });
    },
    onError: () => toast.error('Failed to add schedule'),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Deleted!');
      qc.invalidateQueries({ queryKey: ['schedules'] });
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
      qc.invalidateQueries({ queryKey: ['all-schedules'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1"><Plus size={14} /> Add Schedule</h3>
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Start (e.g. 8:30 AM)" value={form.time_start} onChange={e => setForm({...form, time_start: e.target.value})} className="px-3 py-2 rounded-lg border border-border text-xs bg-background" />
          <input placeholder="End (e.g. 9:00 AM)" value={form.time_end} onChange={e => setForm({...form, time_end: e.target.value})} className="px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        </div>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background resize-none" rows={2} />
        <button onClick={() => addMut.mutate()} disabled={!form.date || !form.time_start || !form.title} className="w-full gradient-pink text-primary-foreground py-2 rounded-lg text-xs font-bold disabled:opacity-50 shadow">
          Add Schedule
        </button>
      </div>

      <div className="space-y-2">
        {schedules.map((s) => (
          <div key={s.id} className="flex items-center gap-2 bg-card rounded-xl border border-border p-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{s.title}</p>
              <p className="text-[10px] text-muted-foreground">{s.date} • {s.time_start}</p>
            </div>
            <button onClick={() => delMut.mutate(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementAdmin({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [form, setForm] = useState({ title: '', what: '', where: '', when: '', extra: '' });

  const { data: items = [] } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const addMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('announcements').insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Announcement posted!');
      setForm({ title: '', what: '', where: '', when: '', extra: '' });
      qc.invalidateQueries({ queryKey: ['announcements'] });
      qc.invalidateQueries({ queryKey: ['admin-announcements'] });
    },
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Deleted!');
      qc.invalidateQueries({ queryKey: ['announcements'] });
      qc.invalidateQueries({ queryKey: ['admin-announcements'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1"><Plus size={14} /> Post Announcement</h3>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input placeholder="What" value={form.what} onChange={e => setForm({...form, what: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input placeholder="Where" value={form.where} onChange={e => setForm({...form, where: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input placeholder="When" value={form.when} onChange={e => setForm({...form, when: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <textarea placeholder="Extra details" value={form.extra} onChange={e => setForm({...form, extra: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background resize-none" rows={2} />
        <button onClick={() => addMut.mutate()} disabled={!form.title} className="w-full gradient-pink text-primary-foreground py-2 rounded-lg text-xs font-bold disabled:opacity-50 shadow">
          Post Announcement
        </button>
      </div>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.id} className="flex items-center gap-2 bg-card rounded-xl border border-border p-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{a.title}</p>
            </div>
            <button onClick={() => delMut.mutate(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentAdmin({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: docs = [] } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const handleUpload = async () => {
    if (!file || !title) return;
    setUploading(true);
    try {
      const path = `documents/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
      const { error } = await supabase.from('documents').insert({
        title,
        file_url: urlData.publicUrl,
        doc_type: file.name.split('.').pop() || 'pdf',
      });
      if (error) throw error;
      toast.success('Document uploaded!');
      setTitle('');
      setFile(null);
      qc.invalidateQueries({ queryKey: ['documents'] });
      qc.invalidateQueries({ queryKey: ['admin-documents'] });
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Deleted!');
      qc.invalidateQueries({ queryKey: ['documents'] });
      qc.invalidateQueries({ queryKey: ['admin-documents'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1"><Plus size={14} /> Upload Document</h3>
        <input placeholder="Document title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input type="file" accept=".pdf,.doc,.docx,.txt,.pptx" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs" />
        <button onClick={handleUpload} disabled={!title || !file || uploading} className="w-full gradient-pink text-primary-foreground py-2 rounded-lg text-xs font-bold disabled:opacity-50 shadow">
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
      <div className="space-y-2">
        {docs.map((d) => (
          <div key={d.id} className="flex items-center gap-2 bg-card rounded-xl border border-border p-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{d.title}</p>
              <p className="text-[10px] text-muted-foreground">{d.doc_type}</p>
            </div>
            <button onClick={() => delMut.mutate(d.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayPdfAdmin({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: pdfs = [] } = useQuery({
    queryKey: ['admin-day-pdfs'],
    queryFn: async () => {
      const { data } = await supabase.from('day_pdfs').select('*').order('date');
      return data || [];
    },
  });

  const handleUpload = async () => {
    if (!file || !title || !date) return;
    setUploading(true);
    try {
      const path = `day_pdfs/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
      const { error } = await supabase.from('day_pdfs').insert({
        date,
        title,
        file_url: urlData.publicUrl,
      });
      if (error) throw error;
      toast.success('Day PDF uploaded!');
      setDate('');
      setTitle('');
      setFile(null);
      qc.invalidateQueries({ queryKey: ['day-pdfs'] });
      qc.invalidateQueries({ queryKey: ['admin-day-pdfs'] });
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('day_pdfs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Deleted!');
      qc.invalidateQueries({ queryKey: ['day-pdfs'] });
      qc.invalidateQueries({ queryKey: ['admin-day-pdfs'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1"><Plus size={14} /> Upload Day Program PDF</h3>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input placeholder="PDF title (e.g. Day 2 Program)" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background" />
        <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs" />
        <button onClick={handleUpload} disabled={!date || !title || !file || uploading} className="w-full gradient-pink text-primary-foreground py-2 rounded-lg text-xs font-bold disabled:opacity-50 shadow">
          {uploading ? 'Uploading...' : 'Upload Day PDF'}
        </button>
      </div>
      <div className="space-y-2">
        {pdfs.map((p) => (
          <div key={p.id} className="flex items-center gap-2 bg-card rounded-xl border border-border p-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{p.title}</p>
              <p className="text-[10px] text-muted-foreground">{p.date}</p>
            </div>
            <button onClick={() => delMut.mutate(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
