-- Supabase Row Level Security policies for this project.
-- Use this SQL in the Supabase SQL editor, then enable RLS on the tables.

-- Replace with your actual admin email address(es).
-- You can add more admin emails by extending the expression.

-- Enable RLS on the tables used by the app.
alter table if exists public.drivers enable row level security;
alter table if exists public.tutorials enable row level security;
alter table if exists public.videos enable row level security;
-- Public read access for blog/tutorials.
create policy if not exists "Public can select tutorials" on public.tutorials
  for select
  using (true);

-- Admin full access for blog/tutorials.
create policy if not exists "Admin can manage tutorials" on public.tutorials
  for all
  using (auth.email() = 'admin@company.com')
  with check (auth.email() = 'admin@company.com');

-- Public read access for drivers if needed.
create policy if not exists "Public can select drivers" on public.drivers
  for select
  using (true);

-- Admin full access for drivers.
create policy if not exists "Admin can manage drivers" on public.drivers
  for all
  using (auth.email() = 'admin@company.com')
  with check (auth.email() = 'admin@company.com');

-- If you want to protect storage access as well, configure Storage policies
-- from the Supabase Storage section instead of via table policies.
