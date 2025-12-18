-- users tabel voor Auth en metadata
CREATE TABLE public.users (
  id uuid NOT NULL,
  ehr_id uuid NOT NULL, -- De koppeling met de EHRBase Command Store!
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,

  -- Metadata voor de Agentic Services
  preferred_language text DEFAULT 'nl_NL'::text NOT NULL,
  storage_location text, -- De Google Drive/NAS locatie
  
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_ehr_id_unique UNIQUE (ehr_id)
);

-- Beleid voor Row Level Security (RLS) op de users tabel (cruciaal voor privacy)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read and update their own profile" ON public.users 
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Tabel voor de gedenormaliseerde 'lezing' van vitale functies (CQRS Read Store)
CREATE TABLE public.vitals_read_store (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  ehr_id uuid NOT NULL,
  data_type text NOT NULL, -- bv. 'blood_pressure', 'heart_rate'
  recorded_at timestamp with time zone NOT NULL,
  systolic numeric,
  diastolic numeric,
  
  CONSTRAINT vitals_read_store_pkey PRIMARY KEY (id),
  CONSTRAINT vitals_read_store_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.users(ehr_id)
);

-- Index voor snelle tijdlijn-queries op basis van patiënt en tijd.
CREATE INDEX vitals_ehr_id_time_idx ON public.vitals_read_store USING btree (ehr_id, recorded_at DESC);