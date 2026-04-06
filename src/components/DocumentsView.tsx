import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, FolderOpen } from 'lucide-react';

export default function DocumentsView() {
  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
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
          <FolderOpen size={18} className="text-primary-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Documents</h2>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No documents uploaded yet</p>
          <p className="text-2xl mt-2">📄</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc, i) => (
            <motion.a
              key={doc.id}
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="gradient-soft p-2.5 rounded-lg">
                <FileText size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{doc.title}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{doc.doc_type || 'PDF'}</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
