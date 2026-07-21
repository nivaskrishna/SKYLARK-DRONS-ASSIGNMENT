import React from 'react';
import { Activity, ShieldCheck, AlertOctagon, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function RightSidebar({ data }) {
  if (!data) return null;

  const healthScore = data.business_health_score || 88;
  const dqReport = data.data_quality_report || {};
  const upcoming = data.upcoming_closures || [];
  const risks = data.auto_risks || [];

  return (
    <aside style={{
      width: '320px',
      background: '#FFFFFF',
      borderLeft: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1.25rem',
      gap: '1.5rem',
      userSelect: 'none',
      flexShrink: 0,
      overflowY: 'auto'
    }}>
      {/* Business Health & AI Status Gauge */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        borderRadius: '18px',
        padding: '1.25rem',
        color: '#FFFFFF',
        boxShadow: '0 8px 20px rgba(49, 46, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A5B4FC' }}>
            Business Health Index
          </span>
          <Activity size={18} style={{ color: '#818CF8' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', lineHeight: 1 }}>
            {healthScore}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#C7D2FE', fontWeight: 600 }}>/ 100</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#E0E7FF' }}>
          <ShieldCheck size={14} style={{ color: '#34D399' }} />
          <span>Audit Confidence: {dqReport.confidence_score || 95}% ({dqReport.confidence_level || 'High'})</span>
        </div>
      </div>

      {/* Live AI Status & Sync */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Live AI Engine Status
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: '#111827', fontWeight: 600 }}>Monday.com API</span>
          <span className="badge-pill badge-success"><CheckCircle2 size={12} /> Connected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.4rem' }}>
          <span style={{ color: '#111827', fontWeight: 600 }}>Gemini 1.5 Analyst</span>
          <span className="badge-pill badge-primary">Active</span>
        </div>
      </div>

      {/* Top Risks */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Operational Risks
          </span>
          <AlertOctagon size={16} style={{ color: '#DC2626' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {risks.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>No active operational risks detected.</div>
          ) : (
            risks.slice(0, 3).map((r, idx) => (
              <div key={idx} style={{
                background: '#FEF2F2',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '0.775rem',
                color: '#991B1B',
                lineHeight: 1.4,
                fontWeight: 500
              }}>
                {r}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Closures */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Upcoming Deal Closures
          </span>
          <Calendar size={16} style={{ color: '#2563EB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {upcoming.slice(0, 4).map((d) => (
            <div key={d.id} style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>{d.name}</div>
                <div style={{ fontSize: '0.725rem', color: '#6B7280' }}>{d.client_code} • {d.sector}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#2563EB' }}>₹{(d.deal_value || 0).toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>{d.tentative_close_date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
