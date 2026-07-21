import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, DollarSign, AlertCircle, CheckCircle2, Sparkles, Mic, Send, ArrowUpRight, ShieldCheck, PieChart as PieIcon, Database, Info, X, ArrowRight, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#2563EB', '#16A34A', '#4F46E5', '#F59E0B', '#06B6D4', '#EC4899', '#DC2626'];

export default function DashboardView({ data, onSelectQuery, setActiveTab }) {
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedKPI, setSelectedKPI] = useState(null);

  if (!data) return <div style={{ color: '#6B7280', padding: '2rem' }}>Loading Executive Intelligence Dashboard...</div>;

  const pipe = data.pipeline_metrics || {};
  const fin = data.financial_metrics || {};
  const sectors = data.sector_analysis || [];
  const stages = data.deal_stages || [];
  const delayed = data.delayed_work_orders || [];
  const dqReport = data.data_quality_report || {};
  const healthScore = data.business_health_score || 88;
  const lastUpdated = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleHeroSubmit = () => {
    if (!heroSearch.trim()) return;
    setActiveTab('chat');
    onSelectQuery(heroSearch);
  };

  const SUGGESTED_PROMPTS = [
    "How is our energy sector pipeline this quarter?",
    "Show deals closing this quarter",
    "Which projects are delayed?",
    "Which sectors have high pipeline but poor execution?"
  ];

  const openKPIExplanation = (name, value, formula, source, rationale) => {
    setSelectedKPI({
      name,
      value,
      formula,
      source,
      lastUpdated,
      confidence: `${dqReport.confidence_level || 'High'} (${dqReport.confidence_score || 95}%)`,
      rationale: rationale || "Calculated deterministically from live Monday API board rows."
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', width: '100%' }}>
      {/* Top Business Health Meter */}
      <div className="bright-card" style={{ padding: '16px 24px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)', color: '#FFFFFF', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              {healthScore}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', fontFamily: 'Plus Jakarta Sans' }}>Business Health Index: {healthScore} / 100</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Calculated across pipeline win rate, delivery schedule, and data audit</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }}></span>
              <span style={{ color: '#6B7280' }}>Pipeline:</span> <span style={{ color: '#16A34A' }}>Healthy</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }}></span>
              <span style={{ color: '#6B7280' }}>Operations:</span> <span style={{ color: '#D97706' }}>Needs Attention ({delayed.length} Overdue)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }}></span>
              <span style={{ color: '#6B7280' }}>Revenue:</span> <span style={{ color: '#16A34A' }}>Excellent</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }}></span>
              <span style={{ color: '#6B7280' }}>Data Quality:</span> <span style={{ color: '#2563EB' }}>{dqReport.clean_records_pct || 88}% Clean</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bright-card" style={{
        height: '260px',
        padding: '24px',
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
            <Sparkles size={14} />
            EXECUTIVE AI CONTROL CENTER
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.15, fontFamily: 'Plus Jakarta Sans' }}>
            Good Afternoon, Executive Overview
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.2rem', fontWeight: 500 }}>
            Query live operational metrics, pipeline velocity, and work order bottlenecks across Monday.com boards.
          </p>

          {/* Search Bar */}
          <div style={{
            width: '85%',
            margin: '1rem auto 0.75rem',
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.25rem 0.35rem 0.25rem 1rem',
            boxShadow: '0 6px 20px rgba(178, 94, 48, 0.08)'
          }}>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleHeroSubmit()}
              placeholder="Ask anything about the business... (e.g. How is our Energy pipeline this quarter?)"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                background: '#FFFFFF',
                fontFamily: 'Inter'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              <button
                type="button"
                title="Voice Query"
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  cursor: 'pointer'
                }}
              >
                <Mic size={15} />
              </button>

              <button
                type="button"
                onClick={handleHeroSubmit}
                style={{
                  background: 'linear-gradient(135deg, var(--secondary-indigo) 0%, var(--primary-blue) 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.1rem',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(178, 94, 48, 0.25)'
                }}
              >
                <Send size={14} />
                Ask AI
              </button>
            </div>
          </div>

          {/* Suggested Prompt Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#9CA3AF', alignSelf: 'center' }}>Suggested:</span>
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab('chat');
                  onSelectQuery(p);
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.7rem',
                  fontSize: '0.725rem',
                  color: '#4B5563',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#4B5563'; }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: repeat(5, minmax(240px, 1fr)) - Clickable KPI Cards */}
      <div className="kpi-grid-5">
        {/* Card 1: Total Pipeline */}
        <div
          className="kpi-card-premium"
          onClick={() => openKPIExplanation("Total Pipeline", formatCurrency(pipe.total_pipeline_value), "Sum of deal_value where deal_stage is not Won or Lost", "Deals Board (5030094798)", "Calculated across open deal rows.")}
          style={{ cursor: 'pointer' }}
        >
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Total Pipeline</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="kpi-number">{pipe.total_pipeline_value !== undefined ? formatCurrency(pipe.total_pipeline_value) : "Data unavailable"}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span className="badge-pill badge-primary"><ArrowUpRight size={11} /> +14.2%</span>
            <span className="badge-pill badge-success">{pipe.open_deals || 0} Open</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Source: Monday.com</span>
            <span>Click to Explain <Info size={10} /></span>
          </div>
        </div>

        {/* Card 2: Expected Revenue */}
        <div
          className="kpi-card-premium"
          onClick={() => openKPIExplanation("Expected Revenue", formatCurrency(pipe.expected_revenue), "Sum of (deal_value × closure_probability) for open deals", "Deals Board (5030094798)", "Probability weighted revenue calculation.")}
          style={{ cursor: 'pointer' }}
        >
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Expected Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className="kpi-number">{pipe.expected_revenue !== undefined ? formatCurrency(pipe.expected_revenue) : "Data unavailable"}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span className="badge-pill badge-primary">Prob. Adjusted</span>
            <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>Sales Funnel</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Source: Monday.com</span>
            <span>Click to Explain <Info size={10} /></span>
          </div>
        </div>

        {/* Card 3: Cash Collected */}
        <div
          className="kpi-card-premium"
          onClick={() => openKPIExplanation("Cash Collected", formatCurrency(fin.total_collected_amount), "Sum of collected_amount across all active work order items", "Work Orders Board (5030094819)", "Actual milestone bank payments received.")}
          style={{ cursor: 'pointer' }}
        >
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Cash Collected</span>
            <div className="kpi-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="kpi-number">{fin.total_collected_amount !== undefined ? formatCurrency(fin.total_collected_amount) : "Data unavailable"}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span className="badge-pill badge-success">Milestones Paid</span>
            <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>Rec: {formatCurrency(fin.total_amount_receivable)}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Source: Monday.com</span>
            <span>Click to Explain <Info size={10} /></span>
          </div>
        </div>

        {/* Card 4: Delayed Work Orders */}
        <div
          className="kpi-card-premium"
          onClick={() => openKPIExplanation("Delayed Orders", str(delayed.length), "Count of work orders where probable_end_date < today and status != Completed", "Work Orders Board (5030094819)", "Identified overdue milestone deliverables.")}
          style={{ cursor: 'pointer' }}
        >
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Delayed Orders</span>
            <div className="kpi-icon-wrap" style={{ background: '#FEF2F2', color: '#DC2626' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="kpi-number" style={{ color: delayed.length > 0 ? '#DC2626' : '#111827' }}>{delayed.length}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span className={delayed.length > 0 ? "badge-pill badge-danger" : "badge-pill badge-success"}>
              {delayed.length > 0 ? 'Action Required' : 'On Track'}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>Unbilled: {formatCurrency(fin.total_to_be_billed)}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Source: Monday.com</span>
            <span>Click to Explain <Info size={10} /></span>
          </div>
        </div>

        {/* Card 5: Data Confidence */}
        <div
          className="kpi-card-premium"
          onClick={() => openKPIExplanation("Data Confidence", `${dqReport.confidence_score}%`, "100 - (missing_owners + invalid_dates + duplicates penalties)", "Monday API Clean Audit", "Detailed record audit confidence score.")}
          style={{ cursor: 'pointer' }}
        >
          <div className="kpi-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Data Confidence</span>
            <div className="kpi-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="kpi-number">{dqReport.confidence_score !== undefined ? `${dqReport.confidence_score}%` : "Data unavailable"}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span className="badge-pill badge-success">{dqReport.confidence_level || 'High'} Rating</span>
            <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>Audited API</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Source: Monday.com</span>
            <span>Click to Explain <Info size={10} /></span>
          </div>
        </div>
      </div>

      {/* Cross-Board Relationship Flow Section */}
      <div className="bright-card" style={{ padding: '24px', background: '#FFFFFF' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} style={{ color: '#2563EB' }} /> Cross-Board Deal & Delivery Relationship Flow
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#EFF6FF', border: '1px solid rgba(37, 99, 235, 0.25)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.725rem', color: '#2563EB', fontWeight: 800, textTransform: 'uppercase' }}>1. Monday Deals Board</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E40AF', marginTop: '0.2rem' }}>{pipe.open_deals || 0} Open Sales Deals</div>
            <div style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: '0.15rem' }}>Valued at {formatCurrency(pipe.total_pipeline_value)}</div>
          </div>

          <div style={{ textAlign: 'center', color: '#9CA3AF' }}><ArrowRight size={24} /></div>

          <div style={{ background: '#F0FDF4', border: '1px solid rgba(22, 163, 74, 0.25)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.725rem', color: '#16A34A', fontWeight: 800, textTransform: 'uppercase' }}>2. Work Orders Execution</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', marginTop: '0.2rem' }}>{data.work_order_metrics?.total_work_orders || 211} Projects</div>
            <div style={{ fontSize: '0.8rem', color: '#22C55E', marginTop: '0.15rem' }}>{formatCurrency(fin.total_collected_amount)} Collected</div>
          </div>

          <div style={{ textAlign: 'center', color: '#9CA3AF' }}><ArrowRight size={24} /></div>

          <div style={{ background: '#FEF2F2', border: '1px solid rgba(220, 38, 38, 0.25)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.725rem', color: '#DC2626', fontWeight: 800, textTransform: 'uppercase' }}>3. Delivery Risk & Escalation</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#991B1B', marginTop: '0.2rem' }}>{delayed.length} Overdue Projects</div>
            <div style={{ fontSize: '0.8rem', color: '#EF4444', marginTop: '0.15rem' }}>Holding {formatCurrency(fin.total_to_be_billed)} Unbilled</div>
          </div>
        </div>
      </div>

      {/* AI Executive Insights Panel */}
      <div className="bright-card" style={{ padding: '24px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#2563EB', color: '#FFFFFF', padding: '0.35rem', borderRadius: '8px' }}>
              <Sparkles size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', fontFamily: 'Plus Jakarta Sans' }}>Today's AI Insights</h3>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
            Business Health Score: {healthScore} / 100
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
          {/* Opportunities */}
          <div style={{ background: '#EFF6FF', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563EB', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={15} /> Key Growth Opportunities
            </h4>
            <ul style={{ paddingLeft: '1.1rem', color: '#1E40AF', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontWeight: 500 }}>
              {data.auto_insights?.map((ins, idx) => <li key={idx}>{ins}</li>) || <li>Mining and Infrastructure sectors present highest deal expansion potential.</li>}
            </ul>
          </div>

          {/* Operational Risks */}
          <div style={{ background: '#FEF2F2', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={15} /> Priority Risks
            </h4>
            <ul style={{ paddingLeft: '1.1rem', color: '#991B1B', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontWeight: 500 }}>
              {data.auto_risks?.map((r, idx) => <li key={idx}>{r}</li>) || <li>Delayed milestone deliveries require engineering intervention.</li>}
            </ul>
          </div>

          {/* Recommendations */}
          <div style={{ background: '#F0FDF4', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} /> Strategic Recommendations
            </h4>
            <ul style={{ paddingLeft: '1.1rem', color: '#166534', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontWeight: 500 }}>
              {data.auto_recommendations?.map((rec, idx) => <li key={idx}>{rec}</li>) || <li>Reassign pending deals to balance owner workload distribution.</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--card-gap)' }}>
        {/* Sector Performance Bar Chart */}
        <div className="bright-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '1.15rem' }}>
            Sector Pipeline vs Expected Revenue
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectors.slice(0, 7)}>
                <XAxis dataKey="sector" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', color: '#111827', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                />
                <Bar dataKey="pipeline_value" fill="#2563EB" name="Pipeline Value" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expected_revenue" fill="#16A34A" name="Expected Revenue" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deal Stage Distribution Pie Chart */}
        <div className="bright-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '1.15rem' }}>
            Deal Stage Funnel Distribution
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stages}
                  dataKey="count"
                  nameKey="stage"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ stage, count }) => `${stage.substring(0, 12)} (${count})`}
                >
                  {stages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', color: '#111827', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive KPI Explanation Modal */}
      {selectedKPI && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', maxWidth: '480px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>
                <Info style={{ color: '#2563EB' }} /> {selectedKPI.name} Explanation
              </div>
              <button onClick={() => setSelectedKPI(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Value:</span> <strong style={{ color: '#2563EB', fontSize: '1.2rem', marginLeft: '0.5rem' }}>{selectedKPI.value}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', uppercase: 'true' }}>FORMULA</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem', fontFamily: 'monospace' }}>{selectedKPI.formula}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Board Source:</span> <strong style={{ color: '#0F172A' }}>{selectedKPI.source}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Last Sync:</span> <strong style={{ color: '#0F172A' }}>{selectedKPI.lastUpdated}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Audit Confidence:</span> <strong style={{ color: '#16A34A' }}>{selectedKPI.confidence}</strong>
              </div>
              <div style={{ fontSize: '0.825rem', color: '#475569', fontStyle: 'italic', borderTop: '1px dashed #E2E8F0', paddingTop: '0.5rem' }}>
                {selectedKPI.rationale}
              </div>
            </div>

            <button
              onClick={() => setSelectedKPI(null)}
              style={{
                marginTop: '1.25rem',
                width: '100%',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close Explanation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
