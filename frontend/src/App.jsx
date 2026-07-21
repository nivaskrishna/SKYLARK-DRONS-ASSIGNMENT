import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import CommandPalette from './components/CommandPalette';

import DashboardView from './components/DashboardView';
import OverviewView from './components/OverviewView';
import ChatInterface from './components/ChatInterface';
import LeadershipUpdateView from './components/LeadershipUpdateView';
import PipelineIntelligenceView from './components/PipelineIntelligenceView';
import RevenueAnalyticsView from './components/RevenueAnalyticsView';
import DataQualityView from './components/DataQualityView';
import RiskCenterView from './components/RiskCenterView';

import './styles/theme.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const loadDashboard = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const endpoint = force ? `${API_BASE}/api/boards/refresh` : `${API_BASE}/api/dashboard`;
      const res = await fetch(endpoint);
      const json = await res.json();

      if (json.status === 'success') {
        setDashboardData(json.data || json);
      } else {
        setError(json.detail || 'Failed to fetch Monday board data.');
      }
    } catch (err) {
      setError(`Cannot connect to FastAPI backend: ${err.message}. Make sure server is running on port 8000.`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard(false);
  }, []);

  const handleSelectQuery = (q) => {
    setSelectedQuery(q);
    setActiveTab('chat');
  };

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <Navbar
        onRefresh={() => loadDashboard(true)}
        isRefreshing={isRefreshing}
        dashboardData={dashboardData}
        onOpenCommandPalette={() => setIsCmdOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        isSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Body Layout */}
      <div className="app-body">
        {/* Left Sidebar */}
        <LeftSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectQuery={handleSelectQuery}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Main Content Area (Spacious Workspace with Max Width 1600px) */}
        <main className="main-container">
          <div className="content-inner">
            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                color: '#991B1B',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>⚠️ {error}</span>
                <button
                  onClick={() => loadDashboard(true)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#111827',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  Retry Sync
                </button>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px', color: '#6B7280', fontSize: '0.95rem', fontWeight: 500 }}>
                Synchronizing with Monday.com API & Gemini Analyst Engine...
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardView data={dashboardData} onSelectQuery={handleSelectQuery} setActiveTab={setActiveTab} />}
                {activeTab === 'overview' && <OverviewView data={dashboardData} onSelectQuery={handleSelectQuery} setActiveTab={setActiveTab} />}
                {activeTab === 'chat' && (
                  <ChatInterface
                    dashboardData={dashboardData}
                    defaultQuery={selectedQuery}
                    setActiveTab={setActiveTab}
                    clearDefaultQuery={() => setSelectedQuery('')}
                  />
                )}
                {activeTab === 'leadership' && <LeadershipUpdateView />}
                {activeTab === 'pipeline' && <PipelineIntelligenceView data={dashboardData} />}
                {activeTab === 'revenue' && <RevenueAnalyticsView data={dashboardData} />}
                {activeTab === 'workorders' && <DashboardView data={dashboardData} onSelectQuery={handleSelectQuery} setActiveTab={setActiveTab} />}
                {activeTab === 'crossboard' && <DashboardView data={dashboardData} onSelectQuery={handleSelectQuery} setActiveTab={setActiveTab} />}
                {activeTab === 'quality' && <DataQualityView report={dashboardData?.data_quality_report} />}
                {activeTab === 'risk' && <RiskCenterView data={dashboardData} />}
                {activeTab === 'settings' && (
                  <div className="bright-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>Platform Settings</h2>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Configured Monday.com Boards: Deals (`5030094798`), Work Orders (`5030094819`).
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Footer */}
            <footer style={{
              marginTop: 'auto',
              paddingTop: '1.25rem',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.775rem',
              color: '#9CA3AF'
            }}>
              <div>SkyLark AI Business Intelligence Engine v1.0</div>
              <div>Powered by <strong>Monday.com</strong> • <strong>Gemini</strong></div>
            </footer>
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectQuery={handleSelectQuery}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
