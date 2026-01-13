'use client';

import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useWorkContexts } from '@/hooks/useWorkContexts';
import type { WorkContext } from '@openepd/clinical-core';

interface UnifiedContextNavigatorProps {
  userId: string;
  onContextChange?: (context: WorkContext) => void;
  className?: string;
  switchContextOverride?: (contextId: string) => Promise<void>;
  activeContextOverride?: WorkContext | null;
}

/**
 * Unified Context Navigator
 * Replaces both WorkflowNavigator and ContextSwitcher
 * Uses work_contexts table as single source of truth
 */
export function UnifiedContextNavigator({ 
  userId, 
  onContextChange,
  className = '',
  switchContextOverride,
  activeContextOverride
}: UnifiedContextNavigatorProps) {
  const { 
    workContexts, 
    activeContext: internalActiveContext, 
    isLoading, 
    error,
    switchContext: internalSwitch
  } = useWorkContexts(userId);
  
  // Use external values if provided, otherwise use internal
  const switchContext = switchContextOverride || internalSwitch;
  const activeContext = activeContextOverride !== undefined ? activeContextOverride : internalActiveContext;

  const [isOpen, setIsOpen] = React.useState(false);

  const handleContextSwitch = async (contextId: string) => {
    try {
      await switchContext(contextId);
      const newContext = workContexts.find(c => c.id === contextId);
      if (newContext && onContextChange) {
        onContextChange(newContext);
      }
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to switch context:', err);
    }
  };

  // Get icon component dynamically
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Building2;
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
        <span className="text-sm">Fout bij laden van contexten</span>
      </div>
    );
  }

  if (isLoading || !activeContext) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Laden...</span>
      </div>
    );
  }

  const ActiveIcon = getIcon(activeContext.icon_name);
  const themeStyles = {
    '--context-primary': activeContext.theme_config.primary,
    '--context-secondary': activeContext.theme_config.secondary,
    '--context-accent': activeContext.theme_config.accent,
  } as React.CSSProperties;

  return (
    <div className={`relative ${className}`} style={themeStyles}>
      {/* Active Context Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md w-full"
        style={{
          backgroundColor: activeContext.theme_config.secondary,
          borderLeft: `4px solid ${activeContext.theme_config.primary}`,
        }}
      >
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: activeContext.theme_config.primary }}
        >
          <ActiveIcon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 text-left">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Werkcontext</div>
          <div 
            className="text-sm font-semibold"
            style={{ color: activeContext.theme_config.primary }}
          >
            {activeContext.display_name}
          </div>
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: activeContext.theme_config.primary }}
        />
      </button>

      {/* Context Menu Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                Beschikbare Contexten
              </div>
              
              {workContexts.map((context) => {
                const Icon = getIcon(context.icon_name);
                const isActive = context.id === activeContext.id;
                
                return (
                  <button
                    key={context.id}
                    onClick={() => handleContextSwitch(context.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-gray-50' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                    style={isActive ? {
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: context.theme_config.primary,
                    } : {}}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: context.theme_config.secondary }}
                    >
                      <Icon 
                        className="w-5 h-5"
                        style={{ color: context.theme_config.primary }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: context.theme_config.primary }}
                      >
                        {context.display_name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {context.context_type}
                      </div>
                    </div>
                    
                    {isActive && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: context.theme_config.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
