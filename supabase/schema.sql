-- Create the shared_qrs table
create table shared_qrs (
  id text primary key,
  config jsonb not null,
  created_at timestamptz default now()
);

-- Index for cleanup queries
create index shared_qrs_created_at_idx on shared_qrs(created_at);

-- Enable Row Level Security
alter table shared_qrs enable row level security;

-- Allow anyone to read shared QRs
create policy "Anyone can read shared QRs"
  on shared_qrs
  for select
  using (true);

-- Allow anyone to create shared QRs
create policy "Anyone can create shared QRs"
  on shared_qrs
  for insert
  with check (true);
