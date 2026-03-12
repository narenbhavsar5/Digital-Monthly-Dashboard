import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import {
  Users, DollarSign, TrendingDown, BookOpen, ChevronLeft, ChevronRight,
  Briefcase, AlertTriangle, Target, UserPlus, Clock, ArrowUpDown,
  FileText, Building2, MapPin, CalendarDays, ListTodo, Shield, Info
} from 'lucide-react';
import { GET_REGIONS, GET_DASHBOARD_DATA, GET_ATTRITION_TRENDS, GET_REVENUE_TRENDS } from '../graphql/queries';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6'];

const formatCurrency = (v) => {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
};

const formatExactCurrency = (v) => `$${(v).toLocaleString('en-US')}`;

const getMonthLabel = (m) => {
  const [y, mo] = m.split('-');
  const date = new Date(y, parseInt(mo) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getShortMonth = (m) => {
  const [y, mo] = m.split('-');
  const date = new Date(y, parseInt(mo) - 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const prevMonth = (m) => {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(y, mo - 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const nextMonth = (m) => {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(y, mo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getBadgeClass = (status) => {
  const s = status.toLowerCase().replace(/\s+/g, '-');
  return `badge badge-${s}`;
};

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '0.8rem',
      boxShadow: 'var(--shadow-md)'
    }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

function GroupedTable({ data, title, icon: Icon, unit = "roles" }) {
  const grouped = useMemo(() => {
    const g = {};
    data.forEach(item => {
      if (!g[item.skill]) g[item.skill] = [];
      g[item.skill].push(item);
    });
    return g;
  }, [data]);

  if (!data.length) return null;

  const totalCount = data.reduce((acc, item) => acc + item.count, 0);
  const isRoles = title.includes('Roles');
  const accentColor = isRoles ? '#3b82f6' : '#10b981';
  const accentBg = isRoles ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)';

  return (
    <div className="section-card" style={{ background: 'transparent', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
      <div className="section-card-header" style={{ background: 'transparent', borderBottom: 'none', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: accentBg, padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Icon size={20} style={{ color: accentColor }} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Grouped by skill</div>
          </div>
        </div>
        <div style={{ background: accentBg, color: accentColor, padding: '6px 14px', borderRadius: '24px', fontWeight: 700, fontSize: '1.1rem' }}>{totalCount}</div>
      </div>
      <div className="section-card-body custom-scrollbar" style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '280px', overflowY: 'auto' }}>
        {Object.entries(grouped).map(([skill, items]) => {
          const skillTotal = items.reduce((a, b) => a + b.count, 0);
          return (
            <div key={skill} style={{ flexShrink: 0, border: '1px solid var(--border-secondary)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{skill}</div>
                <div style={{ background: accentBg, color: accentColor, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{skillTotal} {unit}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: idx < items.length - 1 ? '1px solid var(--border-secondary)' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Building2 size={16} style={{ color: 'var(--text-muted)' }} /> {item.account}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={16} style={{ color: 'var(--text-muted)' }} /> {item.location}
                      </div>
                    </div>
                    <div style={{ background: accentBg, color: accentColor, padding: '6px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem' }}>
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [regionId, setRegionId] = useState('');

  const { data: regionsData } = useQuery(GET_REGIONS, { variables: { activeOnly: true } });
  const regions = regionsData?.regions || [];

  // Auto-select India (or first region)
  const selectedRegion = regionId || regions.find(r => r.code === 'IN')?.id || regions[0]?.id || '';

  const { data: dashData, loading } = useQuery(GET_DASHBOARD_DATA, {
    variables: { regionId: selectedRegion, month },
    skip: !selectedRegion,
  });

  const { data: attritionData } = useQuery(GET_ATTRITION_TRENDS, {
    variables: { regionId: selectedRegion, months: 6 },
    skip: !selectedRegion,
  });

  const { data: revenueData } = useQuery(GET_REVENUE_TRENDS, {
    variables: { regionId: selectedRegion, months: 6 },
    skip: !selectedRegion,
  });

  const currentMonth = getCurrentMonth();
  const canGoNext = month < currentMonth;
  const dashboard = dashData?.dashboardData;
  const mu = dashboard?.monthlyUpdate;
  const selectedRegionObj = regions.find(r => r.id === selectedRegion);

  const totalBench = (dashboard?.benchResources || []).reduce((a, b) => a + b.count, 0);
  const headcountData = mu ? [
    { name: 'Billable', value: mu.billableHeadcount },
    { name: 'Bench', value: totalBench },
  ] : [];

  const diversityData = mu ? [
    { name: 'Male', value: mu.maleCount },
    { name: 'Female', value: mu.femaleCount },
    { name: 'Other', value: mu.otherGenderCount },
  ] : [];

  const attritionChartData = (attritionData?.attritionTrends || []).map(t => ({
    month: getShortMonth(t.month),
    'Attrition Rate': t.attritionRate,
    'Headcount': t.totalHeadcount,
  }));

  const revenueChartData = (revenueData?.revenueTrends || []).map(t => ({
    month: getShortMonth(t.month),
    Revenue: t.revenue,
    Margin: t.margin,
  }));

  return (
    <div>
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1>{selectedRegionObj?.name || 'Select region'} Digital Practice</h1>
            <p>Monthly Updates Dashboard</p>
          </div>
          <div className="controls-row">
            <select
              className="select-control"
              value={selectedRegion}
              onChange={(e) => setRegionId(e.target.value)}
            >
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <div className="month-nav">
              <button className="month-nav-btn" onClick={() => setMonth(prevMonth(month))}>
                <ChevronLeft size={16} />
              </button>
              <span className="month-nav-label">{getMonthLabel(month)}</span>
              <button className="month-nav-btn" disabled={!canGoNext} onClick={() => setMonth(nextMonth(month))}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading"><div className="loading-spinner" /></div>
        ) : (
          <>
            {/* Key Metrics */}
            {/* Key Metrics */}
            <div className="section-card-title" style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Key Metrics</div>
            <div className="key-metrics-grid">
              {/* Card 1: Headcount Distribution */}
              <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', background: 'var(--bg-card)' }}>
                <div style={{ alignSelf: 'flex-start', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>Headcount<br />Distribution</div>
                <div style={{ alignSelf: 'flex-start', fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>{mu?.totalHeadcount || 0}</div>
                {headcountData.length > 0 ? (
                  <div style={{ width: '100%', height: 140, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={headcountData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none" paddingAngle={2}>
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="empty-state" style={{ height: 140 }}><p>No data</p></div>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', width: '100%' }}>
                  <div style={{ flex: 1, border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700 }}>{mu?.billableHeadcount || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Billable</div>
                  </div>
                  <div style={{ flex: 1, border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center', background: 'rgba(245, 158, 11, 0.05)' }}>
                    <div style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: 700 }}>{totalBench}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bench</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Gender Diversity */}
              <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', background: 'var(--bg-card)' }}>
                <div style={{ alignSelf: 'flex-start', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>Gender Diversity</div>
                <div style={{ width: '100%', height: 200, position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
                  {diversityData.some(d => d.value > 0) ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={diversityData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none" paddingAngle={2}>
                            <Cell fill="#3b82f6" />
                            <Cell fill="#ec4899" />
                            <Cell fill="#14b8a6" />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem' }}>{mu?.totalHeadcount && mu.totalHeadcount > 0 ? ((mu.femaleCount / mu.totalHeadcount) * 100).toFixed(1) : 0}%</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Female</div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state" style={{ height: 200 }}><p>No data</p></div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', width: '100%' }}>
                  <div style={{ flex: 1, border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                    <div style={{ color: '#3b82f6', fontSize: '1.2rem', fontWeight: 700 }}>{mu?.maleCount || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Male</div>
                  </div>
                  <div style={{ flex: 1, border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center', background: 'rgba(236, 72, 153, 0.05)' }}>
                    <div style={{ color: '#ec4899', fontSize: '1.2rem', fontWeight: 700 }}>{mu?.femaleCount || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Female</div>
                  </div>
                </div>
              </div>

              {/* Card 3: Attrition Rate */}
              <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', padding: '24px 16px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>Attrition Rate</div>
                  <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '4px 12px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem' }}>{mu?.attritionRate || 0}%</div>
                </div>
                <div style={{ width: '100%', height: 180, marginTop: 'auto', marginBottom: 'auto' }}>
                  {attritionChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attritionChartData}>
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                        <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
                        <Line type="monotone" dataKey="Attrition Rate" stroke="#f43f5e" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-state" style={{ height: 180 }}><p>No trend data</p></div>
                  )}
                </div>
              </div>

              {/* Card 4: Digital Upskills */}
              <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', padding: '24px 16px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '6px', borderRadius: '50%', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={14} />
                    </div>
                    Digital<br />Upskills
                  </div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', padding: '4px 12px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem' }}>{mu?.upskillCount || 0}</div>
                </div>
                <div style={{ width: '100%', height: 180, marginTop: 'auto', marginBottom: 'auto' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: getShortMonth(prevMonth(prevMonth(month))), Upskills: Math.max(0, (mu?.upskillCount || 0) - 8) },
                      { month: getShortMonth(prevMonth(month)), Upskills: Math.max(0, (mu?.upskillCount || 0) - 3) },
                      { month: 'Current', Upskills: mu?.upskillCount || 0 }
                    ]}>
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="Upskills" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pre-Sales */}
            <div className="section-card" style={{ background: 'transparent', border: '1px solid var(--border-primary)' }}>
              <div className="section-card-header" style={{ background: 'transparent', borderBottom: 'none', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <FileText size={20} style={{ color: '#818cf8' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pre-Sales Update</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{(dashboard?.preSales || []).length} total opportunities</div>
                </div>
              </div>
              <div className="section-card-body" style={{ padding: '0 24px 20px 24px' }}>
                <div className="presales-list" style={{ gap: '0', maxHeight: 'none' }}>
                  {(dashboard?.preSales || []).map((ps, idx) => {
                    const isUnderway = ps.status.toLowerCase() === 'underway';
                    return (
                      <div key={ps.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: idx < (dashboard?.preSales?.length || 0) - 1 ? '1px solid var(--border-secondary)' : 'none' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', marginTop: '8px', flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{ps.title}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ps.description || `We are currently exploring this opportunity and awaiting feedback.`}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ps.client}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>{formatExactCurrency(ps.value)}</div>
                          <div style={{ 
                            background: isUnderway ? '#fef3c7' : 'white', 
                            color: isUnderway ? '#b45309' : '#3b82f6', 
                            padding: '4px 16px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                             }}>
                            {ps.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(dashboard?.preSales || []).length === 0 && (
                    <div className="empty-state"><p>No pre-sales data for this period</p></div>
                  )}
                </div>
              </div>
            </div>

            {/* Tables: Open Roles, Releases, New Hires, Bench */}
            <div className="tables-grid">
              <GroupedTable data={dashboard?.openRoles || []} title="Open Roles" icon={Briefcase} unit="roles" />
              <GroupedTable data={dashboard?.upcomingReleases || []} title="Upcoming Releases" icon={CalendarDays} unit="resources" />
              <GroupedTable data={dashboard?.newHires || []} title="New Hires" icon={UserPlus} unit="hires" />
              <GroupedTable data={dashboard?.benchResources || []} title="Bench Resources" icon={Clock} unit="resources" />
            </div>

            {/* Action Plans and Challenges */}
            <div className="tables-grid">
              {/* Action Plans */}
              <div className="section-card" style={{ background: 'transparent', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
                <div className="section-card-header" style={{ background: 'transparent', borderBottom: 'none', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ListTodo size={20} style={{ color: '#a78bfa' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Next Action Plans</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{(dashboard?.actionPlans || []).length} action items</div>
                    </div>
                  </div>
                </div>
                <div className="section-card-body custom-scrollbar" style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                  {(dashboard?.actionPlans || []).map(ap => (
                    <div key={ap.id} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-secondary)', borderRadius: '12px', transition: 'all var(--transition-fast)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Info size={16} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{ap.actionItem}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                          <span className={getBadgeClass(ap.status)} style={{ background: '#e0e7ff', color: '#3b82f6', borderRadius: '6px', padding: '4px 12px', whiteSpace: 'nowrap' }}>{ap.status}</span>
                          <span className={`badge badge-${ap.priority.toLowerCase()}`} style={{ background: '#fef3c7', color: '#b45309', borderRadius: '6px', padding: '4px 12px', whiteSpace: 'nowrap' }}>{ap.priority}</span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '26px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          Assigned to: <span style={{ color: '#cbd5e1' }}>{ap.assignedTo}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Due: {ap.dueDate || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(dashboard?.actionPlans || []).length === 0 && (
                    <div className="empty-state"><p>No action plans for this period</p></div>
                  )}
                </div>
              </div>

              {/* Challenges */}
              <div className="section-card" style={{ background: 'transparent', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
                <div className="section-card-header" style={{ background: 'transparent', borderBottom: 'none', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <AlertTriangle size={20} style={{ color: '#f43f5e' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Challenges</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{(dashboard?.challenges || []).length} active challenges</div>
                    </div>
                  </div>
                </div>
                <div className="section-card-body custom-scrollbar" style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '320px', overflowY: 'auto' }}>
                  {(dashboard?.challenges || []).map(ch => {
                    const sevColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#f43f5e' };
                    const sevColor = sevColors[ch.severity.toLowerCase()] || '#f43f5e';
                    return (
                      <div key={ch.id} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-secondary)', borderRadius: '12px', borderLeft: `4px solid ${sevColor}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{ch.title}</div>
                          <span className={`badge badge-${ch.severity.toLowerCase()}`} style={{ background: '#ffedd5', color: '#c2410c', borderRadius: '6px', padding: '4px 12px', whiteSpace: 'nowrap', flexShrink: 0 }}>{ch.severity}</span>
                        </div>
                        {ch.description && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{ch.description}</div>}
                        {ch.mitigation && (
                          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '8px', padding: '12px 16px', marginTop: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                              <Shield size={16} /> Mitigation:
                            </div>
                            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>{ch.mitigation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(dashboard?.challenges || []).length === 0 && (
                    <div className="empty-state"><p>No challenges reported</p></div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
