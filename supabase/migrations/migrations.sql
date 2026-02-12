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
-- meal_history (registro de comidas) per data-model.md
create table if not exists public.meal_history (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  ai_analysis jsonb,
  user_confirmed_carbs int not null,
  glucose_at_meal int,
  timestamp timestamptz not null,
  user_id uuid
);

comment on table public.meal_history is 'Registro por comida; alimenta Hoy, Bitácora y auditoría';
-- pump_profile (perfil bomba – entrada manual) per data-model.md
create table if not exists public.pump_profile (
  id uuid primary key default gen_random_uuid(),
  isf numeric(5,2),
  ratio_ic numeric(5,2),
  updated_at timestamptz default now()
);

comment on table public.pump_profile is 'Fallback manual ISF y ratio I:C cuando Nightscout no está disponible';
-- Bucket meal-images per data-model.md (MVP: public read/upload)
insert into storage.buckets (id, name, public)
values ('meal-images', 'meal-images', true)
on conflict (id) do nothing;

-- Allow public read for MVP (sin auth)
create policy "Public read meal-images"
on storage.objects for select
using (bucket_id = 'meal-images');

-- Allow public upload for MVP (sin auth; nombres únicos recomendados, ej. uuid)
create policy "Public upload meal-images"
on storage.objects for insert
with check (bucket_id = 'meal-images');
-- Seed mínimo para master_food_list (Educadies); ampliar con CSV o datos reales
insert into public.master_food_list (alimento, ch_por_racion, medida, categoria) values
  ('Pan blanco', 15, '1 rebanada', 'Cereales'),
  ('Arroz cocido', 28, '100 g', 'Cereales'),
  ('Manzana', 15, '1 unidad mediana', 'Frutas');

-- Nota: para poblar con catálogo Educadies completo, usar script de importación CSV
-- o ejecutar inserts desde docs/csv_upload o fuente oficial Educadies.
