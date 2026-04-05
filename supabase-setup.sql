-- ============================================
-- COLLE CE SQL DANS : Supabase → SQL Editor
-- ============================================

-- 1. Table profils utilisateurs
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  filiere text default 'general',
  is_premium boolean default false,
  stripe_customer_id text,
  free_uses integer default 0,
  oeuvre_choisie text,
  auteur_choisi text,
  grammar_questions text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Table données gamification
create table if not exists public.hunter_data (
  user_id uuid references auth.users(id) on delete cascade primary key,
  level integer default 1,
  xp integer default 0,
  xp_to_next integer default 500,
  rank text default 'E',
  title text default 'Élève Novice',
  stats jsonb default '{"INT":0,"CHA":0,"WIS":0,"STR":0,"LCK":0}',
  quests jsonb default '[]',
  total_analyses integer default 0,
  total_orals integer default 0,
  total_oeuvres integer default 0,
  total_examens integer default 0,
  updated_at timestamptz default now()
);

-- 3. Table des textes enregistrés par l'utilisateur
create table if not exists public.user_texts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titre text,
  auteur text,
  oeuvre text,
  texte text not null,
  axe text,
  created_at timestamptz default now()
);

-- 4. Activer Row Level Security
alter table public.profiles enable row level security;
alter table public.hunter_data enable row level security;
alter table public.user_texts enable row level security;

-- 5. Policies profils
create policy "Voir son propre profil" on public.profiles
  for select using (auth.uid() = id);
create policy "Modifier son propre profil" on public.profiles
  for all using (auth.uid() = id);

-- 6. Policies hunter_data
create policy "Voir ses propres données" on public.hunter_data
  for select using (auth.uid() = user_id);
create policy "Modifier ses propres données" on public.hunter_data
  for all using (auth.uid() = user_id);

-- 7. Policies user_texts
create policy "Voir ses propres textes" on public.user_texts
  for select using (auth.uid() = user_id);
create policy "Ajouter ses propres textes" on public.user_texts
  for insert with check (auth.uid() = user_id);
create policy "Modifier ses propres textes" on public.user_texts
  for update using (auth.uid() = user_id);
create policy "Supprimer ses propres textes" on public.user_texts
  for delete using (auth.uid() = user_id);

-- 8. Créer profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    ''
  );
  insert into public.hunter_data (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. Storage bucket pour les avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "Avatar public" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Upload son avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Modifier son avatar" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
