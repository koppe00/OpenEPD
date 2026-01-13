'use client';

import { useMemo, useSyncExternalStore, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Shield, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

// Hulpmiddelen voor useSyncExternalStore
const subscribe = () => () => {}; 
const getSnapshot = () => typeof window !== 'undefined' ? window.location.origin : '';
const getServerSnapshot = () => '';

export default function LoginPage() {
  const router = useRouter();
  
  const origin = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const supabase = getSupabaseBrowserClient();

  // --- DE FIX: Luister naar statusverandering ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        // Zodra de gebruiker is ingelogd, sturen we hem direct naar de root (dashboard)
        router.push('/');
        router.refresh(); // Forceert een refresh van server components (zoals middleware)
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic">MijnOpenEPD</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Toegang tot uw soeverein dossier</p>
        </div>

        {origin ? (
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: { brand: '#2563eb', brandAccent: '#1d4ed8' },
                  radii: { borderRadiusButton: '12px', inputBorderRadius: '12px' },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: { email_label: 'E-mailadres', button_label: 'Inloggen' },
                sign_up: { email_label: 'E-mailadres', button_label: 'Account aanmaken' }
              }
            }}
            providers={[]}
            // redirectTo blijft hier staan voor e-mail verificatie links
            redirectTo={`${origin}/`}
          />
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-300 animate-pulse font-bold text-xs uppercase tracking-widest">
            Beveiligde verbinding opzetten...
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          <Activity size={12} className="text-blue-500" />
          Secure OpenEPD Gateway
        </div>
      </div>
    </div>
  );
}