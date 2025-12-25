// apps/patient-portal/components/ZibBloodPressureCard.tsx

import { Activity, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ZibBloodPressureContent {
  component?: Array<{
    code?: {
      coding?: Array<{ code?: string }>;
    };
    valueQuantity?: {
      value?: number;
    };
  }>;
}

interface ZibBloodPressureProps {
  zib: {
    id: string;
    content: ZibBloodPressureContent;
    recorded_at: string;
    storage_status: string;
  };
}

export function ZibBloodPressureCard({ zib }: ZibBloodPressureProps) {
  // Parse systolic (LOINC 8480-6) en diastolic (LOINC 8462-4)
  const parseBloodPressure = () => {
    const systolicComp = zib.content.component?.find(
      (c) => c.code?.coding?.[0]?.code === '8480-6'
    );
    const diastolicComp = zib.content.component?.find(
      (c) => c.code?.coding?.[0]?.code === '8462-4'
    );

    return {
      systolic: systolicComp?.valueQuantity?.value ?? null,
      diastolic: diastolicComp?.valueQuantity?.value ?? null,
    };
  };

  const bp = parseBloodPressure();
  const isHigh = bp.systolic !== null && (bp.systolic > 140 || (bp.diastolic ?? 0) > 90);

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between group relative overflow-hidden transition-all hover:scale-[1.01]">
      {/* Sync Badge */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${
            zib.storage_status === 'synced'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
              : zib.storage_status === 'local_vault_only'
              ? 'bg-blue-50 border-blue-100 text-blue-600'
              : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}
        >
          {zib.storage_status === 'synced' || zib.storage_status === 'local_vault_only' ? (
            <Shield size={10} />
          ) : (
            <Activity size={10} />
          )}
          <span className="text-[9px] font-black uppercase tracking-widest">
            {zib.storage_status === 'synced'
              ? 'Vault Secured'
              : zib.storage_status === 'local_vault_only'
              ? 'Local Only'
              : 'Syncing...'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div
          className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center ${
            isHigh ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
          }`}
        >
          <Activity size={28} />
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-5xl font-black tracking-tighter">
              {bp.systolic ?? '-'}
            </span>
            <span className="text-3xl text-slate-200 font-extralight">/</span>
            <span className="text-5xl font-black tracking-tighter">
              {bp.diastolic ?? '-'}
            </span>
            <span className="text-[11px] font-black text-slate-300 ml-4 uppercase tracking-[0.2em]">
              mmHg
            </span>
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
            {format(new Date(zib.recorded_at), 'PPP', { locale: nl })} • Node: local-vault-01
          </p>
        </div>
      </div>
    </div>
  );
}