'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';

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
  careSetting: 'polyclinic' | 'clinical' | 'admin';
  specialtyCode: string;
}

export function useDashboardLayout({ careSetting, specialtyCode }: UseDashboardLayoutProps) {
  const [loading, setLoading] = useState(true);
  
  const [leftWidgets, setLeftWidgets] = useState<DashboardWidget[]>([]);
  const [mainWidgets, setMainWidgets] = useState<DashboardWidget[]>([]);
  const [rightWidgets, setRightWidgets] = useState<DashboardWidget[]>([]);
  
  const [availableTemplates, setAvailableTemplates] = useState<{id: string, name: string}[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string>('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Haal beschikbare templates op (Ongewijzigd)
  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      const { data: context } = await supabase
        .from('ui_contexts')
        .select('id')
        .eq('care_setting', careSetting)
        .eq('specialty_code', specialtyCode)
        .single();

      if (context) {
        const { data: templates } = await supabase
          .from('ui_templates')
          .select('id, name')
          .eq('context_id', context.id)
          .eq('is_active', true)
          .order('name');

        if (templates && templates.length > 0) {
          setAvailableTemplates(templates);
          setActiveTemplateId(prev => {
            const exists = templates.find(t => t.id === prev);
            return exists ? prev : templates[0].id;
          });
        } else {
          setAvailableTemplates([]);
          setActiveTemplateId(null);
        }
      }
      setLoading(false);
    }
    fetchTemplates();
  }, [careSetting, specialtyCode, supabase]);

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
        
        // Console check om te zien of je data nu binnenkomt
        console.log("🔥 Live Architecture Data:", processedWidgets);

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