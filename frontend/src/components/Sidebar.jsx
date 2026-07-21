import React from 'react';
import { LayoutDashboard, MessageSquareText, ShieldAlert, FileSpreadsheet, RefreshCw, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dashboardData, onRefresh, isRefreshing }) {
  const fetchedAt = dashboardData?.fetched_at ? new Date(dashboardData.fetched_at).toLocaleTimeString() : 'N/A';
  const confidence = dashboardData?.data_quality_report?.confidence_level || 'High';
  const score = dashboardData?.data_quality_report?.confidence_score || 95;

  return (
    <aside style={{
      width: '280px',
      background: 'rgba(11, 16, 26, 0.95)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1.25rem',
      gap: '1.75rem',
      userSelect: 'none'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.25rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
        }}>
          <Layers style={{ color: '#ffffff', width: '20px', height: '20px' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', lineHeight: 1.2 }}>Skylark Drones</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Monday BI Agent v1.0</span>
        </div>
      </div>

      {/* Connection Monitor Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '10px',
        padding: '0.85rem 1rem',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>Monday API Sync</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Live
          </span>
        </div>
        <div style={{ color: '#64748b', fontSize: '0.725rem' }}>Last fetched: {fetchedAt}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', color: confidence === 'High' ? '#34d399' : '#fbbf24' }}>
          {confidence === 'High' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          <span style={{ fontSize: '0.725rem', fontWeight: 600 }}>Data Quality: {score}% ({confidence})</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'chat' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            color: activeTab === 'chat' ? '#3b82f6' : '#94a3b8',
            fontWeight: activeTab === 'chat' ? 600 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s'
          }}
        >
          <MessageSquareText size={18} />
          AI Business Analyst
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'dashboard' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            color: activeTab === 'dashboard' ? '#3b82f6' : '#94a3b8',
            fontWeight: activeTab === 'dashboard' ? 600 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s'
          }}
        >
          <LayoutDashboard size={18} />
          Executive Dashboard
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'quality' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            color: activeTab === 'quality' ? '#3b82f6' : '#94a3b8',
            fontWeight: activeTab === 'quality' ? 600 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s'
          }}
        >
          <ShieldAlert size={18} />
          Data Quality Audit
        </button>

        <button
          onClick={() => setActiveTab('leadership')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'leadership' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            color: activeTab === 'leadership' ? '#3b82f6' : '#94a3b8',
            fontWeight: activeTab === 'leadership' ? 600 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s'
          }}
        >
          <FileSpreadsheet size={18} />
          Leadership Sync
        </button>
      </nav>

      {/* Refresh Board Button */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          borderRadius: '9px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.04)',
          color: '#f8fafc',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: isRefreshing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
        {isRefreshing ? 'Refreshing Boards...' : 'Refresh Board Data'}
      </button>
    </aside>
  );
}
