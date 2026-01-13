'use client';

import React, { useState } from 'react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { useAIConfig } from '../../../hooks/useAIConfig';
import { FeatureEditorModal } from '../../../components/ai-config/FeatureEditorModal';
import { AssignmentEditorModal } from '../../../components/ai-config/AssignmentEditorModal';
import { ScopeEditorModal } from '../../../components/ai-config/ScopeEditorModal';
import { 
  Brain, 
  Sliders, 
  Layers, 
  BarChart3,
  FileCode,
  Plus,
  Settings,
  Power,
  Trash2
} from 'lucide-react';

export default function AIGovernancePage() {
  const [activeTab, setActiveTab] = useState('features');
  const { 
    features, 
    assignments, 
    scopes, 
    loading, 
    saveFeature, 
    saveAssignment,
    saveScope,
    deleteAssignment,
    toggleFeature 
  } = useAIConfig();

  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedScope, setSelectedScope] = useState<any>(null);

  const tabs = [
    { id: 'features', label: 'AI Features', icon: Brain },
    { id: 'assignments', label: 'Configuraties', icon: Sliders },
    { id: 'scopes', label: 'Scopes & Hiërarchie', icon: Layers },
    { id: 'templates', label: 'Templates', icon: FileCode },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-50/50 p-8">
        <AdminHeader title="AI Governance" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-slate-500">Loading AI configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50/50 p-8">
      <AdminHeader 
        title="AI Governance & Configuration" 
        subtitle="Beheer AI features, configuraties en toegangsrechten"
      />

      <div className="flex gap-2 mb-6 bg-white/50 p-1 rounded-2xl border border-slate-200/50 self-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }
              `}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'features' && (
          <FeaturesView 
            features={features}
            onEdit={(f) => {
              setSelectedFeature(f);
              setFeatureModalOpen(true);
            }}
            onNew={() => {
              setSelectedFeature(null);
              setFeatureModalOpen(true);
            }}
            onToggle={toggleFeature}
          />
        )}
        {activeTab === 'assignments' && (
          <AssignmentsView 
            assignments={assignments}
            onEdit={(a) => {
              setSelectedAssignment(a);
              setAssignmentModalOpen(true);
            }}
            onNew={() => {
              setSelectedAssignment(null);
              setAssignmentModalOpen(true);
            }}
            onDelete={deleteAssignment}
          />
        )}
        {activeTab === 'scopes' && (
          <ScopesView 
            scopes={scopes}
            onEdit={(s) => {
              setSelectedScope(s);
              setScopeModalOpen(true);
            }}
            onNew={() => {
              setSelectedScope(null);
              setScopeModalOpen(true);
            }}
          />
        )}
        {activeTab === 'templates' && <TemplatesView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </div>

      <FeatureEditorModal
        isOpen={featureModalOpen}
        onClose={() => {
          setFeatureModalOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature}
        onSave={saveFeature}
      />

      <AssignmentEditorModal
        isOpen={assignmentModalOpen}
        onClose={() => {
          setAssignmentModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        features={features}
        scopes={scopes}
        onSave={saveAssignment}
      />

      <ScopeEditorModal
        isOpen={scopeModalOpen}
        onClose={() => {
          setScopeModalOpen(false);
          setSelectedScope(null);
        }}
        scope={selectedScope}
        onSave={saveScope}
      />
    </div>
  );
}

function FeaturesView({ features, onEdit, onNew, onToggle }: any) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">AI Features</h2>
          <p className="text-sm text-slate-500">Beheer beschikbare AI functionaliteiten</p>
        </div>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-semibold"
        >
          <Plus size={16} />
          Nieuwe Feature
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {features.map((feature: any) => (
          <div key={feature.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">{feature.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    feature.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {feature.is_active ? 'active' : 'inactive'}
                  </span>
                  {feature.is_beta && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700">
                      beta
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{feature.category}</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onToggle(feature.id, !feature.is_active)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  title={feature.is_active ? 'Deactivate' : 'Activate'}
                >
                  <Power size={16} className={feature.is_active ? 'text-green-600' : 'text-slate-400'} />
                </button>
                <button 
                  onClick={() => onEdit(feature)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Settings size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">ID: {feature.feature_id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsView({ assignments, onEdit, onNew, onDelete }: any) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Configuratie Toewijzingen</h2>
          <p className="text-sm text-slate-500">Wijs AI configuraties toe aan scopes</p>
        </div>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-semibold"
        >
          <Plus size={16} />
          Nieuwe Toewijzing
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase">Feature</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase">Scope</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase">Target</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase">Acties</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment: any) => (
              <tr key={assignment.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                  {assignment.feature?.name || assignment.feature_id}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold capitalize">
                    {assignment.scope?.scope_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {assignment.scope?.scope_label || assignment.scope?.scope_value}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    assignment.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {assignment.is_active ? 'Actief' : 'Inactief'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEdit(assignment)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                    >
                      Bewerken
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Weet je zeker dat je deze toewijzing wilt verwijderen?')) {
                          onDelete(assignment.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScopesView({ scopes, onEdit, onNew }: any) {
  const scopesByType = scopes.reduce((acc: any, scope: any) => {
    if (!acc[scope.scope_type]) acc[scope.scope_type] = [];
    acc[scope.scope_type].push(scope);
    return acc;
  }, {});

  const typeOrder = ['user', 'group', 'role', 'specialisme', 'werkcontext', 'organization', 'global'];
  const typeColors: any = {
    user: 'red',
    group: 'orange',
    role: 'yellow',
    specialisme: 'green',
    werkcontext: 'blue',
    organization: 'indigo',
    global: 'purple'
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Scopes & Hiërarchie</h2>
          <p className="text-sm text-slate-500">Overzicht van configuratie scopes en hun prioriteiten</p>
        </div>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-semibold"
        >
          <Plus size={16} />
          Nieuwe Scope
        </button>
      </div>

      <div className="space-y-3">
        {typeOrder.map((type, index) => {
          const scopesOfType = scopesByType[type] || [];
          const color = typeColors[type];
          return (
            <div key={type} className="flex items-center gap-4">
              <div className="w-8 text-center">
                <span className="font-bold text-slate-400 text-sm">{index + 1}</span>
              </div>
              <div className={`flex-1 p-4 bg-${color}-50 border border-${color}-200 rounded-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-${color}-900 capitalize`}>{type}</h3>
                    <p className={`text-sm text-${color}-700`}>
                      {scopesOfType.length} scope{scopesOfType.length !== 1 ? 's' : ''} gedefinieerd
                    </p>
                    {scopesOfType.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {scopesOfType.map((scope: any) => (
                          <button
                            key={scope.id}
                            onClick={() => onEdit(scope)}
                            className={`px-3 py-1 bg-white border border-${color}-300 rounded-lg text-xs font-semibold text-${color}-800 hover:bg-${color}-100 transition-colors`}
                          >
                            {scope.scope_label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Layers size={20} className={`text-${color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplatesView() {
  return <div className="p-6"><h3 className="text-xl font-bold">Templates - Coming soon</h3></div>;
}

function AnalyticsView() {
  return <div className="p-6"><h3 className="text-xl font-bold">Analytics - Coming soon</h3></div>;
}

