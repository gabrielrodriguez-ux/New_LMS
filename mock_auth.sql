-- Mock Supabase Auth schema for local development
create schema if not exists auth;
create table if not exists auth.users (
    id uuid primary key,
    email text,
    encrypted_password text,
    email_confirmed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Function to simulate auth.uid()
create or replace function auth.uid() returns uuid as $$
select '00000000-0000-0000-0000-000000000000'::uuid;
$$ language sql stable;
