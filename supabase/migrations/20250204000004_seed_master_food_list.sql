-- Seed mínimo para master_food_list (Educadies); ampliar con CSV o datos reales
insert into public.master_food_list (alimento, ch_por_racion, medida, categoria) values
  ('Pan blanco', 15, '1 rebanada', 'Cereales'),
  ('Arroz cocido', 28, '100 g', 'Cereales'),
  ('Manzana', 15, '1 unidad mediana', 'Frutas');

-- Nota: para poblar con catálogo Educadies completo, usar script de importación CSV
-- o ejecutar inserts desde docs/csv_upload o fuente oficial Educadies.
