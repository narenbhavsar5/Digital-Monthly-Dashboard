import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import {
  Users, DollarSign, TrendingDown, BookOpen, ChevronLeft, ChevronRight,
  Briefcase, AlertTriangle, Target, UserPlus, Clock, ArrowUpDown
} from 'lucide-react';
import { GET_REGIONS, GET_DASHBOARD_DATA, GET_ATTRITION_TRENDS, GET_REVENUE_TRENDS } from '../graphql/queries';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6'];

const formatCurrency = (v) => {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
};

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
      background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '0.8rem'
    }}>
      <p style={{ color: '#94a3b8', marginBottom: '4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

function GroupedTable({ data, title, icon: Icon }) {
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

  return (
    <div className="section-card">
      <div className="section-card-header">
        <span className="section-card-title"><Icon size={16} />{title}</span>
        <span className="badge badge-inprogress">{totalCount} total</span>
      </div>
      <div className="section-card-body" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr><th>Account</th><th>Location</th><th>Count</th></tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([skill, items]) => (
              <React.Fragment key={skill}>
                <tr className="skill-group-header">
                  <td colSpan={3}>{skill} ({items.reduce((a, b) => a + b.count, 0)})</td>
                </tr>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.account}</td>
                    <td>{item.location}</td>
                    <td style={{ fontWeight: 600 }}>{item.count}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title"><Briefcase size={16} /> Pre-Sales Pipeline</span>
                <span className="badge badge-inprogress">{(dashboard?.preSales || []).length} items</span>
              </div>
              <div className="section-card-body">
                <div className="presales-list">
                  {(dashboard?.preSales || []).map(ps => (
                    <div key={ps.id} className="presales-item">
                      <div className="presales-item-header">
                        <span className="presales-item-title">{ps.title}</span>
                        <span className={getBadgeClass(ps.status)}>{ps.status}</span>
                      </div>
                      <div className="presales-item-meta">
                        <span className={getBadgeClass(ps.type)}>{ps.type}</span>
                        <span>Client: {ps.client}</span>
                        <span className="presales-item-value">{formatCurrency(ps.value)}</span>
                      </div>
                    </div>
                  ))}
                  {(dashboard?.preSales || []).length === 0 && (
                    <div className="empty-state"><p>No pre-sales data for this period</p></div>
                  )}
                </div>
              </div>
            </div>

            {/* Tables: Open Roles, Releases, New Hires, Bench */}
            <div className="tables-grid">
              <GroupedTable data={dashboard?.openRoles || []} title="Open Roles" icon={Target} />
              <GroupedTable data={dashboard?.upcomingReleases || []} title="Upcoming Releases" icon={ArrowUpDown} />
              <GroupedTable data={dashboard?.newHires || []} title="New Hires" icon={UserPlus} />
              <GroupedTable data={dashboard?.benchResources || []} title="Bench Resources" icon={Clock} />
            </div>

            {/* Action Plans */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title"><Target size={16} /> Action Plans</span>
              </div>
              <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(dashboard?.actionPlans || []).map(ap => (
                  <div key={ap.id} className="action-plan-item">
                    <div className={`action-plan-priority-dot ${ap.priority.toLowerCase()}`} />
                    <div className="action-plan-content">
                      <div className="action-plan-title">{ap.actionItem}</div>
                      <div className="action-plan-meta">
                        <span>Assigned: {ap.assignedTo}</span>
                        <span>Due: {ap.dueDate || 'N/A'}</span>
                      </div>
                    </div>
                    <span className={getBadgeClass(ap.status)}>{ap.status}</span>
                    <span className={`badge badge-${ap.priority.toLowerCase()}`}>{ap.priority}</span>
                  </div>
                ))}
                {(dashboard?.actionPlans || []).length === 0 && (
                  <div className="empty-state"><p>No action plans for this period</p></div>
                )}
              </div>
            </div>

            {/* Challenges */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title"><AlertTriangle size={16} /> Challenges</span>
              </div>
              <div className="section-card-body">
                <div className="challenges-grid">
                  {(dashboard?.challenges || []).map(ch => (
                    <div key={ch.id} className={`challenge-card severity-${ch.severity.toLowerCase()}`}>
                      <div className="challenge-card-title">
                        {ch.title}
                        <span className={`badge badge-${ch.severity.toLowerCase()}`}>{ch.severity}</span>
                      </div>
                      {ch.description && <div className="challenge-card-desc">{ch.description}</div>}
                      {ch.mitigation && (
                        <div className="challenge-card-mitigation">
                          <strong>Mitigation:</strong> {ch.mitigation}
                        </div>
                      )}
                    </div>
                  ))}
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
