import { createClient } from '@supabase/supabase-js';

// We noemen de constante createClientADM
export const createClientADM = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);