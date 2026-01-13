import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * API endpoint to resolve AI configuration for a given feature and context
 * 
 * Example request body:
 * {
 *   "feature_id": "zib_extraction",
 *   "user_id": "user-uuid",
 *   "group_ids": ["group-uuid-1", "group-uuid-2"],
 *   "role": "physician",
 *   "specialisme": "Cardiologie",
 *   "werkcontext": "Polikliniek",
 *   "organization_id": "org-uuid"
 * }
 * 
 * Returns: Resolved configuration with merged/replaced config based on scope priority
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    
    // Get the request body
    const body = await request.json();
    const {
      feature_id,
      user_id,
      group_ids = [],
      role,
      specialisme,
      werkcontext,
      organization_id
    } = body;

    if (!feature_id) {
      return NextResponse.json(
        { error: 'feature_id is required' },
        { status: 400 }
      );
    }

    // Call the resolve_ai_config database function
    const { data, error } = await supabase
      .rpc('resolve_ai_config', {
        p_feature_id: feature_id,
        p_user_id: user_id || null,
        p_group_ids: group_ids,
        p_role: role || null,
        p_specialisme: specialisme || null,
        p_werkcontext: werkcontext || null,
        p_organization_id: organization_id || null
      });

    if (error) {
      console.error('Error resolving AI config:', error);
      return NextResponse.json(
        { error: 'Failed to resolve configuration', details: error.message },
        { status: 500 }
      );
    }

    // If no config found, return null
    if (!data || data.length === 0) {
      return NextResponse.json({
        feature_id,
        config: null,
        resolved_from: null,
        message: 'No configuration found for this context'
      });
    }

    // Return the resolved configuration
    const resolved = data[0];
    
    return NextResponse.json({
      feature_id,
      config: resolved.merged_config,
      resolved_from: {
        scope_type: resolved.scope_type,
        scope_value: resolved.scope_value,
        scope_label: resolved.scope_label,
        priority: resolved.priority
      },
      effective_config: resolved.merged_config,
      is_active: resolved.is_active
    });

  } catch (error: any) {
    console.error('Error in AI config resolve endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch user context and resolve config in one call
 * 
 * Query params:
 * - feature_id: The feature to resolve config for
 * 
 * Automatically extracts user context from session
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    
    const { searchParams } = new URL(request.url);
    const feature_id = searchParams.get('feature_id');

    if (!feature_id) {
      return NextResponse.json(
        { error: 'feature_id query parameter is required' },
        { status: 400 }
      );
    }

    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user_id = session.user.id;

    // Fetch user profile to get role, specialisme, etc.
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, specialisme, organization_id')
      .eq('user_id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Continue with basic context
    }

    // Fetch user groups
    const { data: groups, error: groupsError } = await supabase
      .from('user_groups')
      .select('group_id')
      .eq('user_id', user_id);

    const group_ids = groups?.map((g: { group_id: string }) => g.group_id) || [];

    // Resolve configuration with user context
    const { data, error } = await supabase
      .rpc('resolve_ai_config', {
        p_feature_id: feature_id,
        p_user_id: user_id,
        p_group_ids: group_ids,
        p_role: profile?.role || null,
        p_specialisme: profile?.specialisme || null,
        p_werkcontext: null, // Could be extracted from current session
        p_organization_id: profile?.organization_id || null
      });

    if (error) {
      console.error('Error resolving AI config:', error);
      return NextResponse.json(
        { error: 'Failed to resolve configuration', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        feature_id,
        config: null,
        resolved_from: null,
        message: 'No configuration found for this context'
      });
    }

    const resolved = data[0];
    
    return NextResponse.json({
      feature_id,
      user_context: {
        user_id,
        role: profile?.role,
        specialisme: profile?.specialisme,
        organization_id: profile?.organization_id,
        group_ids
      },
      config: resolved.merged_config,
      resolved_from: {
        scope_type: resolved.scope_type,
        scope_value: resolved.scope_value,
        scope_label: resolved.scope_label,
        priority: resolved.priority
      },
      is_active: resolved.is_active
    });

  } catch (error: any) {
    console.error('Error in AI config resolve endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
