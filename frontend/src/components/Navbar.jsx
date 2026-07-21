import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Command, CheckCircle2, ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing, dashboardData, onOpenCommandPalette, onToggleSidebar, isSidebarOpen }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const healthScore = dashboardData?.business_health_score || 88;

  return (
    <header style={{
      height: '56px',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      flexShrink: 0,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Brand Box + Mobile Toggle */}
      <div style={{
        width: '200px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0 0.75rem',
        borderRight: '1px solid var(--border-color)',
        flexShrink: 0,
        background: 'var(--bg-card)',
        boxSizing: 'border-box'
      }}>
        {/* Mobile Toggle Button */}
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px'
          }}
          className="mobile-toggle-btn"
          aria-label="Toggle Navigation"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--secondary-indigo) 0%, var(--primary-blue) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(178, 94, 48, 0.3)',
          flexShrink: 0
        }}>
          {/* Drone SVG - quadcopter top view */}
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Arms */}
            <line x1="16" y1="16" x2="6" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="26" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="6" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="26" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            {/* Propeller circles */}
            <circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
            <circle cx="26" cy="6" r="4" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
            <circle cx="6" cy="26" r="4" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
            <circle cx="26" cy="26" r="4" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
            {/* Body */}
            <rect x="12" y="12" width="8" height="8" rx="2" fill="white"/>
            {/* Center dot (camera) */}
            <circle cx="16" cy="16" r="1.5" fill="var(--primary-blue)"/>
          </svg>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.925rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'Plus Jakarta Sans', whiteSpace: 'nowrap' }}>
            SkyLark
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            AI BI Platform
          </div>
        </div>
      </div>

      {/* Main Controls Area */}
      <div style={{
        flex: 1,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        boxSizing: 'border-box'
      }}>
        {/* Compact Search Bar */}
        <div style={{ flex: 1, maxWidth: '260px' }}>
          <button
            onClick={onOpenCommandPalette}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              border: '1px solid #E5E7EB',
              borderRadius: '7px',
              padding: '0.35rem 0.6rem',
              color: '#6B7280',
              fontSize: '0.775rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Search size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>Search deals, work orders...</span>
            </div>
            <kbd style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              padding: '0.05rem 0.3rem',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '0.15rem',
              flexShrink: 0
            }}>
              <Command size={9} /> K
            </kbd>
          </button>
        </div>

        {/* Compact Right Controls - 100% VISIBLE ON SCREEN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Health Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: '#F0FDF4',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            borderRadius: '6px',
            padding: '0.25rem 0.45rem',
            fontSize: '0.7rem',
            color: '#16A34A',
            fontWeight: 700
          }}>
            <ShieldCheck size={12} />
            <span>Health: {healthScore}/100</span>
          </div>

          {/* Monday API Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: '#EFF6FF',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '6px',
            padding: '0.25rem 0.45rem',
            fontSize: '0.7rem',
            color: '#2563EB',
            fontWeight: 600
          }}>
            <CheckCircle2 size={11} style={{ color: '#16A34A' }} />
            <span>Monday API Live</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '0.25rem 0.55rem',
              color: '#111827',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <RefreshCw size={11} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', color: '#2563EB' }} />
            <span>Refresh</span>
          </button>

          {/* Clock */}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>
            {timeStr}
          </div>

          {/* Profile Avatar */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.725rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            EX
          </div>
        </div>
      </div>
    </header>
  );
}
