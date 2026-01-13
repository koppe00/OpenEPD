import { createClient } from '@supabase/supabase-js'

// Gebruik de environment variabelen die we in Stap 1 hebben gedefinieerd
const supabaseUrl = process.env.SUPABASE_URL!
// Prefer the service role key for server-side writes (bypass RLS), fallback to anon if not set
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Resolve external identifiers to a real patient id and save vitals as a ZIB composition in `zib_compositions`.
export async function saveVitalsProjection(ehr_id: string, systolic: number, diastolic: number) {
  async function resolvePatientId(external: string): Promise<string | null> {
    // Map the synthetic external id to the real patient id for Jansen
    const demoMapping: Record<string,string> = { 'UUID456': '246e25e7-9b5f-4712-85b2-5033682d8226' }

    // If external looks like UUID, return it
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (uuidRegex.test(external)) return external

    const mapped = demoMapping[external] || external

    // If the mapping resolved to a UUID, return it immediately
    if (uuidRegex.test(mapped)) return mapped

    if (/@/.test(mapped)) {
      const { data, error } = await supabase.from('profiles').select('id').eq('email', mapped).limit(1).maybeSingle()
      if (error) {
        console.error('resolvePatientId supabase error:', error)
        return null
      }
      if (data && (data as any).id) return (data as any).id
      return null
    }

    const { data, error } = await supabase.from('profiles').select('id').ilike('last_name', `%${mapped}%`).limit(1).maybeSingle()
    if (error) {
      console.error('resolvePatientId supabase error:', error)
      return null
    }
    if (data && (data as any).id) return (data as any).id
    return null
  }

  const resolved = await resolvePatientId(ehr_id)
  if (!resolved) {
    console.warn('Could not resolve patient id for', ehr_id, '- skipping insert to respect RLS')
    return false
  }

  const payload = {
    patient_id: resolved,
    external_id: null,
    caregiver_id: 'c7e05c45-cca4-455a-82ca-50dfe9a40e01',
    zib_id: 'nl.zorg.Bloeddruk',
    zib_version: '3.1',
      clinical_status: 'active',
      confidentiality_code: 'N',
      verification_status: 'confirmed',
      content: { systolic, diastolic, position: 'sitting' },
    recorded_at: new Date().toISOString(),
    source_system: 'OpenEPD-Workflow'
  }

  const { data: insertData, error: insertError } = await supabase.from('zib_compositions').insert([payload])
  if (insertError) {
    console.error('❌ FOUT bij opslaan in zib_compositions:', insertError.message || insertError)
    return false
  }
  console.log('[projection] inserted zib_compositions row', insertData)
  return true
}