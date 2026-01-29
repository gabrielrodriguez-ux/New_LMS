-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. IAM & Tenants (Clients)
-- "Tenants" in our multi-tenant architecture map to "Clients" (B2B Companies)
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  domain text,
  industry text,
  contact_email text,
  cif text, -- Tax ID
  branding jsonb, -- logo_url, colors
  created_at timestamptz default now()
);

-- Users (Extending Supabase Auth)
-- We'll use a public.profiles table to extend auth.users
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id),
  first_name text,
  last_name text,
  role text check (role in ('student', 'manager', 'admin', 'l_and_d')), 
  job_title text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. Catalog (Courses & Modules)
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  hours numeric(5,2),
  level text check (level in ('basic', 'intermediate', 'advanced')),
  family_professional text, -- FUNDAE
  status text default 'draft', -- draft, published, archived
  version integer default 1,
  fundae_compatible boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

create table public.modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  type text check (type in ('video', 'quiz', 'text', 'scorm')),
  content_url text,
  duration_minutes integer,
  order_index integer,
  is_mandatory boolean default true
);

-- 3. B2B Subscriptions & Seats
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) not null,
  plan_name text not null,
  total_seats integer not null default 0,
  users_per_seat integer default 2, -- "Un asiento puede tener hasta 2 usuarios"
  start_date date,
  end_date date,
  status text check (status in ('active', 'expired', 'cancelled')) default 'active',
  created_at timestamptz default now()
);

-- Many-to-Many: Subscriptions <-> Courses (Programs included in the sub)
create table public.subscription_courses (
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  primary key (subscription_id, course_id)
);

-- 4. Learning Process (Enrollments & Progress)
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  course_id uuid references public.courses(id) not null,
  subscription_id uuid references public.subscriptions(id), -- Link usage to a contract
  status text check (status in ('assigned', 'in_progress', 'completed', 'expired')) default 'assigned',
  progress_pct integer default 0,
  assigned_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create table public.progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  module_id uuid references public.modules(id) not null,
  course_id uuid references public.courses(id) not null, -- Denormalized for query speed
  status text check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
  time_spent_seconds integer default 0,
  score numeric(5,2), -- For quizzes
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, module_id)
);

-- 5. Gamification
create table public.gamification_stats (
  user_id uuid primary key references public.users(id),
  total_xp integer default 0,
  current_level integer default 1,
  current_streak integer default 0,
  last_activity_date date
);

create table public.badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  icon_url text,
  criteria jsonb
);

create table public.user_badges (
  user_id uuid references public.users(id) not null,
  badge_id uuid references public.badges(id) not null,
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

-- 6. FUNDAE & Compliance
create table public.fundae_expedients (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id),
  course_id uuid references public.courses(id),
  expedient_code text, -- "EXP-2025-001"
  status text check (status in ('draft', 'generated', 'submitted', 'validated')) default 'draft',
  compliance_score integer,
  generated_at timestamptz default now()
);

-- RLS (Row Level Security) - Basic Setup using Helper Function
alter table public.clients enable row level security;
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;

-- Policy: Users can read their own data
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);

-- Policy: Clients can be viewed by users belonging to that client
create policy "Users can view own client" on public.clients for select using (
  id in (select client_id from public.users where id = auth.uid())
);

-- Policy: Admin Role Access (Mock for now, assumes 'admin' role in metadata or table)
-- Real implementation would use a function to check jwt() -> app_metadata -> role
