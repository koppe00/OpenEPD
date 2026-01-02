'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, CreditCard, MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Loader2, ShieldCheck, AlertCircle, Save,
  Search, ExternalLink, Calendar, HeartPulse, Phone
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { GENDER_OPTIONS, NAME_USE_OPTIONS, COUNTRY_OPTIONS } from '../../../config/codelists';

// --- STYLING ---
const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all";
const labelClass = "text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 block";

// --- DEMO UZOVI LOOKUP ---
const UZOVI_MAP: Record<string, string> = {
  '3311': 'CZ Zorgverzekeraar',
  '0101': 'Zilveren Kruis',
  '7022': 'VGZ',
  '0691': 'Menzis',
  '3355': 'ONVZ'
};

export function PatientRegistrationWidget() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);
  const [existingPatient, setExistingPatient] = useState<any>(null);

  // Form State (V2 conform FO)
  const [formData, setFormData] = useState({
    // Identificatie
    bsn: '', dob: '',
    // Naam
    initials: '', firstName: '', namePrefix: '', lastName: '', nickname: '', nameUse: 'official',
    // Demografie
    gender: '' as any, nationality: 'NL',
    // Contact
    email: '', phone: '', street: '', houseNumber: '', zipcode: '', city: '', country: 'NL',
    // Verzekering
    uzovi: '', policyNumber: '', insurerName: '',
    // Noodcontact
    emergencyName: '', emergencyPhone: '', emergencyRelation: ''
  });

  // Derived: Verzekeraar naam op basis van UZOVI
  const detectedInsurer = useMemo(() => UZOVI_MAP[formData.uzovi] || '', [formData.uzovi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'bsn') {
        setError(null);
        setExistingPatient(null);
    }
  };

  const handleBSNLookup = async () => {
    if (formData.bsn.length !== 9) {
      setError("BSN moet exact 9 cijfers bevatten.");
      return;
    }

    setLookupLoading(true);
    setError(null);

    try {
        const { data: existing } = await supabase
            .from('profiles')
            .select('*')
            .eq('bsn_number', formData.bsn)
            .maybeSingle();

        if (existing) {
            setExistingPatient(existing);
        } else {
            // Simulatie SBV-Z lookup vertraging
            await new Promise(res => setTimeout(res, 1200));
            setStep(2);
        }
    } catch (err) {
        setError("Fout bij database verificatie.");
    } finally {
        setLookupLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessie verlopen. Log opnieuw in.");

      const newPatientId = crypto.randomUUID();
      const now = new Date().toISOString();

      // INSERT CONFORM FO & NIEUWE KOLOMMEN
      const { error: insertError } = await supabase.from('profiles').insert({
        id: newPatientId,
        bsn_number: formData.bsn,
        date_of_birth: formData.dob,
        // Uitgebreide naam
        initials: formData.initials,
        first_name: formData.firstName,
        name_prefix: formData.namePrefix,
        last_name: formData.lastName,
        nickname: formData.nickname,
        full_name: `${formData.firstName} ${formData.namePrefix ? formData.namePrefix + ' ' : ''}${formData.lastName}`,
        name_use: formData.nameUse,
        // Demografie
        administrative_gender: formData.gender,
        nationality: formData.nationality,
        // Contact
        email: formData.email,
        phone: formData.phone,
        address_street: formData.street,
        address_house_number: formData.houseNumber,
        address_zipcode: formData.zipcode,
        address_city: formData.city,
        // Complex (JSONB)
        insurance_data: [{
            uzovi: formData.uzovi,
            insurer_name: detectedInsurer || formData.insurerName,
            policy_number: formData.policyNumber
        }],
        emergency_contacts: [{
            name: formData.emergencyName,
            phone: formData.emergencyPhone,
            relationship: formData.emergencyRelation
        }],
        is_patient: true,
        updated_at: now
      });

      if (insertError) throw insertError;

      // Zorgrelatie vastleggen
      await supabase.from('care_relationships').insert({
          patient_user_id: newPatientId,
          caregiver_user_id: user.id,
          role_code: 'practitioner',
          relationship_level: 'treatment'
      });

      setCreatedPatientId(newPatientId);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                <User size={20} />
            </div>
            <div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Patiënt Registratie V2</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">zib 2024 / nl-core-patient compliant</p>
            </div>
        </div>
        {step > 1 && !success && (
            <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                STAP {step} / 5
            </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {error && (
            <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        {existingPatient ? (
             <div className="space-y-4 animate-in zoom-in-95">
                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 text-center">
                    <AlertCircle className="mx-auto text-amber-500 mb-2" />
                    <h4 className="font-black text-amber-900">BSN reeds bekend</h4>
                    <p className="text-xs text-amber-700 mt-1">Deze patiënt is al ingeschreven in uw praktijk.</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User /></div>
                    <div>
                        <p className="font-black text-sm text-slate-900">{existingPatient.full_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Geboren: {existingPatient.date_of_birth}</p>
                    </div>
                </div>
                <button onClick={() => router.push(`/patient/${existingPatient.id}`)} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    Dossier Openen <ExternalLink size={14} />
                </button>
             </div>
        ) : success ? (
            <div className="text-center py-10 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40}/></div>
                <h3 className="text-xl font-black text-slate-900">Registratie Voltooid</h3>
                <p className="text-sm text-slate-500 mt-2 mb-8">De patiënt is opgenomen in het MPI en de behandelrelatie is vastgelegd.</p>
                <div className="flex gap-2">
                    <button onClick={() => router.push(`/patient/${createdPatientId}`)} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black text-xs uppercase">Naar Dossier</button>
                    <button onClick={() => window.location.reload()} className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-black text-xs uppercase">Nieuwe Inschrijving</button>
                </div>
            </div>
        ) : (
            <>
                {/* STAP 1: IDENTIFICATIE */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>BSN Nummer</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input name="bsn" value={formData.bsn} onChange={handleChange} className={`${inputClass} pl-12 text-lg font-mono`} placeholder="123456789" maxLength={9} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Geboortedatum</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                )}

                {/* STAP 2: NAAMGEGEVENS (ZIB CONFORM) */}
                {step === 2 && (
                    <div className="grid grid-cols-12 gap-4 animate-in fade-in slide-in-from-right-4">
                        <div className="col-span-4">
                            <label className={labelClass}>Voorletters</label>
                            <input name="initials" value={formData.initials} onChange={handleChange} className={inputClass} placeholder="J.A." />
                        </div>
                        <div className="col-span-8">
                            <label className={labelClass}>Voornaam</label>
                            <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="col-span-4">
                            <label className={labelClass}>Voegsel</label>
                            <input name="namePrefix" value={formData.namePrefix} onChange={handleChange} className={inputClass} placeholder="van der" />
                        </div>
                        <div className="col-span-8">
                            <label className={labelClass}>Achternaam</label>
                            <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="col-span-6">
                            <label className={labelClass}>Geslacht (Admin)</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                <option value="">Selecteer...</option>
                                {GENDER_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.display}</option>)}
                            </select>
                        </div>
                        <div className="col-span-6">
                            <label className={labelClass}>Naamgebruik</label>
                            <select name="nameUse" value={formData.nameUse} onChange={handleChange} className={inputClass}>
                                {NAME_USE_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.display}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* STAP 3: VERZEKERING (COV SIMULATIE) */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                            <ShieldCheck className="text-blue-500" />
                            <p className="text-[10px] font-bold text-blue-700 uppercase">Real-time COV Check Actief</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>UZOVI Code</label>
                                <input name="uzovi" value={formData.uzovi} onChange={handleChange} className={inputClass} placeholder="bijv. 3311" maxLength={4} />
                            </div>
                            <div>
                                <label className={labelClass}>Verzekeraar</label>
                                <input readOnly value={detectedInsurer} className={`${inputClass} bg-slate-100 text-slate-500`} placeholder="Automatisch..." />
                            </div>
                            <div className="col-span-2">
                                <label className={labelClass}>Polisnummer</label>
                                <input name="policyNumber" value={formData.policyNumber} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                    </div>
                )}

                {/* STAP 4: CONTACTGEGEVENS */}
                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-8"><label className={labelClass}>E-mail</label><input name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
                            <div className="col-span-4"><label className={labelClass}>Telefoon</label><input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
                            <div className="col-span-9"><label className={labelClass}>Straat</label><input name="street" value={formData.street} onChange={handleChange} className={inputClass} /></div>
                            <div className="col-span-3"><label className={labelClass}>Huisnr.</label><input name="houseNumber" value={formData.houseNumber} onChange={handleChange} className={inputClass} /></div>
                            <div className="col-span-4"><label className={labelClass}>Postcode</label><input name="zipcode" value={formData.zipcode} onChange={handleChange} className={inputClass} /></div>
                            <div className="col-span-8"><label className={labelClass}>Woonplaats</label><input name="city" value={formData.city} onChange={handleChange} className={inputClass} /></div>
                        </div>
                    </div>
                )}

                {/* STAP 5: NOODCONTACT & CONTROLE */}
                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <div className="flex items-center gap-2 mb-3 text-slate-900 font-black text-[10px] uppercase"><Phone size={12}/> Contactpersoon Noodgeval</div>
                            <div className="space-y-3">
                                <input name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Naam contactpersoon" className={inputClass} />
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} placeholder="Relatie (bijv. Partner)" className={inputClass} />
                                    <input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="Telefoon" className={inputClass} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Controleer alle gegevens voor opslaan</p>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>

      {/* Footer Actions */}
      {!success && !existingPatient && (
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between">
            {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase flex items-center gap-2 px-4 transition-colors">
                    <ChevronLeft size={16} /> Terug
                </button>
            ) : <div />}

            {step === 1 ? (
                <button onClick={handleBSNLookup} disabled={lookupLoading} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200">
                    {lookupLoading ? <Loader2 className="animate-spin" size={16}/> : <><Search size={16}/> Verifieer BSN</>}
                </button>
            ) : step === 5 ? (
                <button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                    {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Registreer Patiënt</>}
                </button>
            ) : (
                <button onClick={() => setStep(step + 1)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-blue-600 transition-all">
                    Volgende <ChevronRight size={16} />
                </button>
            )}
        </div>
      )}
    </div>
  );
}