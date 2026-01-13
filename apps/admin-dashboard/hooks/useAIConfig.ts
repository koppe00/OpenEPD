'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export interface AIFeature {
  id: string;
  feature_id: string;
  name: string;
  description: string;
  category: string;
  config_schema: any;
  default_config: any;
  is_active: boolean;
  is_beta: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIConfigAssignment {
  id: string;
  feature_id: string;
  scope_id: string;
  config: any;
  override_mode: 'merge' | 'replace';
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  created_at: string;
  scope?: AIConfigScope;
  feature?: AIFeature;
}

export interface AIConfigScope {
  id: string;
  scope_type: 'user' | 'group' | 'role' | 'specialisme' | 'werkcontext' | 'organization' | 'global';
  scope_value: string;
  scope_label?: string;
  priority: number;
  metadata?: any;
  created_at: string;
}

export function useAIConfig() {
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [assignments, setAssignments] = useState<AIConfigAssignment[]>([]);
  const [scopes, setScopes] = useState<AIConfigScope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all features
  const fetchFeatures = async () => {
    try {
      const { data, error: err } = await supabase
        .from('ai_features')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (err) throw err;
      setFeatures(data || []);
    } catch (err: any) {
      console.error('Error fetching features:', err);
      setError(err.message);
    }
  };

  // Fetch all assignments with related data
  const fetchAssignments = async () => {
    try {
      const { data, error: err } = await supabase
        .from('ai_config_assignments')
        .select(`
          *,
          scope:ai_config_scopes(*),
          feature:ai_features(*)
        `)
        .order('created_at', { ascending: false });
      
      if (err) throw err;
      setAssignments(data || []);
    } catch (err: any) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
    }
  };

  // Fetch all scopes
  const fetchScopes = async () => {
    try {
      const { data, error: err } = await supabase
        .from('ai_config_scopes')
        .select('*')
        .order('priority', { ascending: true });
      
      if (err) throw err;
      setScopes(data || []);
    } catch (err: any) {
      console.error('Error fetching scopes:', err);
      setError(err.message);
    }
  };

  // Create or update feature
  const saveFeature = async (feature: Partial<AIFeature>) => {
    try {
      if (feature.id) {
        const { error: err } = await supabase
          .from('ai_features')
          .update({
            ...feature,
            updated_at: new Date().toISOString()
          })
          .eq('id', feature.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('ai_features')
          .insert([feature]);
        if (err) throw err;
      }
      await fetchFeatures();
    } catch (err: any) {
      console.error('Error saving feature:', err);
      throw err;
    }
  };

  // Create or update assignment
  const saveAssignment = async (assignment: Partial<AIConfigAssignment>) => {
    try {
      if (assignment.id) {
        const { error: err } = await supabase
          .from('ai_config_assignments')
          .update({
            ...assignment,
            updated_at: new Date().toISOString()
          })
          .eq('id', assignment.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('ai_config_assignments')
          .insert([assignment]);
        if (err) throw err;
      }
      await fetchAssignments();
    } catch (err: any) {
      console.error('Error saving assignment:', err);
      throw err;
    }
  };

  // Create or update scope
  const saveScope = async (scope: Partial<AIConfigScope>) => {
    try {
      if (scope.id) {
        const { error: err } = await supabase
          .from('ai_config_scopes')
          .update(scope)
          .eq('id', scope.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('ai_config_scopes')
          .insert([scope]);
        if (err) throw err;
      }
      await fetchScopes();
    } catch (err: any) {
      console.error('Error saving scope:', err);
      throw err;
    }
  };

  // Delete assignment
  const deleteAssignment = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('ai_config_assignments')
        .delete()
        .eq('id', id);
      if (err) throw err;
      await fetchAssignments();
    } catch (err: any) {
      console.error('Error deleting assignment:', err);
      throw err;
    }
  };

  // Toggle feature active status
  const toggleFeature = async (id: string, is_active: boolean) => {
    try {
      const { error: err } = await supabase
        .from('ai_features')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (err) throw err;
      await fetchFeatures();
    } catch (err: any) {
      console.error('Error toggling feature:', err);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeatures(),
        fetchAssignments(),
        fetchScopes()
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  return {
    features,
    assignments,
    scopes,
    loading,
    error,
    saveFeature,
    saveAssignment,
    saveScope,
    deleteAssignment,
    toggleFeature,
    refetch: async () => {
      await Promise.all([fetchFeatures(), fetchAssignments(), fetchScopes()]);
    }
  };
}
