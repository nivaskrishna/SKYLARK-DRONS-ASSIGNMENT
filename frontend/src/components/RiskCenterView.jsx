import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RiskCenterView({ data }) {
  if (!data) return null;
  const delayed = data.delayed_work_orders || [];
  const risks = data.auto_risks || [];
  const topClients = data.top_clients || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertOctagon style={{ color: '#DC2626' }} />
          Executive Risk Center & Bottlenecks
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Real-time risk radar monitoring delivery delays, revenue concentration, and owner bandwidth overcapacity.
        </p>
      </div>

      {/* Active Risk Alerts Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {risks.map((r, idx) => (
          <div key={idx} className="bright-card" style={{ padding: '1.5rem', background: '#FEF2F2', border: '1px solid rgba(220, 38, 38, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} />
              Risk Alert #{idx + 1}
            </div>
            <p style={{ color: '#991B1B', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{r}</p>
          </div>
        ))}
      </div>

      {/* Delayed Work Orders Escalation List */}
      <div className="bright-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>
          Critical Project Delivery Escalations ({delayed.length} Overdue)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                <th style={{ padding: '0.75rem' }}>Item ID</th>
                <th style={{ padding: '0.75rem' }}>Work Order Name</th>
                <th style={{ padding: '0.75rem' }}>Client</th>
                <th style={{ padding: '0.75rem' }}>Owner</th>
                <th style={{ padding: '0.75rem' }}>Contract Value</th>
                <th style={{ padding: '0.75rem' }}>Execution Status</th>
              </tr>
            </thead>
            <tbody>
              {delayed.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.85rem', fontFamily: 'monospace', color: '#2563EB', fontWeight: 600 }}>{w.id}</td>
                  <td style={{ padding: '0.85rem', fontWeight: 700, color: '#111827' }}>{w.name}</td>
                  <td style={{ padding: '0.85rem', color: '#6B7280' }}>{w.client_code}</td>
                  <td style={{ padding: '0.85rem' }}><span className="badge-pill badge-primary">{w.owner_code}</span></td>
                  <td style={{ padding: '0.85rem', fontWeight: 700, color: '#2563EB' }}>₹{(w.wo_value || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.85rem' }}><span className="badge-pill badge-danger">{w.execution_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
