import React, { useState, useEffect } from 'react';
import { Search, X, MessageSquareText, FileSpreadsheet, TrendingUp, DollarSign, Briefcase } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onSelectQuery, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setSearchTerm('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    { title: 'Show pipeline by sector', category: 'Analytics', type: 'query' },
    { title: 'Top 10 clients by revenue', category: 'Analytics', type: 'query' },
    { title: 'Revenue forecast for this quarter', category: 'Forecasting', type: 'query' },
    { title: 'Delayed work orders requiring escalation', category: 'Work Orders', type: 'query' },
    { title: 'Operational bottlenecks & owner workloads', category: 'Operations', type: 'query' },
    { title: 'Generate Executive Leadership Update', category: 'Reports', type: 'tab', tab: 'leadership' },
    { title: 'Open Data Quality Audit Panel', category: 'System', type: 'tab', tab: 'quality' },
    { title: 'Open Risk Center Dashboard', category: 'System', type: 'tab', tab: 'risk' }
  ];

  const filtered = COMMANDS.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #E5E7EB', gap: '0.75rem' }}>
          <Search size={20} style={{ color: '#2563EB' }} />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command or ask a business question..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#111827',
              fontFamily: 'Inter'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>
              No matching commands or queries found.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.type === 'query') {
                    setActiveTab('chat');
                    onSelectQuery(item.title);
                  } else if (item.type === 'tab') {
                    setActiveTab(item.tab);
                  }
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageSquareText size={16} style={{ color: '#2563EB' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{item.title}</span>
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#6B7280', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
