'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createBrowserClient } from '@supabase/ssr';
import { Shield, Activity } from 'lucide-react';

// Hulpmiddelen voor useSyncExternalStore om te detecteren of we in de browser zijn
const subscribe = () => () => {}; 
const getSnapshot = () => window.location.origin;
const getServerSnapshot = () => '';

export default function LoginPage() {
  // Dit is de 'officiële' manier van React om te synchroniseren met window/DOM
  // zonder setState() te gebruiken in een useEffect.
  const origin = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

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

        {/* Als origin een waarde heeft (dus we zijn in de browser), toon de Auth component */}
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