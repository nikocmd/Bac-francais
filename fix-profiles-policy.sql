-- Empêche un utilisateur de supprimer / recréer son profil (contournement de l'essai gratuit)
-- Les profils sont créés uniquement par le trigger handle_new_user à l'inscription.
-- À exécuter dans Supabase → SQL Editor

DROP POLICY IF EXISTS "Modifier son propre profil" ON public.profiles;

CREATE POLICY "Modifier son propre profil" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vérification : doit lister uniquement une policy SELECT et une policy UPDATE
SELECT policyname, cmd FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles';
