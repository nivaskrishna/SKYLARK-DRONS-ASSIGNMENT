import React from 'react';
import { TrendingUp, DollarSign, Briefcase, AlertCircle, CheckCircle2, ArrowUpRight, Users, BarChart2, Activity, Zap, ShieldCheck, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function OverviewView({ data, onSelectQuery, setActiveTab }) {
  if (!data) return <div style={{ color: '#6B7280', padding: '2rem' }}>Loading Overview...</div>;

  const pipe = data.pipeline_metrics || {};
  const fin = data.financial_metrics || {};
  const sectors = data.sector_analysis || [];
  const delayed = data.delayed_work_orders || [];
  const dq = data.data_quality_report || {};
  const health = data.business_health_score || 40;
  const woMetrics = data.work_order_metrics || {};

  const topSectors = [...sectors].sort((a, b) => (b.pipeline_value || 0) - (a.pipeline_value || 0)).slice(0, 4);

  const healthColor = health >= 75 ? '#16A34A' : health >= 50 ? '#D97706' : '#DC2626';
  const healthBg = health >= 75 ? '#F0FDF4' : health >= 50 ? '#FFFBEB' : '#FEF2F2';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity style={{ color: '#2563EB' }} size={22} /> Business Overview
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.15rem' }}>
            Live snapshot from Monday.com · Deals Board & Work Orders Board
          </p>
        </div>
        <div style={{
          background: healthBg,
          border: `1px solid ${healthColor}40`,
          borderRadius: '12px',
          padding: '0.6rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: healthColor, fontFamily: 'Plus Jakarta Sans' }}>{health}</div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: healthColor, textTransform: 'uppercase' }}>Health Score</div>
            <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>Out of 100</div>
          </div>
        </div>
      </div>

      {/* 6 Core KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          {
            icon: TrendingUp, label: 'Total Pipeline', value: formatCurrency(pipe.total_pipeline_value),
            sub: `${pipe.total_deals || 0} Active Deals`, color: '#2563EB', bg: '#EFF6FF',
            query: 'Show pipeline summary'
          },
          {
            icon: DollarSign, label: 'Expected Revenue', value: formatCurrency(pipe.expected_revenue),
            sub: 'Probability Weighted', color: '#16A34A', bg: '#F0FDF4',
            query: 'What is our expected revenue?'
          },
          {
            icon: Briefcase, label: 'Work Order Contract', value: formatCurrency(fin.total_wo_value),
            sub: `${woMetrics.total_work_orders || 0} Work Orders`, color: '#4F46E5', bg: '#F5F3FF',
            query: 'Show work orders summary'
          },
          {
            icon: CheckCircle2, label: 'Cash Collected', value: formatCurrency(fin.total_collected_amount),
            sub: 'Milestone Payments', color: '#059669', bg: '#ECFDF5',
            query: 'Revenue this month'
          },
          {
            icon: AlertCircle, label: 'Delayed Orders', value: String(delayed.length),
            sub: 'Require Escalation', color: '#DC2626', bg: '#FEF2F2',
            query: 'Show delayed work orders'
          },
          {
            icon: ShieldCheck, label: 'Data Confidence', value: `${dq.confidence_score || 10}%`,
            sub: `${dq.confidence_level || 'Low'} — ${dq.clean_records_pct || 60}% Clean`, color: '#D97706', bg: '#FFFBEB',
            query: 'Data quality report'
          }
        ].map(({ icon: Icon, label, value, sub, color, bg, query }, i) => (
          <div
            key={i}
            onClick={() => { onSelectQuery(query); setActiveTab('chat'); }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = color; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, borderRadius: '14px 14px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ background: bg, borderRadius: '8px', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
              <ArrowUpRight size={14} style={{ color: '#9CA3AF' }} />
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', fontFamily: 'Plus Jakarta Sans' }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '0.2rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Top Sectors */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={16} style={{ color: '#2563EB' }} /> Top Sectors by Pipeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topSectors.map((s, i) => {
              const maxVal = topSectors[0]?.pipeline_value || 1;
              const pct = Math.round((s.pipeline_value / maxVal) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{s.sector || 'Unknown'}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB' }}>{formatCurrency(s.pipeline_value)}</span>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #2563EB, #4F46E5)`, borderRadius: '99px', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '0.15rem' }}>{s.deal_count || 0} deals · Win rate {Math.round((s.win_rate || 0) * 100)}%</div>
                </div>
              );
            })}
            {topSectors.length === 0 && <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>No sector data available.</div>}
          </div>
        </div>

        {/* Operational Status */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} style={{ color: '#D97706' }} /> Operational Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Pipeline Health', status: pipe.total_pipeline_value > 500_000_000 ? 'Healthy' : 'Needs Attention', ok: pipe.total_pipeline_value > 500_000_000 },
              { label: 'Delivery Schedule', status: delayed.length > 20 ? `${delayed.length} Overdue` : 'On Track', ok: delayed.length <= 20 },
              { label: 'Revenue Collection', status: fin.total_collected_amount > 50_000_000 ? 'Excellent' : 'Moderate', ok: fin.total_collected_amount > 50_000_000 },
              { label: 'Data Quality', status: `${dq.confidence_score || 10}% Confidence`, ok: (dq.confidence_score || 0) >= 70 },
              { label: 'Monday API Sync', status: 'Live', ok: true }
            ].map(({ label, status, ok }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#374151' }}>{label}</span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 700,
                  color: ok ? '#16A34A' : '#DC2626',
                  background: ok ? '#F0FDF4' : '#FEF2F2',
                  border: `1px solid ${ok ? '#16A34A' : '#DC2626'}30`,
                  borderRadius: '99px',
                  padding: '0.15rem 0.6rem'
                }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delayed Work Orders Preview */}
      {delayed.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} /> Top Delayed Work Orders — Needs Immediate Action
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            {delayed.slice(0, 6).map((wo, i) => (
              <div key={i} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '0.65rem 0.85rem', border: '1px solid rgba(220,38,38,0.15)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111827', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {wo.item_name || 'Work Order'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{wo.account_name || wo.client_name || '—'}</div>
                <div style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 600, marginTop: '0.2rem' }}>{wo.sector || '—'}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { onSelectQuery('Show all delayed work orders'); setActiveTab('chat'); }}
            style={{ marginTop: '0.75rem', background: 'none', border: '1px solid rgba(220,38,38,0.3)', color: '#DC2626', borderRadius: '8px', padding: '0.4rem 0.85rem', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer' }}
          >
            View All {delayed.length} Delayed Orders →
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={16} style={{ color: '#4F46E5' }} /> Quick AI Queries
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            'How is our Energy pipeline this quarter?',
            'Show clients above ₹1 Cr',
            'Who has most work orders?',
            'Revenue this month',
            'Show only open deals',
            'Operational bottlenecks',
            'Top 5 highest value deals',
            'Leadership summary'
          ].map((q, i) => (
            <button
              key={i}
              onClick={() => { onSelectQuery(q); setActiveTab('chat'); }}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E5E7EB',
                borderRadius: '99px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.775rem',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#2563EB'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
