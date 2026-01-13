import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { WorkContext, UserActiveContext } from '@openepd/clinical-core';

export interface UseWorkContextsReturn {
  workContexts: WorkContext[];
  activeContext: WorkContext | null;
  isLoading: boolean;
  error: Error | null;
  switchContext: (contextId: string) => Promise<void>;
  refreshContexts: () => Promise<void>;
  _revision: number; // Internal revision counter for forcing React updates
}

/**
 * Hook to manage work contexts for the current user
 * Replaces WorkflowMode state management with database-driven contexts
 */
export function useWorkContexts(userId: string): UseWorkContextsReturn {
  const [workContexts, setWorkContexts] = useState<WorkContext[]>([]);
  const [activeContext, setActiveContext] = useState<WorkContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [revision, setRevision] = useState(Date.now()); // Use timestamp for unique revisions

  const supabase = getSupabaseBrowserClient();

  // Fetch available work contexts for user
  const fetchWorkContexts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user's accessible work contexts
      const { data: userWorkContexts, error: userError } = await supabase
        .from('user_work_contexts')
        .select('work_context_id')
        .eq('user_id', userId);

      if (userError) throw userError;

      const contextIds = userWorkContexts?.map((uwc: { work_context_id: string }) => uwc.work_context_id) || [];

      // Fetch full work context details
      const { data: contexts, error: contextError } = await supabase
        .from('work_contexts')
        .select('*')
        .in('id', contextIds)
        .eq('is_active', true)
        .order('display_order');

      if (contextError) throw contextError;

      setWorkContexts(contexts || []);

      // Get active context
      const { data: activeData, error: activeError } = await supabase
        .from('user_active_contexts')
        .select('active_work_context_id')
        .eq('user_id', userId)
        .single();

      if (activeError && activeError.code !== 'PGRST116') throw activeError;

      if (activeData?.active_work_context_id) {
        const active = contexts?.find((c: WorkContext) => c.id === activeData.active_work_context_id);
        setActiveContext(active || null);
      } else if (contexts && contexts.length > 0) {
        // Auto-select first context if none selected
        setActiveContext(contexts[0]);
      }

    } catch (err) {
      console.error('Error fetching work contexts:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Switch to a different work context
  const switchContext = useCallback(async (contextId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update active context in database
      const { error: updateError } = await supabase
        .from('user_active_contexts')
        .upsert({
          user_id: userId,
          active_work_context_id: contextId,
          last_updated: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        console.error('Supabase upsert error:', updateError.message, updateError.code, updateError.details, updateError.hint);
        throw new Error(`Database error: ${updateError.message}`);
      }

      // Update local state immediately - create new object reference to force React re-render
      const newActive = workContexts.find(c => c.id === contextId);
      if (newActive) {
        const clonedContext = { ...newActive };
        setActiveContext(clonedContext);
        setRevision(Date.now()); // Force component update with unique timestamp
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('Error switching work context:', errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, workContexts, supabase, activeContext]); // Added activeContext to fix stale closure

  // Initial load
  useEffect(() => {
    if (userId) {
      fetchWorkContexts();
    }
  }, [userId, fetchWorkContexts]);

  // Return value as memoized object to ensure proper React updates
  return useMemo(() => {
    return {
      workContexts,
      activeContext,
      isLoading,
      error,
      switchContext,
      refreshContexts: fetchWorkContexts,
      _revision: revision, // Internal revision counter
    };
  }, [workContexts, activeContext, isLoading, error, switchContext, fetchWorkContexts, revision]);
}
