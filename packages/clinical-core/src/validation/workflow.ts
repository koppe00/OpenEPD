// Groep: Workflow Architectuur - Nictiz 2024 Context-aware
import type { WorkflowMode } from '../types/work-context';

export interface WorkflowContext {
  mode: WorkflowMode;
  role: 'arts' | 'verpleegkundige' | 'specialist';
  priorityFocus: 'chronisch' | 'acuut' | 'logistiek';
}

export const WORKFLOW_THEMES: Record<WorkflowMode, { 
  primary: string; 
  secondary: string; 
  accent: string;
  label: string;
}> = {
  spreekuur: { 
    primary: 'bg-blue-600', 
    secondary: 'text-blue-600', 
    accent: 'bg-blue-50',
    label: 'Polikliniek'
  },
  kliniek: { 
    primary: 'bg-emerald-600', 
    secondary: 'text-emerald-600', 
    accent: 'bg-emerald-50',
    label: 'Klinische Dienst'
  },
  spoed: { 
    primary: 'bg-rose-600', 
    secondary: 'text-rose-600', 
    accent: 'bg-rose-50',
    label: 'Spoedeisende Hulp'
  },
  afdeling: { 
    primary: 'bg-purple-600', 
    secondary: 'text-purple-600', 
    accent: 'bg-purple-50',
    label: 'Afdelingsmanagement'
  }
};