'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { 
  User, ArrowLeft, MapPin, Phone, Mail, 
  ShieldAlert, FolderLock, ExternalLink, Loader2, Save, Fingerprint, CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PatientDossierPage({ params }: any) {
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [hasRelationship, setHasRelationship] = useState<boolean | null>(null);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    params.then((unwrapped: any) => setPatientId(unwrapped.id));
  }, [params]);

  useEffect(() => {
    if (!patientId) return;
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: p } = await supabase.from('profiles').select('*').eq('id', patientId).single();
      const { data: rel } = await supabase.from('care_relationships')
        .select('id').eq('patient_user_id', patientId).eq('caregiver_user_id', user?.id).maybeSingle();
      
      if (p) setPatient(p);
      setHasRelationship(!!rel);
      setLoading(false);
    };
    fetchData();
  }, [patientId, supabase]);

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
        is_patient: true,
        wid_status: patient.wid_status // Bijv. 'verified' of 'unverified'
      })
      .eq('id', patientId);
    
    setSaving(false);
    if (!error) alert("Patiëntgegevens succesvol bijgewerkt in de MPI.");
  };

  if (loading || !patient) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-end mb-12">
            <div className="flex items-center gap-6">
                <button onClick={() => router.push('/')} className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <Fingerprint size={12} /> BSN: {patient.bsn_number || 'Onbekend'}
                        </span>
                        {patient.wid_status === 'verified' && (
                            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={10} /> WID Geverifieerd
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        {patient.full_name || 'Nieuwe Patiënt'}
                    </h1>
                </div>
            </div>
            <button 
                onClick={saveChanges}
                disabled={saving}
                className="bg-slate-900 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10"
            >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Opslaan
            </button>
        </header>

        <div className="grid grid-cols-12 gap-8">
            {/* LINKER KOLOM: NAAM & ADRES */}
            <div className="col-span-12 lg:col-span-7 space-y-8">
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                        <User size={14} className="text-blue-500" /> Identiteit
                    </h3>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Voornaam</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.first_name || ''}
                                onChange={(e) => handleUpdateField('first_name', e.target.value)}
                            />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Tussenv.</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.name_prefix || ''}
                                onChange={(e) => handleUpdateField('name_prefix', e.target.value)}
                            />
                        </div>
                        <div className="col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Achternaam</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.last_name || ''}
                                onChange={(e) => handleUpdateField('last_name', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-500" /> Adresgegevens
                    </h3>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Straat</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.address_street || ''}
                                onChange={(e) => handleUpdateField('address_street', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Nr.</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.address_house_number || ''}
                                onChange={(e) => handleUpdateField('address_house_number', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Postcode</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.address_zipcode || ''}
                                onChange={(e) => handleUpdateField('address_zipcode', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Stad</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.address_city || ''}
                                onChange={(e) => handleUpdateField('address_city', e.target.value)}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* RECHTER KOLOM: CONTACT & DOSSIER-LINK */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                        <Phone size={14} className="text-amber-500" /> Bereikbaarheid
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Mobiel</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.phone || ''}
                                onChange={(e) => handleUpdateField('phone', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">E-mail</label>
                            <input 
                                className="w-full p-4 bg-slate-100/80 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-slate-900 outline-none"
                                value={patient.email || ''}
                                onChange={(e) => handleUpdateField('email', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    {!hasRelationship ? (
                        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 text-center">
                            <ShieldAlert size={32} className="text-amber-500 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-6 px-4 leading-relaxed">Geen actieve behandelrelatie voor dit dossier</p>
                            <button className="w-full bg-amber-500 text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-900/20 hover:bg-amber-600 transition-all">
                                Relatie Bevestigen
                            </button>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 text-center">
                            <FolderLock size={32} className="text-emerald-500 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-6">Autorisatie Verleend</p>
                            <button 
                                onClick={() => router.push(`/?select=${patientId}`)}
                                className="w-full bg-emerald-600 text-white p-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                            >
                                <ExternalLink size={18} /> Open Klinisch Dossier
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}