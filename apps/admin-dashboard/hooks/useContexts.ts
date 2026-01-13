'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Specialism {
  id: string;
  code: string;
  display_name: string;
  is_active: boolean;
}

interface Group {
  id: string;
  code: string;
  display_name: string;
  group_type: string;
  is_active: boolean;
}

interface WorkContext {
  id: string;
  code: string;
  display_name: string;
  context_type: string;
  is_active: boolean;
}

interface Role {
  id: string;
  role_key: string;
  display_name: string;
  is_active: boolean;
}

interface Organization {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

interface UserContexts {
  roles: Array<{ role_id: string; is_primary: boolean }>;
  specialisms: Array<{ specialism_id: string; is_primary: boolean }>;
  organizations: Array<{ organization_id: string; is_primary: boolean }>;
  groups: Array<{ group_id: string; role_in_group?: string; is_primary: boolean }>;
  work_contexts: Array<{ work_context_id: string; is_primary: boolean }>;
}

export function useContexts() {
  const [specialisms, setSpecialisms] = useState<Specialism[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [workContexts, setWorkContexts] = useState<WorkContext[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchAllContexts();
  }, []);

  const fetchAllContexts = async () => {
    setLoading(true);
    
    const [specialismsRes, groupsRes, workContextsRes, rolesRes, orgsRes] = await Promise.all([
      supabase.from('specialisms').select('*').eq('is_active', true).order('display_order'),
      supabase.from('groups').select('*').eq('is_active', true).order('display_order'),
      supabase.from('work_contexts').select('*').eq('is_active', true).order('display_order'),
      supabase.from('roles').select('*').order('display_name'),
      supabase.from('organizations').select('*').order('name'),
    ]);

    if (!specialismsRes.error) setSpecialisms(specialismsRes.data || []);
    if (!groupsRes.error) setGroups(groupsRes.data || []);
    if (!workContextsRes.error) setWorkContexts(workContextsRes.data || []);
    if (!rolesRes.error) setRoles(rolesRes.data || []);
    if (!orgsRes.error) setOrganizations(orgsRes.data || []);

    setLoading(false);
  };

  const fetchUserContexts = async (userId: string): Promise<UserContexts> => {
    const [rolesRes, specialismsRes, orgsRes, groupsRes, workContextsRes] = await Promise.all([
      supabase.from('user_roles').select('role_id, is_primary').eq('user_id', userId),
      supabase.from('user_specialisms').select('specialism_id, is_primary').eq('user_id', userId),
      supabase.from('user_organizations').select('organization_id, is_primary').eq('user_id', userId),
      supabase.from('user_groups').select('group_id, role_in_group, is_primary').eq('user_id', userId),
      supabase.from('user_work_contexts').select('work_context_id, is_primary').eq('user_id', userId),
    ]);

    return {
      roles: rolesRes.data || [],
      specialisms: specialismsRes.data || [],
      organizations: orgsRes.data || [],
      groups: groupsRes.data || [],
      work_contexts: workContextsRes.data || [],
    };
  };

  const saveUserContexts = async (userId: string, contexts: UserContexts) => {
    try {
      // STAP 1: Verwijder ALLE oude contexts sequentieel om race conditions te voorkomen
      const { error: delRoles } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      const { error: delSpecialisms } = await supabase
        .from('user_specialisms')
        .delete()
        .eq('user_id', userId);
      
      const { error: delOrgs } = await supabase
        .from('user_organizations')
        .delete()
        .eq('user_id', userId);
      
      const { error: delGroups } = await supabase
        .from('user_groups')
        .delete()
        .eq('user_id', userId);
      
      const { error: delWorkContexts } = await supabase
        .from('user_work_contexts')
        .delete()
        .eq('user_id', userId);

      // STAP 2: Voeg nieuwe contexts toe
      if (contexts.roles && contexts.roles.length > 0) {
        const { error } = await supabase
          .from('user_roles')
          .insert(
            contexts.roles.map(r => ({ 
              user_id: userId,
              role_id: r.role_id,
              is_primary: r.is_primary || false
            }))
          );
        if (error) throw new Error(`Roles: ${error.message}`);
      }

      if (contexts.specialisms && contexts.specialisms.length > 0) {
        const { error } = await supabase
          .from('user_specialisms')
          .insert(
            contexts.specialisms.map(s => ({ 
              user_id: userId,
              specialism_id: s.specialism_id,
              is_primary: s.is_primary || false
            }))
          );
        if (error) throw new Error(`Specialisms: ${error.message}`);
      }

      if (contexts.organizations && contexts.organizations.length > 0) {
        const { error } = await supabase
          .from('user_organizations')
          .insert(
            contexts.organizations.map(o => ({ 
              user_id: userId,
              organization_id: o.organization_id,
              is_primary: o.is_primary || false
            }))
          );
        if (error) throw new Error(`Organizations: ${error.message}`);
      }

      if (contexts.groups && contexts.groups.length > 0) {
        const { error } = await supabase
          .from('user_groups')
          .insert(
            contexts.groups.map(g => ({ 
              user_id: userId,
              group_id: g.group_id,
              role_in_group: g.role_in_group || null,
              is_primary: g.is_primary || false
            }))
          );
        if (error) throw new Error(`Groups: ${error.message}`);
      }

      if (contexts.work_contexts && contexts.work_contexts.length > 0) {
        const { error } = await supabase
          .from('user_work_contexts')
          .insert(
            contexts.work_contexts.map(wc => ({ 
              user_id: userId,
              work_context_id: wc.work_context_id,
              is_primary: wc.is_primary || false
            }))
          );
        if (error) throw new Error(`Work contexts: ${error.message}`);
      }

      // STAP 3: Update user_active_contexts met primary work context en specialism
      // Dit zorgt ervoor dat de frontend direct de juiste context ziet
      // Na migration 012: user_active_contexts.user_id verwijst nu naar profiles.id (consistent met user_work_contexts)
      
      const primaryWorkContext = contexts.work_contexts?.find(wc => wc.is_primary);
      const primarySpecialism = contexts.specialisms?.find(s => s.is_primary);
      const primaryRole = contexts.roles?.find(r => r.is_primary);
      const primaryOrg = contexts.organizations?.find(o => o.is_primary);
      const primaryGroup = contexts.groups?.find(g => g.is_primary);

      console.log('Saving active contexts for user:', userId);
      console.log('Primary specialism:', primarySpecialism);
      console.log('Primary work context:', primaryWorkContext);

      // Upsert user_active_contexts - userId is profiles.id
      const { error: activeContextError, data: activeContextData } = await supabase
        .from('user_active_contexts')
        .upsert({
          user_id: userId,  // profiles.id - consistent met user_work_contexts
          active_work_context_id: primaryWorkContext?.work_context_id || null,
          active_specialism_id: primarySpecialism?.specialism_id || null,
          active_role_id: primaryRole?.role_id || null,
          active_organization_id: primaryOrg?.organization_id || null,
          active_group_id: primaryGroup?.group_id || null,
          last_updated: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (activeContextError) {
        console.error('Error updating active contexts:', activeContextError);
        // Als FK error, toon melding aan gebruiker
        if (activeContextError.message.includes('foreign key')) {
          throw new Error(`Actieve context opslaan mislukt: Voer migration 012 uit in Supabase. (${activeContextError.message})`);
        }
      } else {
        console.log('Active contexts saved successfully:', activeContextData);
      }
    } catch (error: any) {
      console.error('Error saving contexts:', error);
      throw error;
    }
  };

  return {
    specialisms,
    groups,
    workContexts,
    roles,
    organizations,
    loading,
    fetchUserContexts,
    saveUserContexts,
  };
}
