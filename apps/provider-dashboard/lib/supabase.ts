import { createBrowserClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';

// Singleton Supabase client for browser-side usage
// This ensures all components share the same auth session

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;
let sessionCheckInterval: NodeJS.Timeout | null = null;

// Storage key used by Supabase (cookie-based for @supabase/ssr)
const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] || '';



export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    // Server-side: always create new instance
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  if (!supabaseInstance) {
    // ...existing code...
    
    // @supabase/ssr createBrowserClient uses COOKIES by default, not localStorage!
    // This is to stay in sync with the server-side middleware
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
          heartbeatIntervalMs: 30000,
          reconnectAfterMs: (tries: number) => Math.min(tries * 2000, 60000), // More lenient reconnection
        }
      }
    );

    // Debug: log auth state changes
    supabaseInstance.auth.onAuthStateChange((event: string, session: Session | null) => {
      // ...existing code...
    });

    // Set up periodic session check to detect and recover from session loss
    if (!sessionCheckInterval) {
      sessionCheckInterval = setInterval(async () => {
        const hasSession = await ensureSession();
        // ...existing code...
      }, 60000); // Check every 60 seconds (reduced from 30s to prevent realtime interference)
    }
  }
  return supabaseInstance;
}

/**
 * Ensures session is available, attempting recovery if needed.
 * Call this before any authenticated API call to prevent session loss issues.
 */
export async function ensureSession(): Promise<boolean> {
  if (!supabaseInstance || typeof window === 'undefined') {
    return false;
  }

  const { data: { session }, error } = await supabaseInstance.auth.getSession();
  
  if (session) {
    return true;
  }

  // Session is missing - try to refresh
  const { data: refreshData, error: refreshError } = await supabaseInstance.auth.refreshSession();
  
  if (refreshData.session) {
    return true;
  }
  return false;
}

/**
 * Protects session during critical operations that might interfere with auth state.
 * Use this wrapper for operations that create/destroy subscriptions or make heavy API calls.
 */
export async function withSessionProtection<T>(
  operation: () => Promise<T>,
  operationName: string = 'operation'
): Promise<T> {
  // Pre-operation session check
  const preSession = await ensureSession();
  if (!preSession) {
    throw new Error(`Session required for ${operationName}`);
  }
  try {
    const result = await operation();
    // Post-operation session verification
    const postSession = await ensureSession();
    if (!postSession) {
      const recovered = await ensureSession();
      if (!recovered) {
        throw new Error(`Session lost and recovery failed after ${operationName}`);
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
}


