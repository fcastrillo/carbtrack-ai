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
