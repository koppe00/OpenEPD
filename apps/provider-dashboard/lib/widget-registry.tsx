import dynamic from 'next/dynamic';
import React from 'react';
import { ClinicalObservation } from '../hooks/useClinicalData';
import { WorkflowMode } from '@openepd/clinical-core';

export interface WidgetProps {
  observations: ClinicalObservation[];
  mode: WorkflowMode;
  embedded?: boolean;
  patientId?: string;
}

/**
 * WidgetRegistry
 * Record<string, any> lost de React 19 / ComponentType mismatch op.
 */
export const WidgetRegistry: Record<string, any> = {
  // Bestaande widgets
  VitalsWidget: dynamic(() => import('../components/dashboard/widgets/ClinicalWidgets').then(mod => mod.VitalsWidget)),
  ResultsWidget: dynamic(() => import('../components/dashboard/widgets/ClinicalWidgets').then(mod => mod.ResultsWidget)),
  ActionWidget: dynamic(() => import('../components/dashboard/widgets/ClinicalWidgets').then(mod => mod.ActionWidget)),
  
  // Intelligence modules
  AIAssistantCard: dynamic(() => import('../components/dashboard/intelligence/AIAssistantCard').then(mod => mod.AIAssistantCard)),
  GuidelineCheck: dynamic(() => import('../components/dashboard/intelligence/GuidelineCheck').then(mod => mod.GuidelineCheck)),
  ConsentStatus: dynamic(() => import('../components/dashboard/intelligence/ConsentStatus').then(mod => mod.ConsentStatus)),
  
  // Clinical tools
  SmartTemplateEditor: dynamic(() => import('../components/dashboard/clinical/SmartTemplateEditor').then(mod => mod.SmartTemplateEditor)),
  NoteEditor: dynamic(() => import('../components/dashboard/clinical/NoteEditor').then(mod => mod.NoteEditor)),
};