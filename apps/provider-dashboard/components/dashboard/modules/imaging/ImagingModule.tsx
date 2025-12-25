import { ImageIcon, Maximize2, ZoomIn, Layers, Activity, ShieldCheck, Download } from 'lucide-react';

export const ImagingModule = () => {
  const studies = [
    { id: 1, type: 'X-Thorax', date: '19-12-2025', status: 'AI Verified', description: 'Longen en cor.' },
    { id: 2, type: 'CT Abdomen', date: '15-11-2025', status: 'Geen afwijkingen', description: 'Controle na OK.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black tracking-tighter uppercase italic">Beeldvorming & PACS</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Geselecteerde bron: Radiologie Cluster Zuid</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all">
            <Download size={14} /> DICOM Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* De Viewer Zone */}
        <div className="col-span-8 space-y-4">
          <div className="relative aspect-[4/3] bg-black rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl group">
            {/* Gesimuleerde X-Thorax met AI Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
               <ImageIcon size={120} className="text-slate-800" />
            </div>
            
            {/* AI Annotatie Overlay */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-rose-500 rounded-full bg-rose-500/10 flex items-center justify-center animate-pulse">
               <span className="absolute -top-6 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase">AI: Infiltraat?</span>
            </div>

            {/* Viewer Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-3 text-white hover:bg-white/10 rounded-xl transition-all"><ZoomIn size={18}/></button>
              <button className="p-3 text-white hover:bg-white/10 rounded-xl transition-all"><Layers size={18}/></button>
              <button className="p-3 text-white hover:bg-white/10 rounded-xl transition-all"><Maximize2 size={18}/></button>
            </div>

            <div className="absolute top-6 right-8 text-right">
              <p className="text-[10px] font-mono text-emerald-400">LATERAL VIEW</p>
              <p className="text-[10px] font-mono text-slate-500">WINDOW: LUNG</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Radioloog Rapport</h4>
             <p className="text-xs leading-relaxed font-bold italic text-slate-600">
               "Geen aanwijzingen voor pneumothorax. Lichte sluiering in de rechter onderkwab, mogelijk passend bij beginnend infiltraat. Cor niet vergroot."
             </p>
          </div>
        </div>

        {/* Study List Sidebar */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 italic italic">Historische Studies</h4>
            <div className="space-y-3">
              {studies.map((study) => (
                <button key={study.id} className="w-full text-left p-4 rounded-2xl border border-slate-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase text-slate-900">{study.type}</span>
                    <span className="text-[8px] font-bold text-slate-400">{study.date}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">{study.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">{study.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-rose-900 text-white p-8 rounded-[2.5rem] shadow-xl">
             <div className="flex items-center gap-3 text-rose-300 mb-4">
               <Activity size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">AI Detection Hub</span>
             </div>
             <p className="text-xs font-bold leading-tight">AI heeft 1 mogelijke afwijking gevonden in de huidige studie. Beoordeling door radioloog noodzakelijk.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
