-- Tableau de bord des limites : compteurs d'appels API (écrits uniquement par le serveur)
-- À exécuter dans Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS public.api_metrics (
  day date NOT NULL,
  service text NOT NULL,
  metric text NOT NULL,
  value bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (day, service, metric)
);
ALTER TABLE public.api_metrics ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.service_status (
  service text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.service_status ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.increment_metric(p_service text, p_metric text, p_value bigint)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO api_metrics (day, service, metric, value)
  VALUES ((now() AT TIME ZONE 'utc')::date, p_service, p_metric, p_value)
  ON CONFLICT (day, service, metric) DO UPDATE SET value = api_metrics.value + EXCLUDED.value;
$$;

CREATE OR REPLACE FUNCTION public.admin_db_size()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT pg_database_size(current_database()); $$;

REVOKE EXECUTE ON FUNCTION public.increment_metric(text, text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_db_size() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_metric(text, text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_db_size() TO service_role;
