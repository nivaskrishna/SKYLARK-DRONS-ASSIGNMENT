import React from 'react';
import { TrendingUp, PieChart as PieIcon, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function PipelineIntelligenceView({ data }) {
  if (!data) return null;
  const pipe = data.pipeline_metrics || {};
  const sectors = data.sector_analysis || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.65rem', fontFamily: 'Plus Jakarta Sans' }}>
          <TrendingUp style={{ color: '#2563EB' }} />
          Pipeline Intelligence & Deal Funnel
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Deep analytics into open deals, win probabilities, sector distribution, and pipeline conversion velocities.
        </p>
      </div>

      <div className="kpi-grid-5">
        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Gross Pipeline</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}><TrendingUp size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(pipe.total_pipeline_value)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>{pipe.total_deals || 0} Total Tracked Deals</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Weighted Expected</span>
            <div className="kpi-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}><TrendingUp size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(pipe.expected_revenue)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Win Probability Adjusted</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Open Deals</span>
            <div className="kpi-icon-wrap" style={{ background: '#EEF2FF', color: '#4F46E5' }}><PieIcon size={16} /></div>
          </div>
          <div className="kpi-number">{pipe.open_deals || 0}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Active Negotiations</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Win Rate</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#F59E0B' }}><ArrowUpRight size={16} /></div>
          </div>
          <div className="kpi-number">{pipe.overall_win_probability || 0}%</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>{pipe.closed_won_deals || 0} Closed Won Deals</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Conversion Health</span>
            <div className="kpi-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}><TrendingUp size={16} /></div>
          </div>
          <div className="kpi-number" style={{ color: '#16A34A' }}>Strong</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Sales Velocity Target</div>
        </div>
      </div>

      {/* Sector Breakdown Table */}
      <div className="bright-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
          Sector Pipeline & Win Rates Breakdown
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                <th style={{ padding: '0.65rem' }}>Sector Name</th>
                <th style={{ padding: '0.65rem' }}>Total Pipeline</th>
                <th style={{ padding: '0.65rem' }}>Expected Revenue</th>
                <th style={{ padding: '0.65rem' }}>Deal Count</th>
                <th style={{ padding: '0.65rem' }}>Win Rate %</th>
                <th style={{ padding: '0.65rem' }}>Work Orders Completed</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sec, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', color: '#111827' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{sec.sector}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#2563EB' }}>{formatCurrency(sec.pipeline_value)}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#16A34A' }}>{formatCurrency(sec.expected_revenue)}</td>
                  <td style={{ padding: '0.75rem' }}>{sec.deal_count}</td>
                  <td style={{ padding: '0.75rem' }}><span className="badge-pill badge-primary">{sec.deal_win_rate}%</span></td>
                  <td style={{ padding: '0.75rem' }}>{sec.wo_completed} / {sec.wo_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
