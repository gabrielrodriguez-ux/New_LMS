-- Create comments table for course discussions
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  parent_id uuid references public.comments(id), -- For threaded replies
  created_at timestamptz default now()
);

-- RLS
alter table public.comments enable row level security;
create policy "Enable all access for auth users" on public.comments for all using (auth.role() = 'authenticated');

-- Mock data for discussion
WITH first_course AS (SELECT id FROM public.courses LIMIT 1),
     first_user AS (SELECT id FROM public.users LIMIT 1)
INSERT INTO public.comments (course_id, user_id, content)
SELECT id, (SELECT id FROM public.users LIMIT 1), 'Great introduction to the topic! Really enjoying the pace.'
FROM public.courses LIMIT 1;
