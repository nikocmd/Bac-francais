-- Ajouter les colonnes premium + usage
-- À exécuter dans Supabase → SQL Editor

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS free_uses integer DEFAULT 0;
