
-- Create schedules table
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT,
  title TEXT NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Anyone can insert schedules" ON public.schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete schedules" ON public.schedules FOR DELETE USING (true);
CREATE POLICY "Anyone can update schedules" ON public.schedules FOR UPDATE USING (true);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  what TEXT,
  "where" TEXT,
  "when" TEXT,
  extra TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Anyone can insert announcements" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete announcements" ON public.announcements FOR DELETE USING (true);
CREATE POLICY "Anyone can update announcements" ON public.announcements FOR UPDATE USING (true);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  doc_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete documents" ON public.documents FOR DELETE USING (true);

-- Create day_pdfs table
CREATE TABLE public.day_pdfs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.day_pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view day_pdfs" ON public.day_pdfs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert day_pdfs" ON public.day_pdfs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete day_pdfs" ON public.day_pdfs FOR DELETE USING (true);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Anyone can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Anyone can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads');
