import React from 'react';
import { LayoutDashboard, BarChart2, MessageSquareText, FileSpreadsheet, TrendingUp, DollarSign, Briefcase, Network, ShieldAlert, AlertTriangle, Settings, History, Filter } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'chat', label: 'AI Business Analyst', icon: MessageSquareText, badge: 'AI' },
  { id: 'leadership', label: 'Leadership Report', icon: FileSpreadsheet },
  { id: 'pipeline', label: 'Pipeline Intelligence', icon: TrendingUp },
  { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
  { id: 'workorders', label: 'Work Orders', icon: Briefcase },
  { id: 'crossboard', label: 'Cross Board Insights', icon: Network },
  { id: 'quality', label: 'Data Quality', icon: ShieldAlert },
  { id: 'risk', label: 'Risk Center', icon: AlertTriangle, badge: 'Escalations' },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const RECENT_QUESTIONS = [
  "How is our pipeline?",
  "Revenue this month",
  "Delayed projects",
  "Top clients",
  "Cash collected"
];

const QUICK_FILTERS = [
  "Show only Energy deals",
  "Only open deals",
  "Only delayed work orders",
  "Clients above ₹1 Cr"
];

export default function LeftSidebar({ activeTab, setActiveTab, onSelectQuery, isMobileOpen, onCloseMobile }) {
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleQueryClick = (q) => {
    if (onSelectQuery) onSelectQuery(q);
    setActiveTab('chat');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isMobileOpen ? 'mobile-open' : ''}`}
        onClick={onCloseMobile}
      />
      <aside className={`left-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding: '0 0.4rem', fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          NAVIGATION
        </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.55rem',
                borderRadius: '7px',
                border: 'none',
                background: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#2563EB' : '#4B5563',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.785rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = '#F8FAFC';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                <Icon size={14} style={{ color: isActive ? '#2563EB' : '#6B7280', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.575rem',
                  fontWeight: 800,
                  padding: '0.08rem 0.3rem',
                  borderRadius: '9999px',
                  background: isActive ? '#2563EB' : '#EEF2FF',
                  color: isActive ? '#FFFFFF' : '#4F46E5',
                  flexShrink: 0
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Query History */}
      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.55rem' }}>
        <div style={{ padding: '0 0.4rem 0.35rem', fontSize: '0.625rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <History size={11} /> RECENT QUESTIONS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {RECENT_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryClick(q)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '0.35rem 0.55rem',
                fontSize: '0.725rem',
                color: '#64748B',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'none'; }}
            >
              • {q}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.55rem' }}>
        <div style={{ padding: '0 0.4rem 0.35rem', fontSize: '0.625rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Filter size={11} /> QUICK FILTERS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {QUICK_FILTERS.map((f, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryClick(f)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '0.35rem 0.55rem',
                fontSize: '0.725rem',
                color: '#2563EB',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              ⚡ {f}
            </button>
          ))}
        </div>
      </div>

      {/* Footer info card */}
      <div style={{
        marginTop: 'auto',
        background: '#F8FAFC',
        border: '1px solid #E5E7EB',
        borderRadius: '7px',
        padding: '0.55rem 0.65rem',
        fontSize: '0.7rem'
      }}>
        <div style={{ color: '#111827', fontWeight: 700 }}>SkyLark</div>
        <div style={{ color: '#6B7280', fontSize: '0.65rem' }}>Deals & Work Orders Sync</div>
      </div>
    </aside>
  );
}
