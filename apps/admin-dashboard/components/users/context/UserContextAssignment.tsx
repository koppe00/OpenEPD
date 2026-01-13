'use client';

import React, { useState, useEffect } from 'react';
import { Users, Building2, MapPin, Shield, Briefcase, CheckCircle, Star, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface ContextAssignmentProps {
  userId: string;
  availableRoles: any[];
  availableSpecialisms: any[];
  availableOrganizations: any[];
  availableGroups: any[];
  availableWorkContexts: any[];
  onSave: (contexts: any) => void;
  fetchUserContexts: (userId: string) => Promise<any>;
}

// Reusable compact selection component
function ContextSection({
  title,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  items,
  selectedItems,
  onToggle,
  onTogglePrimary,
  displayKey = 'display_name',
  defaultExpanded = true,
  showSearch = false,
}: {
  title: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  items: any[];
  selectedItems: Array<{ id: string; is_primary: boolean }>;
  onToggle: (id: string) => void;
  onTogglePrimary: (id: string) => void;
  displayKey?: string;
  defaultExpanded?: boolean;
  showSearch?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = searchTerm 
    ? items.filter(item => 
        (item[displayKey] || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  const selectedCount = selectedItems.length;

  return (
    <section className="bg-slate-50/50 rounded-xl border border-slate-100">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 hover:bg-slate-100/50 transition-colors rounded-t-xl"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Icon size={14} className={iconColor} />
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex-1 text-left">
          {title}
        </span>
        {selectedCount > 0 && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${bgColor} ${iconColor}`}>
            {selectedCount} geselecteerd
          </span>
        )}
      </button>
      
      {expanded && (
        <div className="p-3 pt-0 space-y-2">
          {showSearch && items.length > 6 && (
            <div className="relative mb-2">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Zoeken..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          )}
          
          <div className={`grid gap-1.5 ${items.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} max-h-48 overflow-y-auto`}>
            {filteredItems.map((item: any) => {
              const isSelected = selectedItems.find(s => s.id === item.id);
              const isPrimary = isSelected?.is_primary;
              
              return (
                <label
                  key={item.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all text-xs ${
                    isSelected
                      ? `${bgColor} border ${borderColor}`
                      : 'bg-white border border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!isSelected}
                    onChange={() => onToggle(item.id)}
                    className="w-3.5 h-3.5 rounded"
                  />
                  <span className="flex-1 font-medium truncate" title={item[displayKey] || item.name}>
                    {item[displayKey] || item.name}
                  </span>
                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onTogglePrimary(item.id);
                      }}
                      className={`p-0.5 rounded transition-colors ${isPrimary ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
                      title="Primair (actief bij inloggen)"
                    >
                      <Star size={12} fill={isPrimary ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </label>
              );
            })}
          </div>
          
          {filteredItems.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">Geen items gevonden</p>
          )}
        </div>
      )}
    </section>
  );
}

export function UserContextAssignment({
  userId,
  availableRoles,
  availableSpecialisms,
  availableOrganizations,
  availableGroups,
  availableWorkContexts,
  onSave,
  fetchUserContexts
}: ContextAssignmentProps) {
  const [selectedRoles, setSelectedRoles] = useState<Array<{ id: string; is_primary: boolean }>>([]);
  const [selectedSpecialisms, setSelectedSpecialisms] = useState<Array<{ id: string; is_primary: boolean }>>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<Array<{ id: string; is_primary: boolean }>>([]);
  const [selectedGroups, setSelectedGroups] = useState<Array<{ id: string; is_primary: boolean; role_in_group?: string }>>([]);
  const [selectedWorkContexts, setSelectedWorkContexts] = useState<Array<{ id: string; is_primary: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserContexts();
  }, [userId]);

  const loadUserContexts = async () => {
    if (!userId) return;
    setLoading(true);
    
    try {
      const contexts = await fetchUserContexts(userId);
      
      setSelectedRoles(contexts.roles.map((r: any) => ({ id: r.role_id, is_primary: r.is_primary })));
      setSelectedSpecialisms(contexts.specialisms.map((s: any) => ({ id: s.specialism_id, is_primary: s.is_primary })));
      setSelectedOrgs(contexts.organizations.map((o: any) => ({ id: o.organization_id, is_primary: o.is_primary })));
      setSelectedGroups(contexts.groups.map((g: any) => ({ 
        id: g.group_id, 
        is_primary: g.is_primary,
        role_in_group: g.role_in_group 
      })));
      setSelectedWorkContexts(contexts.work_contexts.map((wc: any) => ({ id: wc.work_context_id, is_primary: wc.is_primary })));
    } catch (error) {
      console.error('Error loading user contexts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (
    list: Array<{ id: string; is_primary: boolean }>,
    setList: Function,
    itemId: string
  ) => {
    const exists = list.find(item => item.id === itemId);
    if (exists) {
      setList(list.filter(item => item.id !== itemId));
    } else {
      setList([...list, { id: itemId, is_primary: list.length === 0 }]);
    }
  };

  const togglePrimary = (
    list: Array<{ id: string; is_primary: boolean }>,
    setList: Function,
    itemId: string
  ) => {
    setList(list.map(item => ({ ...item, is_primary: item.id === itemId })));
  };

  const handleSave = () => {
    onSave({
      roles: selectedRoles.map(r => ({ role_id: r.id, is_primary: r.is_primary })),
      specialisms: selectedSpecialisms.map(s => ({ specialism_id: s.id, is_primary: s.is_primary })),
      organizations: selectedOrgs.map(o => ({ organization_id: o.id, is_primary: o.is_primary })),
      groups: selectedGroups.map(g => ({ 
        group_id: g.id, 
        is_primary: g.is_primary,
        role_in_group: g.role_in_group 
      })),
      work_contexts: selectedWorkContexts.map(wc => ({ work_context_id: wc.id, is_primary: wc.is_primary })),
    });
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-400 text-sm">Contexten laden...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-xs text-blue-700">
        <Star size={10} className="inline mr-1 text-yellow-500" fill="currentColor" />
        Het sterretje markeert de <strong>primaire</strong> (actieve) context bij inloggen.
        <span className="float-right font-mono text-[9px] text-slate-400" title="Profile ID voor context koppelingen">
          ID: {userId?.substring(0, 8)}...
        </span>
      </div>

      {/* Rollen - always expanded, usually small list */}
      <ContextSection
        title="Systeemrollen"
        icon={Shield}
        iconColor="text-purple-600"
        bgColor="bg-purple-50"
        borderColor="border-purple-200"
        items={availableRoles}
        selectedItems={selectedRoles}
        onToggle={(id) => toggleSelection(selectedRoles, setSelectedRoles, id)}
        onTogglePrimary={(id) => togglePrimary(selectedRoles, setSelectedRoles, id)}
        defaultExpanded={true}
      />

      {/* Specialismen - searchable if large */}
      <ContextSection
        title="Specialismen"
        icon={Briefcase}
        iconColor="text-blue-600"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        items={availableSpecialisms}
        selectedItems={selectedSpecialisms}
        onToggle={(id) => toggleSelection(selectedSpecialisms, setSelectedSpecialisms, id)}
        onTogglePrimary={(id) => togglePrimary(selectedSpecialisms, setSelectedSpecialisms, id)}
        defaultExpanded={true}
        showSearch={true}
      />

      {/* Organisaties */}
      <ContextSection
        title="Organisaties"
        icon={Building2}
        iconColor="text-orange-600"
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
        items={availableOrganizations}
        selectedItems={selectedOrgs}
        onToggle={(id) => toggleSelection(selectedOrgs, setSelectedOrgs, id)}
        onTogglePrimary={(id) => togglePrimary(selectedOrgs, setSelectedOrgs, id)}
        displayKey="name"
        defaultExpanded={selectedOrgs.length > 0}
      />

      {/* Groepen - collapsed by default */}
      <ContextSection
        title="Teams & Groepen"
        icon={Users}
        iconColor="text-green-600"
        bgColor="bg-green-50"
        borderColor="border-green-200"
        items={availableGroups}
        selectedItems={selectedGroups}
        onToggle={(id) => toggleSelection(selectedGroups, setSelectedGroups, id)}
        onTogglePrimary={(id) => togglePrimary(selectedGroups, setSelectedGroups, id)}
        defaultExpanded={selectedGroups.length > 0}
      />

      {/* Werkcontexten */}
      <ContextSection
        title="Werkcontexten"
        icon={MapPin}
        iconColor="text-cyan-600"
        bgColor="bg-cyan-50"
        borderColor="border-cyan-200"
        items={availableWorkContexts}
        selectedItems={selectedWorkContexts}
        onToggle={(id) => toggleSelection(selectedWorkContexts, setSelectedWorkContexts, id)}
        onTogglePrimary={(id) => togglePrimary(selectedWorkContexts, setSelectedWorkContexts, id)}
        defaultExpanded={true}
      />

      {/* Save Button - sticky at bottom */}
      <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 -mx-3 px-3">
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <CheckCircle size={14} />
          Contexten Opslaan
        </button>
      </div>
    </div>
  );
}
