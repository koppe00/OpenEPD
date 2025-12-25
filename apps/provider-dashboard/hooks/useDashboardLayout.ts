'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export interface DashboardWidget {
  instance_id: string;
  widget_name: string;
  component_key: string;
  engine_type: string;
  region: 'left_sidebar' | 'main_content' | 'right_sidebar';
  sort_order: number;
  configuration: Record<string, unknown>; // JSONB config
  display_title: string;
}

interface UseDashboardLayoutProps {
  careSetting: 'polyclinic' | 'clinical' | 'admin';
  specialtyCode: string;
}

export function useDashboardLayout({ careSetting, specialtyCode }: UseDashboardLayoutProps) {
  const [loading, setLoading] = useState(true);
  
  // Widget lijsten per regio
  const [leftWidgets, setLeftWidgets] = useState<DashboardWidget[]>([]);
  const [mainWidgets, setMainWidgets] = useState<DashboardWidget[]>([]);
  const [rightWidgets, setRightWidgets] = useState<DashboardWidget[]>([]);
  
  // Template beheer
  const [availableTemplates, setAvailableTemplates] = useState<{id: string, name: string}[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string>('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Haal beschikbare templates op
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
                // Selecteer standaard de eerste als er nog geen actieve is
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

  // 2. Haal widgets op als de template wijzigt
  useEffect(() => {
    async function fetchWidgets() {
        // FIX: Reset logic binnen de async functie om 'sync state update' errors te voorkomen
        if (!activeTemplateId) {
            setLeftWidgets([]);
            setMainWidgets([]);
            setRightWidgets([]);
            setTemplateName('');
            setLoading(false); // Zorg dat loading ook false wordt
            return;
        }

        setLoading(true);

        const current = availableTemplates.find(t => t.id === activeTemplateId);
        if (current) setTemplateName(current.name);

        const { data, error } = await supabase.rpc('get_resolved_widgets', {
            p_template_id: activeTemplateId
        });

        if (error) {
            console.error('Error fetching layout:', error);
        } else if (data) {
            const widgets = data as DashboardWidget[]; // FIX: eslint disable niet nodig hier
            
            setLeftWidgets(widgets.filter(w => w.region === 'left_sidebar').sort((a, b) => a.sort_order - b.sort_order));
            setMainWidgets(widgets.filter(w => w.region === 'main_content').sort((a, b) => a.sort_order - b.sort_order));
            setRightWidgets(widgets.filter(w => w.region === 'right_sidebar').sort((a, b) => a.sort_order - b.sort_order));
        }
        setLoading(false);
    }

    fetchWidgets();
  }, [activeTemplateId, availableTemplates, supabase]);

  return { 
    leftWidgets, 
    mainWidgets, 
    rightWidgets, 
    loading, 
    templateName,
    availableTemplates,
    activeTemplateId,
    switchTemplate: setActiveTemplateId 
  };
}