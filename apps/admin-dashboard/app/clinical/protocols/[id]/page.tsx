'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Save, ArrowLeft, Trash2, Plus, 
  Zap, Stethoscope, Activity, Layers, ChevronRight
} from 'lucide-react';

// Importeer de centrale ZIB configuratie uit je lokale package
import { ZIB_CONFIG } from '@openepd/clinical-core';

interface ProtocolRule {
  id: string;
  protocol_id: string;
  logic_type: string;
  condition_json: {
    zib: string;
    operator: string;
    value: string;
  };
  alert_message: string;
}

interface ProtocolAction {
  id: string;
  label: string;
  action_type: string;
  action_payload: any;
  ui_color_class: string;
}

export default function ProtocolDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data State
  const [protocol, setProtocol] = useState<any>(null);
  const [rules, setRules] = useState<ProtocolRule[]>([]);
  const [actions, setActions] = useState<ProtocolAction[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: p } = await supabase.from('clinical_protocols').select('*').eq('id', params.id).single();
    const { data: r } = await supabase.from('protocol_rules').select('*').eq('protocol_id', params.id);
    const { data: a } = await supabase.from('protocol_actions').select('*').eq('protocol_id', params.id).order('sort_order');

    if (p) setProtocol(p);
    setRules(r || []);
    setActions(a || []);
    setLoading(false);
  }, [params.id, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers voor aanpassingen
  const updateRuleZib = (ruleId: string, zibId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId 
      ? { ...r, condition_json: { ...r.condition_json, zib: zibId } } 
      : r
    ));
  };

  const updateRuleValue = (ruleId: string, value: string) => {
    setRules(prev => prev.map(r => r.id === ruleId 
      ? { ...r, condition_json: { ...r.condition_json, value: value } } 
      : r
    ));
  };

  const updateRuleAlert = (ruleId: string, alert: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, alert_message: alert } : r));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update Protocol Metadata
      await supabase.from('clinical_protocols').update({
        title: protocol.title,
        specialty: protocol.specialty,
        description: protocol.description,
        is_active: protocol.is_active
      }).eq('id', params.id);

      // 2. Batch Update Rules (simpelste manier voor nu)
      for (const rule of rules) {
        await supabase.from('protocol_rules').update({
          condition_json: rule.condition_json,
          alert_message: rule.alert_message
        }).eq('id', rule.id);
      }

      // 3. Batch Update Actions
      for (const action of actions) {
        await supabase.from('protocol_actions').update({
          label: action.label,
          action_type: action.action_type
        }).eq('id', action.id);
      }

      alert("Configuratie succesvol opgeslagen.");
    } catch (err) {
      console.error(err);
      alert("Fout bij opslaan.");
    }
    setSaving(false);
  };

  const addRule = async () => {
    const { data } = await supabase.from('protocol_rules').insert({
      protocol_id: params.id,
      logic_type: 'AND',
      condition_json: { zib: '', operator: 'contains', value: '' },
      alert_message: 'Nieuwe alert melding...'
    }).select().single();
    if (data) setRules([...rules, data]);
  };

  const addAction = async () => {
    const { data } = await supabase.from('protocol_actions').insert({
      protocol_id: params.id,
      label: 'Nieuwe Actie',
      action_type: 'order_lab',
      action_payload: {},
      ui_color_class: 'bg-blue-50 text-blue-700'
    }).select().single();
    if (data) setActions([...actions, data]);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm("Zeker weten?")) return;
    await supabase.from(table).delete().eq('id', id);
    if (table === 'protocol_rules') setRules(rules.filter(r => r.id !== id));
    if (table === 'protocol_actions') setActions(actions.filter(a => a.id !== id));
  };

  if (loading) return <div className="p-12 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Systeem data ophalen...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 shadow-sm group">
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-900" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Protocol Editor</span>
               <ChevronRight size={12} className="text-slate-300" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{protocol.specialty}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{protocol.title}</h1>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/40 disabled:opacity-50"
        >
          {saving ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Verwerken...' : 'Protocol Publiceren'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LINKS: METADATA */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-400 border-b border-slate-50 pb-4">
              <Stethoscope size={18} /> <h3 className="text-xs font-black uppercase tracking-widest">Configuratie</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Protocol Naam</label>
                <input 
                  value={protocol.title}
                  onChange={e => setProtocol({...protocol, title: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Specialisme (Zorgdomein)</label>
                <select 
                  value={protocol.specialty}
                  onChange={e => setProtocol({...protocol, specialty: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="MDL">Maag-Darm-Lever (MDL)</option>
                  <option value="CARDIO">Cardiologie</option>
                  <option value="INTERNE">Interne Geneeskunde</option>
                  <option value="HUISARTS">Huisartsgeneeskunde</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                <span className="text-xs font-black uppercase text-slate-500">Status</span>
                <button 
                  onClick={() => setProtocol({...protocol, is_active: !protocol.is_active})}
                  className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${protocol.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${protocol.is_active ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RECHTS: REGELS & ACTIES */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* TRIGGERS */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 bg-amber-500 blur-[80px] opacity-5 pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-inner"><Activity size={24} /></div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Activeer wanneer...</h3>
                  <p className="text-xs text-slate-400 font-medium">Koppel medische condities (ZIB 2024)</p>
                </div>
              </div>
              <button onClick={addRule} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all">
                + Voeg Trigger toe
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              {rules.map((rule) => (
                <div key={rule.id} className="flex gap-4 items-end bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">Selecteer ZIB</label>
                       <select 
                         className="w-full text-xs font-black bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                         value={rule.condition_json.zib}
                         onChange={(e) => updateRuleZib(rule.id, e.target.value)}
                       >
                         <option value="">Kies ZIB...</option>
                         {Object.entries(ZIB_CONFIG).map(([key, config]) => (
                           <option key={key} value={key}>
                             {key} ({(config as any).name})
                           </option>
                         ))}
                       </select>
                    </div>
                    <div>
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">Match op Waarde</label>
                       <input 
                         className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={rule.condition_json.value}
                         onChange={(e) => updateRuleValue(rule.id, e.target.value)}
                         placeholder="bv. Coeliakie"
                       />
                    </div>
                    <div>
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">Alert in Dossier</label>
                       <input 
                         className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl p-3 text-amber-600 focus:ring-2 focus:ring-amber-500 outline-none" 
                         value={rule.alert_message}
                         onChange={(e) => updateRuleAlert(rule.id, e.target.value)}
                         placeholder="bv. Check jaarcontrole!"
                       />
                    </div>
                  </div>
                  <button onClick={() => deleteItem('protocol_rules', rule.id)} className="p-3 text-slate-200 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 bg-blue-500 blur-[80px] opacity-5 pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-inner"><Zap size={24} /></div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Verschijnende Acties</h3>
                  <p className="text-xs text-slate-400 font-medium">Knoppen in de Action Widget van de arts</p>
                </div>
              </div>
              <button onClick={addAction} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all">
                + Voeg Knop toe
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              {actions.map((action) => (
                <div key={action.id} className="flex items-center gap-6 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                   <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:text-blue-500 transition-colors"><Layers size={18} /></div>
                   <div className="flex-1">
                      <input 
                        className="font-black text-slate-800 bg-transparent focus:bg-slate-50 p-2 rounded-xl w-full outline-none" 
                        value={action.label} 
                        onChange={(e) => {
                          setActions(prev => prev.map(a => a.id === action.id ? {...a, label: e.target.value} : a));
                        }}
                      />
                   </div>
                   <select 
                    className="text-[10px] font-black uppercase tracking-wider bg-slate-100 border-none rounded-lg px-3 py-2 text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={action.action_type}
                    onChange={(e) => {
                      setActions(prev => prev.map(a => a.id === action.id ? {...a, action_type: e.target.value} : a));
                    }}
                   >
                     <option value="order_lab">Lab Aanvraag</option>
                     <option value="order_medication">Medicatie</option>
                     <option value="navigate">Navigatie</option>
                   </select>
                   <button onClick={() => deleteItem('protocol_actions', action.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}