'use client';

import React, { useState, useEffect } from 'react';
import { XCircle, User, Shield, MapPin, Save, Fingerprint, Mail, Key } from 'lucide-react';

export function UserModal({ isOpen, onClose, onSave, selectedUser, organizations, roles, mode }: any) {
  const [authMethod, setAuthMethod] = useState<'invite' | 'manual'>('invite');
  const [tempPassword, setTempPassword] = useState('');
  const [activeTab, setActiveTab] = useState('basis');
  
  const [formData, setFormData] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    app_role: 'md_specialist',
    is_patient: false,
    bsn_number: '',
    uzi_number: '',
    big_registration_number: '',
    specialty: '',
    address_street: '',
    address_house_number: '',
    address_zipcode: '',
    address_city: '',
    organization_id: ''
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({ ...selectedUser });
      // Bij editen resetten we de auth methodes, want die zijn alleen voor create
      setAuthMethod('invite');
      setTempPassword('');
    } else {
      setFormData({ 
      first_name: '', 
      last_name: '', 
      email: '', 
      app_role: mode === 'admin' ? 'admin' : 'md_specialist', // Zet standaard rol
      is_patient: false
      });
    }
  }, [selectedUser, isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'basis', label: 'Basis Info', icon: User },
    { id: 'prof', label: 'Professioneel', icon: Shield },
    // Alleen tonen als het geen beheerder is
  ...(mode !== 'admin' ? [{ id: 'prof', label: 'Professioneel', icon: Shield }] : []),
      { id: 'adres', label: 'Adres & Contact', icon: MapPin },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // We sturen twee objecten terug: de profielgegevens en de auth-instellingen
    onSave(formData, {
      authMethod,
      tempPassword
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {selectedUser ? 'Profiel Bewerken' : 'Nieuwe Registratie'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Beheer dossiergegevens en toegangsrechten
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
            <XCircle size={28} />
          </button>
        </div>

        {/* Tab Navigatie */}
        <div className="flex px-8 pt-4 gap-4 bg-slate-50/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-white border-x border-t border-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body - Let op: Eén enkel formulier element */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
          
          {activeTab === 'basis' && (
            <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Voornaam</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.first_name || ''} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Achternaam</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.last_name || ''} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">E-mailadres</label>
                <input type="email" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Systeemrol</label>
                <select 
                    disabled={mode === 'admin'} // Disable als het een beheeraccount is
                    className={`w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none ${mode === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData.app_role} 
                    onChange={e => setFormData({...formData, app_role: e.target.value})}
                >
                    {roles.map((r: any) => <option key={r.role_key} value={r.role_key}>{r.display_name}</option>)}
                </select>
                </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Organisatie</label>
                <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none" value={formData.organization_id} onChange={e => setFormData({...formData, organization_id: e.target.value})}>
                  <option value="">Selecteer instelling...</option>
                  {organizations.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>

              {/* ACCOUNT ACTIVATIE SECTIE (Alleen voor nieuwe gebruikers) */}
              {!selectedUser && (
                <div className="col-span-2 mt-4 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-blue-600" />
                    <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Account Activatie Methode</label>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setAuthMethod('invite')}
                      className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${authMethod === 'invite' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-400 border border-slate-100'}`}
                    >
                      <Mail size={14} /> Stuur Uitnodiging
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAuthMethod('manual')}
                      className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${authMethod === 'manual' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-400 border border-slate-100'}`}
                    >
                      <Key size={14} /> Handmatig Wachtwoord
                    </button>
                  </div>
                  
                  {authMethod === 'manual' && (
                    <div className="animate-in slide-in-from-top-2">
                      <input 
                        type="password"
                        placeholder="Voer tijdelijk wachtwoord in..."
                        className="w-full px-6 py-4 bg-white rounded-2xl border border-blue-100 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        required={authMethod === 'manual'}
                      />
                      <p className="text-[10px] text-slate-400 mt-2 ml-4">
                        * De gebruiker moet dit wachtwoord wijzigen na de eerste keer inloggen.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'prof' && (
            <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2"><Fingerprint size={10}/> BSN Nummer</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm" value={formData.bsn_number || ''} onChange={e => setFormData({...formData, bsn_number: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">UZI Nummer</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm" value={formData.uzi_number || ''} onChange={e => setFormData({...formData, uzi_number: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">BIG Registratie</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm" value={formData.big_registration_number || ''} onChange={e => setFormData({...formData, big_registration_number: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Specialisme</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="Bijv. Cardiologie" />
              </div>
            </div>
          )}

          {activeTab === 'adres' && (
            <div className="grid grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Straatnaam</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.address_street || ''} onChange={e => setFormData({...formData, address_street: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Huisnr.</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.address_house_number || ''} onChange={e => setFormData({...formData, address_house_number: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Postcode</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.address_zipcode || ''} onChange={e => setFormData({...formData, address_zipcode: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Woonplaats</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm" value={formData.address_city || ''} onChange={e => setFormData({...formData, address_city: e.target.value})} />
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
            <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10">
              <Save size={18} /> {selectedUser ? 'Wijzigingen Opslaan' : 'Gebruiker Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}