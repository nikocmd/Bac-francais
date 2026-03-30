-- Ajouter les colonnes pour stocker l'œuvre choisie par l'élève
-- À exécuter dans Supabase → SQL Editor

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS oeuvre_choisie text,
ADD COLUMN IF NOT EXISTS auteur_choisi text;
