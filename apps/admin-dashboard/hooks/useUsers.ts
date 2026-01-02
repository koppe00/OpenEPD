import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface SaveUserOptions {
  authMethod: 'invite' | 'manual';
  tempPassword?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Definieer supabase client binnen de hook zodat alle functies erbij kunnen
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = async () => {
  setLoading(true);
  try {
    const [pRes, oRes, rRes, lRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*, staff_memberships(organization_id, organizations(name))')
            // We zoeken specifiek naar mensen die GEEN patiënt zijn
            .or('is_patient.eq.false,is_patient.is.null') 
            .order('last_name'),
      supabase.from('organizations').select('*').order('name'),
      supabase.from('roles').select('*').order('display_name'),
      supabase.from('nen7513_logs')
        .select('*, actor:actor_user_id(full_name)')
        .order('timestamp', { ascending: false })
        .limit(5)
    ]);

    // Check of er fouten zijn in de individuele responses
    if (pRes.error) throw pRes.error;
    if (oRes.error) throw oRes.error;
    
    setUsers(pRes.data || []);
    setOrganizations(oRes.data || []);
    setRoles(rRes.data || []);
    setLogs(lRes.data || []);
  } catch (error: any) {
    // Dit zorgt dat je de echte fout in je browser console ziet!
    console.error("CRITISCHE FOUT BIJ SYNCHRONISEREN:", error.message || error);
    alert("Fout bij ophalen gegevens: " + (error.message || "Onbekende fout"));
  } finally {
    // Deze regel zorgt ervoor dat "Registers synchroniseren" ALTIJD verdwijnt
    setLoading(false);
  }
};

const saveUser = async (formData: any, authOptions: any, userId?: string) => {
  try {
    // 1. Haal organisatie_id eruit, dit hoort niet in de 'profiles' tabel
    const { organization_id, staff_memberships, ...profileDataOnly } = formData;

    if (userId || formData.id) {
      const finalId = userId || formData.id;

      // UPDATE: Alleen de profielvelden naar 'profiles'
      const { error: pError } = await supabase
        .from('profiles')
        .upsert({ 
          ...profileDataOnly, 
          id: finalId,
          updated_at: new Date().toISOString() 
        });
      if (pError) throw pError;

      // Update organisatie koppeling in de APARTE tabel
      if (organization_id) {
        await supabase
          .from('staff_memberships')
          .upsert({
            user_id: finalId,
            organization_id: organization_id
          });
      }
    } else {
      // CREATE: Nieuwe gebruiker via de API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          authMethod: authOptions.authMethod,
          password: authOptions.tempPassword,
          profileData: formData // De API route handelt het splitsen daar wel af
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
    }

    await fetchData();
  } catch (error: any) {
    console.error("Fout bij opslaan:", error.message);
    throw error;
  }
};


const deleteUser = async (userId: string) => {
  if (!confirm("Weet u zeker dat u de toegang voor deze gebruiker wilt intrekken?")) return;

  try {
    // 1. Zet op inactief in profiles
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    
    // (Optioneel: Hier zou je ook een 'end_date' kunnen zetten in een 'employment' tabel)

    await fetchData();
  } catch (error: any) {
    console.error("Fout bij deactiveren:", error.message);
    alert("Fout: " + error.message);
  }
};

const reactivateUser = async (userId: string) => {
  try {
    // We gebruiken hiervoor de API route omdat we ook logs willen schrijven
    // en eventueel auth-instellingen moeten resetten (toekomstmuziek)
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'reactivate' })
    });
    
    if (!response.ok) throw new Error('Heractiveren mislukt');
    await fetchData();
  } catch (error: any) {
    alert("Fout: " + error.message);
  }
};

useEffect(() => {
    fetchData();
  }, []); // Lege dependency array zorgt dat dit 1x gebeurt bij laden

 // De return moet ALLE variabelen bevatten die de page.tsx verwacht
  return { 
    users, 
    organizations, 
    roles, 
    logs, 
    loading, 
    saveUser, 
    deleteUser, 
    reactivateUser,
    refresh: fetchData 
  };
}