-- master_food_list (Catálogo Educadies) per data-model.md
create table if not exists public.master_food_list (
  id uuid primary key default gen_random_uuid(),
  alimento text not null,
  ch_por_racion numeric(6,2) not null,
  medida text,
  categoria text,
  created_at timestamptz default now()
);

comment on table public.master_food_list is 'Catálogo Educadies para cruce con Vision';
