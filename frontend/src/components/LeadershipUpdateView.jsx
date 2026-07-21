import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Copy, Check, RefreshCw, Sparkles, Download, FileText, Printer } from 'lucide-react';

export default function LeadershipUpdateView() {
  const [updateData, setUpdateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/executive-report', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setUpdateData(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdate();
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!updateData) return;
    const sec = updateData.sections || {};
    const text = `
# ${updateData.title}
Generated: ${updateData.generated_at}

## Executive Summary
${sec['Executive Summary']}

## Financial Overview
${sec['Financial Overview']}

## Pipeline Overview
${sec['Pipeline Overview']}

## Operations
${sec['Operations']}

## Major Risks
${(sec['Major Risks'] || []).map(r => `- ${r}`).join('\n')}

## Key Opportunities
${(sec['Key Opportunities'] || []).map(o => `- ${o}`).join('\n')}

## Recommendations
${(sec['Recommendations'] || []).map(rec => `- ${rec}`).join('\n')}

## Next Week Priorities
${(sec['Next Week Priorities'] || []).map(act => `- ${act}`).join('\n')}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6B7280', padding: '2rem', fontWeight: 500 }}>
        <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite', color: '#2563EB' }} />
        Generating Executive Board Meeting Report from live Monday boards...
      </div>
    );
  }

  const sec = updateData?.sections || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.65rem', fontFamily: 'Plus Jakarta Sans' }}>
            <FileSpreadsheet style={{ color: '#2563EB' }} />
            Board Meeting Intelligence Report
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Executive C-level briefing document prepared for Board of Directors and Founders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchUpdate}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '0.65rem 1.1rem',
              color: '#111827',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <RefreshCw size={14} style={{ color: '#2563EB' }} />
            Generate Board Meeting Report
          </button>

          <button
            onClick={handlePrintPDF}
            style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '0.65rem 1.1rem',
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Printer size={14} />
            Export PDF
          </button>

          <button
            onClick={handleCopy}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.65rem 1.25rem',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied Report!' : 'Copy Brief'}
          </button>
        </div>
      </div>

      {/* Printable Executive Board Meeting Report Document */}
      <div className="bright-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', background: '#FFFFFF', borderRadius: '16px' }}>
        <div style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', fontFamily: 'Plus Jakarta Sans' }}>{updateData?.title}</h2>
            <span style={{ fontSize: '0.825rem', color: '#6B7280', marginTop: '0.25rem', display: 'block' }}>Generated at: {updateData?.generated_at}</span>
          </div>

          <div style={{ background: '#F0FDF4', border: '1px solid rgba(22, 163, 74, 0.3)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, color: '#16A34A' }}>
            Health Score: {updateData?.business_health_score || 88} / 100
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            1. Executive Summary
          </h3>
          <p style={{ color: '#111827', fontSize: '1.025rem', lineHeight: 1.65, fontWeight: 500 }}>{sec['Executive Summary']}</p>
        </div>

        {/* 2 & 3. Financials & Pipeline Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.35rem', textTransform: 'uppercase' }}>2. Financial Overview</h4>
            <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.55, fontWeight: 500 }}>{sec['Financial Overview']}</p>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#4F46E5', marginBottom: '0.35rem', textTransform: 'uppercase' }}>3. Pipeline Overview</h4>
            <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.55, fontWeight: 500 }}>{sec['Pipeline Overview']}</p>
          </div>
        </div>

        {/* 4. Operations */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            4. Operational Execution & Workload
          </h3>
          <p style={{ color: '#111827', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>{sec['Operations']}</p>
        </div>

        {/* 5 & 6. Major Risks & Key Opportunities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid rgba(220, 38, 38, 0.25)', padding: '1.25rem', borderRadius: '14px' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.5rem', textTransform: 'uppercase' }}>5. Major Operational & Pipeline Risks</h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#991B1B', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 500 }}>
              {(sec['Major Risks'] || []).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div style={{ background: '#F0FDF4', border: '1px solid rgba(22, 163, 74, 0.25)', padding: '1.25rem', borderRadius: '14px' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>6. Key Opportunities</h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#166534', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 500 }}>
              {(sec['Key Opportunities'] || []).map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
        </div>

        {/* 7 & 8. Recommendations & Priorities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.5rem', textTransform: 'uppercase' }}>7. Strategic Recommendations</h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#1E40AF', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 500 }}>
              {(sec['Recommendations'] || []).map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#D97706', marginBottom: '0.5rem', textTransform: 'uppercase' }}>8. Next Week Priorities</h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#92400E', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 500 }}>
              {(sec['Next Week Priorities'] || []).map((act, i) => <li key={i}>{act}</li>)}
            </ul>
          </div>
        </div>

        {/* Sources Used & Audit Footer */}
        {updateData?.sources_used && (
          <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748B' }}>
            <div>Boards Processed: <strong>{updateData.sources_used.boards?.join(', ')}</strong> ({updateData.sources_used.rows_processed} rows)</div>
            <div style={{ color: '#16A34A', fontWeight: 700 }}>Confidence: {updateData.sources_used.confidence_score}</div>
          </div>
        )}
      </div>
    </div>
  );
}
