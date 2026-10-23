-- Offre Basic (5€/mois, 25€/an) + verrouillage des colonnes de facturation
-- À exécuter dans Supabase → SQL Editor

-- 1. Type d'offre : null/'premium' = illimité, 'basic' = quotas mensuels
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan text;

-- 2. Compteurs d'usage mensuels (écrits uniquement par le serveur via service role)
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL,
  feature text NOT NULL,
  count int NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, month, feature)
);

ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Voir son propre usage" ON public.usage_counters;
CREATE POLICY "Voir son propre usage" ON public.usage_counters
  FOR SELECT USING (auth.uid() = user_id);

-- 3. Empêche un utilisateur de modifier lui-même is_premium / plan / free_uses / stripe_customer_id
CREATE OR REPLACE FUNCTION public.protect_billing_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF auth.role() IN ('authenticated', 'anon') THEN
      NEW.is_premium := false;
      NEW.plan := null;
      NEW.free_uses := 0;
      NEW.stripe_customer_id := null;
    END IF;
    RETURN NEW;
  END IF;

  IF auth.role() IN ('authenticated', 'anon') AND (
       NEW.is_premium IS DISTINCT FROM OLD.is_premium
    OR NEW.plan IS DISTINCT FROM OLD.plan
    OR NEW.free_uses IS DISTINCT FROM OLD.free_uses
    OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
  ) THEN
    RAISE EXCEPTION 'Colonnes de facturation en lecture seule';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_billing ON public.profiles;
CREATE TRIGGER protect_billing
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_billing_columns();
