export const BedOverview = () => (
  <div className="grid grid-cols-4 gap-2 p-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-200">
        BED {301 + i}
      </div>
    ))}
  </div>
);
