import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/zib-config
 * Retrieves active ZIB configuration for current user/specialisme
 * 
 * Query params:
 * - specialisme: Optional specialisme filter
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialisme = searchParams.get('specialisme');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[ZIB Config API] Auth error:', authError);
      // Return default config for unauthenticated requests
      return NextResponse.json({
        config_id: null,
        enabled_zibs: getDefaultZibs(),
        custom_prompt: null
      });
    }

    // Call database function to get active config
    const { data, error } = await supabase.rpc('get_active_zib_config', {
      p_user_id: user.id,
      p_specialisme: specialisme
    });

    if (error) {
      console.error('[ZIB Config API] Error fetching config:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no custom config found, return defaults
    if (!data || data.length === 0) {
      return NextResponse.json({
        config_id: null,
        enabled_zibs: getDefaultZibs(),
        custom_prompt: null
      });
    }

    const config = data[0];
    return NextResponse.json({
      config_id: config.config_id,
      enabled_zibs: config.enabled_zibs || getDefaultZibs(),
      custom_prompt: config.custom_prompt
    });

  } catch (error) {
    console.error('[ZIB Config API] Fatal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Default ZIB set (fallback)
 */
function getDefaultZibs() {
  return [
    'nl.zorg.Bloeddruk',
    'nl.zorg.Hartfrequentie',
    'nl.zorg.O2Saturatie',
    'nl.zorg.Lichaamstemperatuur',
    'nl.zorg.Lichaamsgewicht',
    'nl.zorg.Lichaamslengte',
    'nl.zorg.Ademhaling',
    'nl.zorg.AandoeningOfGesteldheid',
    'nl.zorg.Diagnose',
    'nl.zorg.Medicatieafspraak',
    'nl.zorg.OvergevoeligheidIntolerantie',
    'nl.zorg.TabakGebruik',
    'nl.zorg.LaboratoriumUitslag',
    'nl.zorg.Anamnese',
    'nl.zorg.LichamelijkOnderzoek',
    'nl.zorg.Evaluatie',
    'nl.zorg.Beleid',
    'nl.zorg.PoliklinischConsult',
    'nl.zorg.DBCDeclaratie'
  ];
}
