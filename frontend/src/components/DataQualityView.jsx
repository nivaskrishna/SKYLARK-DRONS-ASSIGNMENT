import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, FileX, Users, Calendar, Copy, Check } from 'lucide-react';

export default function DataQualityView({ report }) {
  if (!report) return <div style={{ color: '#6B7280', padding: '2rem' }}>Loading Data Quality Audit...</div>;

  const issues = report.data_quality_issues || [];
  const score = report.confidence_score || 95;
  const level = report.confidence_level || 'High';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldAlert style={{ color: '#2563EB' }} />
          Data Quality & Governance Audit
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Automated data sanitization report auditing NULL values, missing dates, unassigned owners, and record duplicates across Monday.com boards.
        </p>
      </div>

      {/* Audit Score Banner */}
      <div className="bright-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Overall Data Confidence Score
          </div>
          <div style={{ fontSize: '2.75rem', fontWeight: 800, color: level === 'High' ? '#16A34A' : '#F59E0B', marginTop: '0.25rem', fontFamily: 'Plus Jakarta Sans' }}>
            {score}% ({level})
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem', fontWeight: 500 }}>
            Calculated across {report.total_deals_processed || 0} Deals & {report.total_work_orders_processed || 0} Work Orders records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ textAlign: 'center', background: '#F1F5F9', padding: '1rem 1.35rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <Calendar size={22} style={{ color: '#2563EB', marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>{report.missing_dates || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Missing Dates</div>
          </div>

          <div style={{ textAlign: 'center', background: '#F1F5F9', padding: '1rem 1.35rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <Users size={22} style={{ color: '#F59E0B', marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>{report.missing_owners || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Unassigned Owners</div>
          </div>

          <div style={{ textAlign: 'center', background: '#F1F5F9', padding: '1rem 1.35rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <FileX size={22} style={{ color: '#4F46E5', marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>{report.missing_revenue || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Zero Values</div>
          </div>

          <div style={{ textAlign: 'center', background: '#F1F5F9', padding: '1rem 1.35rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <Copy size={22} style={{ color: '#DC2626', marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>{(report.duplicate_deals || 0) + (report.duplicate_work_orders || 0)}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Duplicates</div>
          </div>
        </div>
      </div>

      {/* Record Issues Table */}
      <div className="bright-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
          Itemized Data Quality Warnings ({issues.length} flagged items)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                <th style={{ padding: '0.75rem 0.85rem' }}>Item ID</th>
                <th style={{ padding: '0.75rem 0.85rem' }}>Board Source</th>
                <th style={{ padding: '0.75rem 0.85rem' }}>Audit Flag & Issue Description</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '1.5rem', textAlign: 'center', color: '#16A34A', fontWeight: 600 }}>
                    No critical data quality flags detected! All board records passed sanitization audits.
                  </td>
                </tr>
              ) : (
                issues.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', color: '#111827' }}>
                    <td style={{ padding: '0.85rem', fontFamily: 'monospace', color: '#2563EB', fontWeight: 600 }}>{item.item_id}</td>
                    <td style={{ padding: '0.85rem' }}><span className="badge-pill badge-primary">{item.board}</span></td>
                    <td style={{ padding: '0.85rem', color: '#D97706', fontWeight: 500 }}>{item.issue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
