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
