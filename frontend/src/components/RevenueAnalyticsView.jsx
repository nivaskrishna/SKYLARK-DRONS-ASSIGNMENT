import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function RevenueAnalyticsView({ data }) {
  if (!data) return null;
  const fin = data.financial_metrics || {};
  const revTrend = data.revenue_trend || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.65rem', fontFamily: 'Plus Jakarta Sans' }}>
          <DollarSign style={{ color: '#16A34A' }} />
          Revenue Analytics & Financial Performance
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Financial metrics auditing contract value, billed milestones, cash collections, and accounts receivable.
        </p>
      </div>

      <div className="kpi-grid-5">
        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Contract Value</span>
            <div className="kpi-icon-wrap" style={{ background: '#EEF2FF', color: '#4F46E5' }}><DollarSign size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(fin.total_wo_value)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Total Signed Work Orders</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Billed Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}><DollarSign size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(fin.total_billed_value)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Invoices Delivered</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Cash Collected</span>
            <div className="kpi-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}><CheckCircle2 size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(fin.total_collected_amount)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Bank Realized</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Receivables</span>
            <div className="kpi-icon-wrap" style={{ background: '#FEF2F2', color: '#DC2626' }}><AlertCircle size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(fin.total_amount_receivable)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Outstanding Invoices</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>To Be Billed</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#F59E0B' }}><DollarSign size={16} /></div>
          </div>
          <div className="kpi-number">{formatCurrency(fin.total_to_be_billed)}</div>
          <div style={{ fontSize: '0.725rem', color: '#6B7280', fontWeight: 600 }}>Pending Milestones</div>
        </div>
      </div>

      {/* Revenue Trend Area Chart */}
      <div className="bright-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
          Monthly Pipeline vs Cash Realization Trend
        </h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revTrend}>
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip
                contentStyle={{ background: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', color: '#111827', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatCurrency(value), 'Amount']}
              />
              <Area type="monotone" dataKey="pipeline" stroke="#2563EB" fillOpacity={0.15} fill="#2563EB" name="Pipeline Created" />
              <Area type="monotone" dataKey="collected" stroke="#16A34A" fillOpacity={0.2} fill="#16A34A" name="Cash Collected" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
