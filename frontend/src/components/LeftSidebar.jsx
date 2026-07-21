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
        <div style={{ padding: '0.4rem 0.4rem 0.2rem', fontSize: '0.65rem', fontWeight: 800, color: '#8C7A68', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          NAVIGATION
        </div>

        <nav className="sidebar-nav-container">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-btn-tactile ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <Icon size={14} style={{ color: isActive ? 'var(--primary-blue)' : 'var(--text-secondary)', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '9999px',
                    background: isActive ? 'var(--primary-blue)' : '#EADFC9',
                    color: isActive ? '#FFFFFF' : 'var(--text-primary)',
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
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ padding: '0 0.4rem', fontSize: '0.625rem', fontWeight: 800, color: '#8C7A68', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <History size={11} /> RECENT QUESTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {RECENT_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQueryClick(q)}
                className="recent-question-chip"
              >
                • {q}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ padding: '0 0.4rem', fontSize: '0.625rem', fontWeight: 800, color: '#8C7A68', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={11} /> QUICK FILTERS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {QUICK_FILTERS.map((f, idx) => (
              <button
                key={idx}
                onClick={() => handleQueryClick(f)}
                className="quick-filter-btn"
              >
                ⚡ {f}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info card */}
        <div style={{
          marginTop: 'auto',
          background: '#FCFAF5',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '0.6rem',
          fontSize: '0.7rem',
          boxShadow: '0 1px 2px rgba(45,36,30,0.03)'
        }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: 800 }}>SkyLark</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Deals & Work Orders Sync</div>
        </div>
      </aside>
      </>
    );
  }
