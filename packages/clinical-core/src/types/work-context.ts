// Work Context Types - Single Source of Truth
// Replaces: WorkflowMode enum, ui_contexts.care_setting

export interface WorkContext {
  id: string;
  code: string;
  display_name: string;
  context_type: 'location' | 'shift' | 'admin';
  theme_config: WorkContextTheme;
  icon_name: string;
  care_setting_legacy: string | null;
  requires_patient: boolean;
  config_metadata: Record<string, any>;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkContextTheme {
  primary: string;
  secondary: string;
  accent: string;
}

// Enriched template type with work_context details
export interface UITemplateEnriched {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  work_context_id: string;
  specialty_id: string | null;
  allowed_roles: string[] | null;
  allowed_specialisms: string[] | null;
  allowed_organizations: string[] | null;
  allowed_groups: string[] | null;
  allowed_work_contexts: string[] | null;
  require_all_contexts: boolean;
  created_at: string;
  updated_at: string;
  // Enriched fields
  work_context_code: string;
  work_context_name: string;
  theme_config: WorkContextTheme;
  icon_name: string;
  requires_patient: boolean;
  specialty_code: string | null;
  specialty_name: string | null;
  specialty_short: string | null;
}

// User template result from get_user_templates()
export interface UserTemplate {
  template_id: string;
  template_name: string;
  template_description: string | null;
  work_context_code: string;
  work_context_name: string;
  theme_config: WorkContextTheme;
  icon_name: string;
  specialty_code: string | null;
  specialty_name: string | null;
}

// Active context state
export interface UserActiveContext {
  user_id: string;
  active_role_id: string | null;
  active_specialism_id: string | null;
  active_organization_id: string | null;
  active_group_id: string | null;
  active_work_context_id: string | null;
  updated_at: string;
}

// Context switcher props
export interface WorkContextSwitcherProps {
  userId: string;
  currentContext: WorkContext | null;
  availableContexts: WorkContext[];
  onContextChange: (contextId: string) => void;
}

// DEPRECATED: Legacy types for backwards compatibility
// @deprecated Use WorkContext instead
export type WorkflowMode = 'spreekuur' | 'kliniek' | 'spoed' | 'afdeling';

// @deprecated Use work_context_code instead
export type CareSetting = 'polyclinic' | 'clinical' | 'emergency' | 'admin';

// Helper function to map legacy WorkflowMode to work_context_code
export function mapWorkflowModeToContextCode(mode: WorkflowMode): string {
  const mapping: Record<WorkflowMode, string> = {
    spreekuur: 'POLI',
    kliniek: 'KLINIEK',
    spoed: 'SEH',
    afdeling: 'KLINIEK', // Legacy fallback
  };
  return mapping[mode];
}

// Helper function to map legacy CareSetting to work_context_code
export function mapCareSettingToContextCode(setting: CareSetting): string {
  const mapping: Record<CareSetting, string> = {
    polyclinic: 'POLI',
    clinical: 'KLINIEK',
    emergency: 'SEH',
    admin: 'ADMIN',
  };
  return mapping[setting];
}
