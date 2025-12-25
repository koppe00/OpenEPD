'use client';

import React from 'react';
import { AIAssistantCard } from './intelligence/AIAssistantCard';
import { SmartTemplateEditor } from './clinical/SmartTemplateEditor';
import { ActionRibbon } from './actions/ActionRibbon';
import { VitalsGrid } from './VitalsGrid';
import { Users, Clock, CheckCircle } from 'lucide-react';
import { ClinicalObservation } from '../../hooks/useClinicalData';
import { PatientQueueCard } from './hospital/PatientQueueCard';

interface Props {
  patientId: string;
  observations: ClinicalObservation[];
}

export const SpreekuurDashboard = ({ patientId, observations }: Props) => {
  // Map observations naar het timestamp formaat dat VitalsGrid verwacht
  const measurementsForVitals = React.useMemo(() => {
    return observations.map(obs => ({
      ...obs,
      timestamp: obs.effective_at
    }));
  }, [observations]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* BOVENSTE LAAG: AI Cockpit & Dagoverzicht */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* AIAssistantCard gebruikt nu de observations en de expliciete mode */}
          <AIAssistantCard observations={observations} mode="spreekuur" />
        </div>
        
        {/* Quick Stats / Wachtrij Summary */}
        <div className="lg:col-span-1">
          <PatientQueueCard />
        </div>
      </div>

      {/* MIDDELSTE LAAG: Het Consult (Vitals & Notities) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
             <VitalsGrid observations={measurementsForVitals} />
          </div>
          <ActionRibbon patientId={patientId} />
        </div>
        
        <div className="xl:col-span-7 h-full min-h-[600px]">
          {/* SmartTemplateEditor krijgt de mode mee voor SOAP/SBAR logica */}
          <SmartTemplateEditor mode="spreekuur" />
        </div>
      </div>
    </div>
  );
};