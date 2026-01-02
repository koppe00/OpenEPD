'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, X, MapPin, Phone, Mail, 
  ShieldAlert, FolderLock, ExternalLink, Loader2, Save, Fingerprint, CheckCircle2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
  onSuccess: (patient: any) => void;
}

export function PatientRegistrationModal({ isOpen, onClose, patientId, onSuccess }: Props) {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasRelationship, setHasRelationship] = useState<boolean>(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!isOpen || !patientId) return;
    
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const { data: p } = await supabase.from('profiles').select('*').eq('id', patientId).single();
      const { data: rel } = await supabase.from('care_relationships')
        .select('id').eq('patient_user_id', patientId).eq('caregiver_user_id', user?.id).maybeSingle();
      
      if (p) setPatient(p);
      setHasRelationship(!!rel);
      setLoading(false);
    };
    fetchData();
  }, [isOpen, patientId, supabase]);

  const handleUpdateField = (field: string, value: string) => {
    setPatient((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    setSaving(true);
    const constructedFullName = `${patient.first_name || ''} ${patient.name_prefix || ''} ${patient.last_name || ''}`.replace(/\s+/g, ' ').trim();

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: patient.first_name,
        name_prefix: patient.name_prefix,
        last_name: patient.last_name,
        full_name: constructedFullName || patient.full_name,
        phone: patient.phone,
        email: patient.email,
        address_street: patient.address_street,
        address_house_number: patient.address_house_number,
        address_zipcode: patient.address_zipcode,
        address_city: patient.address_city,
        is_patient: true
      })
      .eq('id', patientId);
    
    setSaving(false);
    if (!error) alert("Gegevens bijgewerkt!");
  };

  const handleEstablishRelationship = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('care_relationships').upsert({
        patient_user_id: patientId,
        caregiver_user_id: user?.id,
        role_code: 'spec', 
        relationship_level: 'TREAT',
        consent_source: 'local'
    }, { onConflict: 'patient_user_id,caregiver_user_id' });
    
    if (!error) {
        setHasRelationship(true);
        onSuccess(patient); // Geef seintje aan dashboard om te selecteren
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#F8FAFC] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Fingerprint size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MPI Registratie</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              {loading ? 'Laden...' : patient?.full_name}
            </h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {/* Formulier velden (Identiteit) */}
              <div className="space-y-6">
                <section className="bg-white p-6 rounded-[2rem] border border-slate-200">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Naamgegevens</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      className="p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      value={patient.first_name || ''}
                      onChange={(e) => handleUpdateField('first_name', e.target.value)}
                      placeholder="Voornaam"
                    />
                    <input 
                      className="p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      value={patient.last_name || ''}
                      onChange={(e) => handleUpdateField('last_name', e.target.value)}
                      placeholder="Achternaam"
                    />
                  </div>
                </section>
                
                {/* Adres sectie */}
                <section className="bg-white p-6 rounded-[2rem] border border-slate-200">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Adres</h3>
                  <input 
                      className="w-full p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900 outline-none mb-3"
                      value={patient.address_street || ''}
                      onChange={(e) => handleUpdateField('address_street', e.target.value)}
                      placeholder="Straat"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900" value={patient.address_zipcode || ''} placeholder="Postcode" onChange={(e) => handleUpdateField('address_zipcode', e.target.value)} />
                    <input className="p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900" value={patient.address_city || ''} placeholder="Stad" onChange={(e) => handleUpdateField('address_city', e.target.value)} />
                  </div>
                </section>
              </div>

              {/* Status & Actie */}
              <div className="space-y-6">
                <section className="bg-white p-6 rounded-[2rem] border border-slate-200">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Contact</h3>
                   <input className="w-full p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900 mb-3" value={patient.phone || ''} placeholder="Telefoon" onChange={(e) => handleUpdateField('phone', e.target.value)} />
                   <input className="w-full p-4 bg-slate-50 rounded-xl text-sm font-black text-slate-900" value={patient.email || ''} placeholder="E-mail" onChange={(e) => handleUpdateField('email', e.target.value)} />
                </section>

                <div className="mt-auto">
                   {!hasRelationship ? (
                      <button onClick={handleEstablishRelationship} className="w-full bg-amber-500 text-white p-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-900/20">
                        Bevestig Relatie & Open Dossier
                      </button>
                   ) : (
                      <button onClick={() => onSuccess(patient)} className="w-full bg-emerald-600 text-white p-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2">
                        <FolderLock size={16} /> Open Dossier
                      </button>
                   )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-8 bg-white border-t border-slate-100 flex justify-end">
          <button onClick={saveChanges} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg">
             <Save size={16} /> Gegevens Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}