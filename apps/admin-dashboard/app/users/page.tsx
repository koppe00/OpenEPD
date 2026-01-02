'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useUsers } from '../../hooks/useUsers';
import { usePatients } from '../../hooks/usePatients';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { UserTable } from '../../components/users/UserTable';
import { UserModal } from '../../components/users/UserModal';
import { PatientSupportView } from '../../components/users/PatientSupportView';
import { AuditLogView } from '../../components/users/AuditLogView';
import { PermissionMatrix } from '../../components/users/PermissionMatrix';
import { RoleManager } from '../../components/users/RoleManager';
import { WorkflowManager } from '../../components/users/WorkflowManager';
import { DashboardOverview } from '../../components/users/DashboardOverview';
import { Users, Shield, Fingerprint, Activity, Zap, LayoutDashboard, UserPlus } from 'lucide-react';

export default function GebruikersBeheer() {
  // 1. Client initialiseren voor dashboard stats
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 2. Hook aanroepen en ALLE functies ophalen (inclusief de nieuwe delete/restore acties)
  const { 
    users, 
    organizations, 
    roles, 
    logs, 
    loading: usersLoading, 
    saveUser, 
    deleteUser,     // Soft Delete
    reactivateUser, // Restore
    } = useUsers();

  const { patients, loading: patientsLoading } = usePatients();
  
  // 3. Lokale state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('matrix');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [stats, setStats] = useState({
    totalStaff: 0,
    totalPatients: 0,
    totalOrgs: 0,
    recentLogsCount: 0
  });

  // 4. Modal Save Handler
  const handleSave = async (formData: any, authOptions: any) => {
    try {
      // We geven formData en authOptions door aan de hook
      await saveUser(formData, authOptions, selectedUser?.id);
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      alert("Fout bij opslaan: " + error.message);
    }
  };

  // 5. Dashboard statistieken ophalen
  const fetchDashboardStats = async () => {
    const [staff, patientsRes, orgs] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_patient', false),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_patient', true),
      supabase.from('organizations').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      totalStaff: staff.count || 0,
      totalPatients: patientsRes.count || 0,
      totalOrgs: orgs.count || 0,
      recentLogsCount: 0
    });
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [users]); // Update stats als users lijst verandert

  const tabs = [
    { id: 'dashboard', label: 'Overzicht', icon: LayoutDashboard },
    { id: 'beheer', label: 'Beheeraccounts', icon: Shield }, // <--- Nieuwe tab
    { id: 'gebruikers', label: 'Zorgverleners', icon: Users },
    { id: 'patiënten', label: 'Patiënten', icon: Fingerprint },
    { id: 'workflow', label: 'Workflows', icon: Zap },
    { id: 'autorisatie', label: 'Rechten & Rollen', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50/50 p-8">
      <AdminHeader title="Beheerder Portaal" />

      {/* Tab Navigatie */}
      <div className="flex gap-2 mb-8 bg-white/50 p-1 rounded-2xl border border-slate-200/50 self-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
  {activeTab === 'dashboard' && <DashboardOverview stats={stats} recentLogs={logs || []} />}
  
  {(activeTab === 'gebruikers' || activeTab === 'beheer') && (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
          {activeTab === 'gebruikers' ? 'Personeelsregister (Zorg)' : 'Systeembeheerders'}
        </p>
        <button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className={`${activeTab === 'gebruikers' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-purple-600 shadow-purple-600/20'} text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg`}
        >
          <UserPlus size={16} /> 
          {activeTab === 'gebruikers' ? 'Nieuwe Zorgverlener' : 'Nieuwe Beheerder'}
        </button>
      </div>
      
      <UserTable 
        // We filteren hier de users array op basis van de geselecteerde tab
        users={users?.filter((u: any) => 
          activeTab === 'beheer' ? u.app_role === 'admin' : u.app_role !== 'admin'
        ) || []} 
        onEdit={(u: any) => { setSelectedUser(u); setIsModalOpen(true); }} 
        onDelete={(id: string) => deleteUser(id)}
        onReactivate={(id: string) => reactivateUser(id)}
        loading={usersLoading} 
      />
    </div>
  )}

  {activeTab === 'patiënten' && <PatientSupportView patients={patients || []} loading={patientsLoading} />}

        {activeTab === 'patiënten' && <PatientSupportView patients={patients || []} loading={patientsLoading} />}
        
        {activeTab === 'workflow' && <WorkflowManager />}

        {activeTab === 'autorisatie' && (
          <div className="space-y-8">
            <div className="flex gap-6 border-b border-slate-100 pb-2 ml-4">
              <button onClick={() => setSubTab('matrix')} className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${subTab === 'matrix' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Rechten Matrix</button>
              <button onClick={() => setSubTab('rollen')} className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${subTab === 'rollen' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Rollen Beheer</button>
            </div>
            {subTab === 'matrix' ? <PermissionMatrix /> : <RoleManager />}
          </div>
        )}

        {activeTab === 'audit' && <AuditLogView />}
      </div>

      {/* User Modal */}
      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedUser={selectedUser}
        organizations={organizations}
        roles={roles}
        mode={activeTab === 'beheer' ? 'admin' : 'provider'}
      />
    </div>
  );
}