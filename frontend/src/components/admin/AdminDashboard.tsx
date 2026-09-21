import React, { useState } from 'react';
import { Shield, Users, Activity, FileText, CheckCircle, AlertTriangle, Search, Filter, RefreshCw, Key, Lock, ArrowUpRight } from 'lucide-react';
import { AuditLog } from '../../types';

interface AdminDashboardProps {
  onSwitchToDoctor: () => void;
  onSwitchToPatient: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSwitchToDoctor,
  onSwitchToPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [mockAuditLogs] = useState<AuditLog[]>([
    {
      id: 'aud_101',
      patient_id: 'pat_rahul_01',
      visit_id: 'visit_901',
      actor_name: 'Dr. Priya Sharma',
      actor_role: 'doctor',
      action: 'CLINICAL_FACT_VERIFIED',
      details: 'Verified Chief Complaint (Chest pain for 3 days) with status CONFIRMED',
      timestamp: '2026-09-21T18:42:10Z'
    },
    {
      id: 'aud_102',
      patient_id: 'pat_rahul_01',
      visit_id: 'visit_901',
      actor_name: 'Sister Ananya Rao',
      actor_role: 'nurse',
      action: 'VITALS_RECORDED',
      details: 'Recorded BP 142/90 mmHg, HR 78 bpm, SpO2 98%',
      timestamp: '2026-09-21T18:30:15Z'
    },
    {
      id: 'aud_103',
      patient_id: 'pat_rahul_01',
      visit_id: 'visit_901',
      actor_name: 'Rahul Kumar',
      actor_role: 'patient',
      action: 'CONSENT_GRANTED',
      details: 'Granted AI Voice Intake & Data Processing Consent v1.0.0',
      timestamp: '2026-09-21T18:15:00Z'
    },
    {
      id: 'aud_104',
      patient_id: 'pat_rahul_01',
      visit_id: 'visit_901',
      actor_name: 'AI Extraction Engine',
      actor_role: 'ai_system',
      action: 'RED_FLAG_TRIGGERED',
      details: 'Rule acute_coronary_cluster triggered: Chest pain + dyspnea cluster detected',
      timestamp: '2026-09-21T18:22:45Z'
    }
  ]);

  const usersList = [
    { name: 'Dr. Priya Sharma', role: 'Doctor / Physician', email: 'priya.sharma@hospital.org', status: 'Active' },
    { name: 'Sister Ananya Rao', role: 'Staff Nurse / Triage', email: 'ananya.rao@hospital.org', status: 'Active' },
    { name: 'Rahul Kumar', role: 'Patient (Self-Service)', email: 'rahul.kumar@gmail.com', status: 'Active' },
    { name: 'Rajesh V.', role: 'System Administrator', email: 'rajesh.admin@pranabyte.health', status: 'Active' },
  ];

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && log.actor_role === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-parchment-400 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Hospital Administration & Compliance Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            System Governance & Audit Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSwitchToDoctor}
            className="btn-secondary-paper text-xs px-4 py-2"
          >
            <span>Open Doctor Workstation</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-terracotta" />
          </button>
        </div>
      </div>

      {/* System Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="paper-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-graphite">
            <span>Active Users</span>
            <Users className="w-4 h-4 text-terracotta" />
          </div>
          <p className="text-2xl font-serif font-bold text-ink">4 Registered</p>
          <span className="text-[11px] text-[#15803d] font-medium">100% RBAC Enforced</span>
        </div>

        <div className="paper-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-graphite">
            <span>Audit Trail Integrity</span>
            <Shield className="w-4 h-4 text-[#15803d]" />
          </div>
          <p className="text-2xl font-serif font-bold text-ink">100% Verified</p>
          <span className="text-[11px] text-ink-graphite">Tamper-evident logs</span>
        </div>

        <div className="paper-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-graphite">
            <span>AI Safety Screening</span>
            <Activity className="w-4 h-4 text-terracotta" />
          </div>
          <p className="text-2xl font-serif font-bold text-ink">Active</p>
          <span className="text-[11px] text-ink-graphite">Red-flag heuristics live</span>
        </div>

        <div className="paper-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-graphite">
            <span>FHIR R4 Endpoint</span>
            <FileText className="w-4 h-4 text-[#1e40af]" />
          </div>
          <p className="text-2xl font-serif font-bold text-ink">Healthy</p>
          <span className="text-[11px] text-[#15803d] font-medium">ABDM / ABDC Compliant</span>
        </div>
      </div>

      {/* Authorized Users & Role Management */}
      <div className="paper-card p-6 space-y-4">
        <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
          <Users className="w-5 h-5 text-terracotta" />
          <span>Role-Based Access Control (RBAC) Accounts</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment-200 text-ink-graphite uppercase font-semibold border-b border-parchment-400">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-400">
              {usersList.map((u, i) => (
                <tr key={i} className="hover:bg-parchment-300/60 transition">
                  <td className="p-3 font-bold text-ink">{u.name}</td>
                  <td className="p-3 text-ink-charcoal font-medium">{u.role}</td>
                  <td className="p-3 text-ink-graphite font-mono">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-semibold text-[10px]">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-[11px] font-mono text-terracotta font-semibold">Strict RBAC</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Clinical Audit Trail Explorer */}
      <div className="paper-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-400 pb-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
              <FileText className="w-5 h-5 text-terracotta" />
              <span>Immutable Clinical Audit Log Explorer</span>
            </h2>
            <p className="text-xs text-ink-graphite">Traceable log of all PHI accesses, fact verifications, and clinical sign-offs.</p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-graphite" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 pr-3 py-1.5 text-xs bg-parchment border border-parchment-400 rounded-full text-ink focus:outline-none focus:border-terracotta"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-1.5 px-3 bg-parchment border border-parchment-400 rounded-full text-ink focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
              <option value="ai_system">AI Engine</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-2xl bg-parchment border border-parchment-400 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{log.action}</span>
                  <span className="px-2 py-0.5 rounded-full bg-parchment-200 text-ink-graphite text-[10px] font-mono">
                    {log.actor_name} ({log.actor_role})
                  </span>
                </div>
                <p className="text-ink-charcoal text-xs">{log.details}</p>
              </div>
              <div className="text-right font-mono text-[11px] text-ink-graphite">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
