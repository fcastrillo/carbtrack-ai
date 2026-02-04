-- pump_profile (perfil bomba – entrada manual) per data-model.md
create table if not exists public.pump_profile (
  id uuid primary key default gen_random_uuid(),
  isf numeric(5,2),
  ratio_ic numeric(5,2),
  updated_at timestamptz default now()
);

comment on table public.pump_profile is 'Fallback manual ISF y ratio I:C cuando Nightscout no está disponible';
