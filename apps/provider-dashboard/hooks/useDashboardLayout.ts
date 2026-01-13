'use client';

import { useEffect, useState, useMemo } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

// Interfaces
export interface WidgetSection {
  id: string;
  section_key: string;
  label: string;
  zib_mapping: string;
  ui_control_type: 'text_area' | 'measurement_group' | 'checklist' | string; // <--- Toestaan van specifieke én algemene strings
  sort_order: number;
  placeholder?: string;
  selected_fields?: any; 
}

export interface DashboardWidget {
  id: string;
  template_id: string;
  region: 'left_sidebar' | 'main_content' | 'right_sidebar';
  sort_order: number;
  display_title: string;
  configuration: any;
  engine_type?:string;
  definition?: {
    id: string;
    name: string;
    component_key: string;
    engine_type: string;     
    default_icon?: string;
    // Hier komen de live secties binnen
    sections?: WidgetSection[]; 
  };
}

interface UseDashboardLayoutProps {
  workContextId: string; // NEW: Direct work_context_id from active context
  specialtyId?: string | null; // Optional specialty filter
  userId: string; // Required for permission checking
  // DEPRECATED: Legacy props for backwards compatibility
  careSetting?: 'polyclinic' | 'clinical' | 'admin';
  specialtyCode?: string;
}

export function useDashboardLayout({ 
  workContextId, 
  specialtyId, 
  userId,
  // Legacy fallback
  careSetting,
  specialtyCode 
}: UseDashboardLayoutProps) {
  const [loading, setLoading] = useState(true);
  
  const [leftWidgets, setLeftWidgets] = useState<DashboardWidget[]>([]);
  const [mainWidgets, setMainWidgets] = useState<DashboardWidget[]>([]);
  const [rightWidgets, setRightWidgets] = useState<DashboardWidget[]>([]);
  
  const [availableTemplates, setAvailableTemplates] = useState<{id: string, name: string}[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string>('');

  const supabase = getSupabaseBrowserClient();

  // 1. Fetch available templates - FILTERED BY WORK CONTEXT (NEW ARCHITECTURE)
  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      
      // NEW: Use get_user_templates() function for unified filtering
      const { data: userTemplates, error } = await supabase
        .rpc('get_user_templates', { p_user_id: userId });

      if (error) {
        console.error('Error fetching user templates:', error);
        setAvailableTemplates([]);
        setActiveTemplateId(null);
        setLoading(false);
        return;
      }

      if (userTemplates && userTemplates.length > 0) {
        // Map to simpler format
        const templates = userTemplates.map((t: any) => ({
          id: t.template_id,
          name: t.template_name,
        }));
        
        setAvailableTemplates(templates);
        setActiveTemplateId(prev => {
          const exists = templates.find((t: any) => t.id === prev);
          return exists ? prev : templates[0].id;
        });
      } else {
        setAvailableTemplates([]);
        setActiveTemplateId(null);
      }
      
      setLoading(false);
    }
    
    if (userId && workContextId) {
      fetchTemplates();
    }
  }, [workContextId, specialtyId, userId, supabase]);

  // 2. Haal widgets op (AANGEPAST: DEEP SELECT)
  useEffect(() => {
    async function fetchWidgets() {
      if (!activeTemplateId) {
        setLeftWidgets([]);
        setMainWidgets([]);
        setRightWidgets([]);
        setTemplateName('');
        setLoading(false);
        return;
      }

      setLoading(true);

      const current = availableTemplates.find(t => t.id === activeTemplateId);
      if (current) setTemplateName(current.name);

      // --- DE FIX: Deep Join Query ---
      // We halen instances op -> joinen definition -> joinen sections
      const { data, error } = await supabase
        .from('ui_widget_instances')
        .select(`
          *,
          definition:widget_definitions (
            id,
            name,
            component_key,
            engine_type,
            default_icon,
            sections:widget_sections (
                id,
                section_key,
                label,
                zib_mapping,
                ui_control_type,
                sort_order,
                selected_fields
            )
          )
        `)
        .eq('template_id', activeTemplateId)
        .order('sort_order');

      if (error) {
        console.error('Error fetching layout:', error);
      } else if (data) {
        // Post-processing: Zorg dat de geneste secties ook gesorteerd zijn
        // (SQL nested ordering is soms tricky, JS sort is betrouwbaarder hier)
        const processedWidgets = (data as DashboardWidget[]).map(w => {
            if (w.definition?.sections) {
                // Sorteer de secties op sort_order
                w.definition.sections.sort((a, b) => a.sort_order - b.sort_order);
            }
            return w;
        });

        // Verdeel over de kolommen
        setLeftWidgets(processedWidgets.filter(w => w.region === 'left_sidebar'));
        setMainWidgets(processedWidgets.filter(w => w.region === 'main_content'));
        setRightWidgets(processedWidgets.filter(w => w.region === 'right_sidebar'));
      }
      setLoading(false);
    }

    fetchWidgets();
  }, [activeTemplateId, availableTemplates, supabase]);

  // activeLayout voor density (Ongewijzigd)
  const activeLayout = useMemo(() => {
    if (!activeTemplateId) return null;
    return availableTemplates.find(t => t.id === activeTemplateId) || null;
  }, [activeTemplateId, availableTemplates]);

  return { 
    leftWidgets, 
    mainWidgets, 
    rightWidgets, 
    loading, 
    templateName,
    availableTemplates,
    activeTemplateId,
    switchTemplate: setActiveTemplateId,
    activeLayout
  };
}