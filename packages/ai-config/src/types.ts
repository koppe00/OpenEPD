/**
 * AI Configuration System - Architecture Design
 * 
 * This system provides a hierarchical, context-aware configuration framework
 * for AI features across the OpenEPD platform.
 * 
 * HIERARCHY (Priority Order - First match wins):
 * 1. User-specific configuration
 * 2. Group/Team configuration  
 * 3. Role-based configuration
 * 4. Specialisme-specific configuration
 * 5. Werkcontext configuration (e.g., "polikliniek", "huisarts", "SEH")
 * 6. Organization-wide configuration
 * 7. Global system defaults
 * 
 * ARCHITECTURE LAYERS:
 * 
 * Layer 1: Database Schema (Supabase)
 * - ai_feature_configs: Feature definitions and metadata
 * - ai_config_assignments: Context-based configuration assignments
 * - ai_config_scopes: Hierarchical scope definitions
 * 
 * Layer 2: API Layer (Next.js API Routes)
 * - /api/ai-config/features: CRUD for AI features
 * - /api/ai-config/assignments: Manage config assignments
 * - /api/ai-config/resolve: Resolve active config for current context
 * 
 * Layer 3: Service Layer (@openepd/ai-config package)
 * - AIConfigResolver: Context-aware configuration resolution
 * - AIFeatureRegistry: Feature registration and validation
 * - AIConfigValidator: Validate configurations against schemas
 * 
 * Layer 4: Admin UI (admin-dashboard)
 * - /system/ai-governance: Main AI configuration hub
 *   - /features: Manage AI features (ZIB extraction, summarization, etc.)
 *   - /assignments: Assign configs to users/groups/roles
 *   - /templates: Pre-built configuration templates
 *   - /analytics: Usage and performance metrics
 * 
 * Layer 5: Consumer Applications (provider-dashboard, etc.)
 * - useAIConfig() hook: Access resolved configuration
 * - <AIConfigProvider>: Context provider for AI config
 * 
 * FEATURES EXAMPLES:
 * - zib_extraction: Smart ZIB extraction with custom ZIB sets
 * - clinical_summarization: Generate clinical summaries
 * - differential_diagnosis: AI-powered DD suggestions
 * - medication_interaction: Check drug interactions
 * - coding_assistant: ICD10/ICPC code suggestions
 * 
 * CONFIGURATION SCHEMA:
 * Each feature has a JSON schema defining valid configuration:
 * {
 *   feature_id: "zib_extraction",
 *   config: {
 *     enabled_zibs: ["nl.zorg.Bloeddruk", ...],
 *     custom_prompt: "...",
 *     model: "gemini-2.5-flash",
 *     temperature: 0.3,
 *     max_tokens: 4000
 *   }
 * }
 * 
 * SCOPE SYNTAX:
 * - user:{user_id}
 * - group:{group_id}
 * - role:{role_name}
 * - specialisme:{specialisme_name}
 * - werkcontext:{context_name}
 * - organization:{org_id}
 * - global
 */

export type AIFeatureType = 
  | 'zib_extraction'
  | 'clinical_summarization'
  | 'differential_diagnosis'
  | 'medication_interaction'
  | 'coding_assistant'
  | 'triage_support'
  | 'lab_interpretation';

export type ScopeType =
  | 'user'
  | 'group'
  | 'role'
  | 'specialisme'
  | 'werkcontext'
  | 'organization'
  | 'global';

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  feature_type: AIFeatureType;
  config_schema: Record<string, any>; // JSON Schema for validation
  default_config: Record<string, any>;
  is_active: boolean;
  requires_license?: string[];
  metadata?: Record<string, any>;
}

export interface AIConfigAssignment {
  id: string;
  feature_id: string;
  scope_type: ScopeType;
  scope_value: string; // e.g., user_id, role_name, etc.
  config: Record<string, any>;
  priority: number; // Lower = higher priority
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
}

export interface AIConfigContext {
  user_id?: string;
  group_ids?: string[];
  role?: string;
  specialisme?: string;
  werkcontext?: string;
  organization_id?: string;
}

export interface ResolvedAIConfig {
  feature_id: string;
  config: Record<string, any>;
  source: {
    scope_type: ScopeType;
    scope_value: string;
    assignment_id: string;
  };
  resolved_at: string;
}
