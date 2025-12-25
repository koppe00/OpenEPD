import dynamic from 'next/dynamic';
import React from 'react';
import { ClinicalObservation } from '../hooks/useClinicalData';
import { WorkflowMode } from '@openepd/clinical-core';

export interface WidgetProps {
  observations: ClinicalObservation[];
  mode: WorkflowMode;
  embedded?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const WidgetRegistry: Record<string, React.ComponentType<any>> = {
  VitalsWidget: dynamic(() => import('../components/dashboard/widgets/ClinicalWidgets').then(mod => mod.VitalsWidget)) as React.ComponentType<any>,
  ResultsWidget: dynamic(() => import('../components/dashboard/widgets/ClinicalWidgets').then(mod => mod.ResultsWidget)) as React.ComponentType<any>,
  ActionWidget: dynamic(() => import('../components/dashboard/widgets/ClinicalWidgets').then(mod => mod.ActionWidget)) as React.ComponentType<any>,
  AIAssistantCard: dynamic(() => import('../components/dashboard/intelligence/AIAssistantCard').then(mod => mod.AIAssistantCard)) as React.ComponentType<any>,
  SmartTemplateEditor: dynamic(() => import('../components/dashboard/clinical/SmartTemplateEditor').then(mod => mod.SmartTemplateEditor)) as React.ComponentType<any>,
};