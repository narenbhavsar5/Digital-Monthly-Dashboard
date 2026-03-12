import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  ChevronLeft, ChevronRight, Plus, Edit2, Trash2, GripVertical, Save, X
} from 'lucide-react';
import {
  GET_REGIONS, GET_MONTHLY_UPDATE, GET_PRE_SALES_LIST, GET_ACTION_PLANS,
  GET_OPEN_ROLES, GET_UPCOMING_RELEASES, GET_NEW_HIRES, GET_BENCH_RESOURCES, GET_CHALLENGES,
  UPSERT_MONTHLY_UPDATE,
  CREATE_PRE_SALES, UPDATE_PRE_SALES, DELETE_PRE_SALES, REORDER_PRE_SALES,
  CREATE_ACTION_PLAN, UPDATE_ACTION_PLAN, DELETE_ACTION_PLAN, REORDER_ACTION_PLANS,
  CREATE_OPEN_ROLE, UPDATE_OPEN_ROLE, DELETE_OPEN_ROLE,
  CREATE_UPCOMING_RELEASE, UPDATE_UPCOMING_RELEASE, DELETE_UPCOMING_RELEASE,
  CREATE_NEW_HIRE, UPDATE_NEW_HIRE, DELETE_NEW_HIRE,
  CREATE_BENCH_RESOURCE, UPDATE_BENCH_RESOURCE, DELETE_BENCH_RESOURCE,
  CREATE_CHALLENGE, UPDATE_CHALLENGE, DELETE_CHALLENGE,
} from '../graphql/queries';

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
const getMonthLabel = (m) => {
  const [y, mo] = m.split('-');
  return new Date(y, parseInt(mo) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
const prevMonth = (m) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo - 2); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
const nextMonth = (m) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };

const TABS = [
  'Monthly Summary', 'Pre-Sales', 'Open Roles', 'Releases',
  'New Hires', 'Bench', 'Action Plans', 'Challenges'
];

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ---- MONTHLY SUMMARY TAB ----
function MonthlySummaryTab({ regionId, month }) {
  const { data, loading } = useQuery(GET_MONTHLY_UPDATE, { variables: { regionId, month }, skip: !regionId });
  const [upsert] = useMutation(UPSERT_MONTHLY_UPDATE);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    revenue: 0, margin: 0, totalHeadcount: 0, billableHeadcount: 0, nonBillableHeadcount: 0,
    maleCount: 0, femaleCount: 0, otherGenderCount: 0, attritionRate: 0, upskillCount: 0,
  });

  useEffect(() => {
    if (data?.monthlyUpdate) {
      const mu = data.monthlyUpdate;
      setForm({
        revenue: mu.revenue, margin: mu.margin, totalHeadcount: mu.totalHeadcount,
        billableHeadcount: mu.billableHeadcount, nonBillableHeadcount: mu.nonBillableHeadcount,
        maleCount: mu.maleCount, femaleCount: mu.femaleCount, otherGenderCount: mu.otherGenderCount,
        attritionRate: mu.attritionRate, upskillCount: mu.upskillCount,
      });
    } else {
      setForm({ revenue: 0, margin: 0, totalHeadcount: 0, billableHeadcount: 0, nonBillableHeadcount: 0, maleCount: 0, femaleCount: 0, otherGenderCount: 0, attritionRate: 0, upskillCount: 0 });
    }
  }, [data]);

  const handleSave = async () => {
    await upsert({
      variables: { input: { regionId, month, ...form } },
      refetchQueries: [{ query: GET_MONTHLY_UPDATE, variables: { regionId, month } }],
    });
    setToast({ message: 'Monthly summary saved!', type: 'success' });
  };

  if (loading) return <div className="loading"><div className="loading-spinner" /></div>;

  const field = (label, key, type = 'number') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))} />
    </div>
  );

  return (
    <div>
      <div className="form-row">{field('Revenue ($)', 'revenue')}{field('Margin (%)', 'margin')}</div>
      <div className="form-row-3">{field('Total Headcount', 'totalHeadcount')}{field('Billable', 'billableHeadcount')}{field('Non-Billable', 'nonBillableHeadcount')}</div>
      <div className="form-row-3">{field('Male Count', 'maleCount')}{field('Female Count', 'femaleCount')}{field('Other Gender', 'otherGenderCount')}</div>
      <div className="form-row">{field('Attrition Rate (%)', 'attritionRate')}{field('Upskill Count', 'upskillCount')}</div>
      <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Summary</button>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ---- GENERIC CRUD TAB ----
function CrudTab({ regionId, month, queryDef, createMut, updateMut, deleteMut, fields, itemKey, reorderMut }) {
  const { data, loading, refetch } = useQuery(queryDef, { variables: { regionId, month }, skip: !regionId });
  const [create] = useMutation(createMut);
  const [update] = useMutation(updateMut);
  const [remove] = useMutation(deleteMut);
  const [reorder] = useMutation(reorderMut || CREATE_PRE_SALES); // fallback
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const items = data ? data[itemKey] || [] : [];
  const dataKey = itemKey;

  const emptyForm = () => {
    const f = {};
    fields.forEach(fd => { f[fd.key] = fd.default || ''; });
    return f;
  };
  const [form, setForm] = useState(emptyForm());

  const handleCreate = async () => {
    const input = { regionId, month };
    fields.forEach(fd => {
      let val = form[fd.key];
      if (fd.type === 'number') val = parseFloat(val) || 0;
      if (fd.type === 'int') val = parseInt(val) || 0;
      input[fd.key] = val;
    });
    if (reorderMut) input.displayOrder = items.length;
    await create({ variables: { input } });
    refetch();
    setForm(emptyForm());
    setShowForm(false);
    setToast({ message: 'Item created!', type: 'success' });
  };

  const handleUpdate = async () => {
    const input = { regionId, month };
    fields.forEach(fd => {
      let val = form[fd.key];
      if (fd.type === 'number') val = parseFloat(val) || 0;
      if (fd.type === 'int') val = parseInt(val) || 0;
      input[fd.key] = val;
    });
    if (reorderMut) input.displayOrder = editing.displayOrder || 0;
    await update({ variables: { id: editing.id, input } });
    refetch();
    setEditing(null);
    setShowForm(false);
    setForm(emptyForm());
    setToast({ message: 'Item updated!', type: 'success' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await remove({ variables: { id } });
    refetch();
    setToast({ message: 'Item deleted!', type: 'success' });
  };

  const startEdit = (item) => {
    const f = {};
    fields.forEach(fd => { f[fd.key] = item[fd.key] ?? fd.default ?? ''; });
    setForm(f);
    setEditing(item);
    setShowForm(true);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || !reorderMut) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const orderItems = reordered.map((item, i) => ({ id: item.id, displayOrder: i }));
    await reorder({ variables: { items: orderItems } });
    refetch();
  };

  if (loading) return <div className="loading"><div className="loading-spinner" /></div>;

  const renderForm = () => (
    <div className="section-card" style={{ marginBottom: 20 }}>
      <div className="section-card-header">
        <span className="section-card-title">{editing ? 'Edit' : 'Add New'} Item</span>
        <button className="btn-icon" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm()); }}>
          <X size={14} />
        </button>
      </div>
      <div className="section-card-body">
        <div className="form-row">
          {fields.map(fd => (
            <div key={fd.key} className="form-group">
              <label className="form-label">{fd.label}</label>
              {fd.options ? (
                <select className="form-select" value={form[fd.key]} onChange={e => setForm(f => ({ ...f, [fd.key]: e.target.value }))}>
                  {fd.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : fd.type === 'textarea' ? (
                <textarea className="form-textarea" value={form[fd.key]} onChange={e => setForm(f => ({ ...f, [fd.key]: e.target.value }))} />
              ) : (
                <input className="form-input" type={fd.type === 'number' || fd.type === 'int' ? 'number' : 'text'}
                  value={form[fd.key]} onChange={e => setForm(f => ({ ...f, [fd.key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={editing ? handleUpdate : handleCreate}>
            <Save size={14} /> {editing ? 'Update' : 'Create'}
          </button>
          <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm()); }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const hasDragDrop = !!reorderMut;

  return (
    <div>
      {!showForm && (
        <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => { setForm(emptyForm()); setEditing(null); setShowForm(true); }}>
          <Plus size={14} /> Add Item
        </button>
      )}
      {showForm && renderForm()}

      {hasDragDrop ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(prov, snap) => (
                      <div ref={prov.innerRef} {...prov.draggableProps}
                        className={`action-plan-item draggable-item ${snap.isDragging ? 'dragging' : ''}`}>
                        <div {...prov.dragHandleProps} className="drag-handle"><GripVertical size={16} /></div>
                        <div className="action-plan-content">
                          <div className="action-plan-title">
                            {fields.map(fd => fd.primary && item[fd.key]).filter(Boolean).join(' — ') || item[fields[0].key]}
                          </div>
                          <div className="action-plan-meta">
                            {fields.filter(fd => !fd.primary).slice(0, 3).map(fd => (
                              <span key={fd.key}>{fd.label}: {item[fd.key]}</span>
                            ))}
                          </div>
                        </div>
                        <button className="btn-icon" onClick={() => startEdit(item)}><Edit2 size={14} /></button>
                        <button className="btn-icon" onClick={() => handleDelete(item.id)} style={{ color: 'var(--accent-rose)' }}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="section-card">
          <div className="section-card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  {fields.map(fd => <th key={fd.key}>{fd.label}</th>)}
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    {fields.map(fd => <td key={fd.key}>{item[fd.key]}</td>)}
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" onClick={() => startEdit(item)}><Edit2 size={14} /></button>
                        <button className="btn-icon" onClick={() => handleDelete(item.id)} style={{ color: 'var(--accent-rose)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={fields.length + 1} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No items yet. Click "Add Item" to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ---- FIELD DEFINITIONS ----
const preSalesFields = [
  { key: 'type', label: 'Type', options: ['RFP', 'Proposal'], default: 'RFP', primary: true },
  { key: 'title', label: 'Title', primary: true },
  { key: 'client', label: 'Client' },
  { key: 'status', label: 'Status', options: ['In Progress', 'Submitted', 'Won', 'Lost'], default: 'In Progress' },
  { key: 'value', label: 'Value ($)', type: 'number', default: 0 },
];

const actionPlanFields = [
  { key: 'actionItem', label: 'Action Item', primary: true },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'dueDate', label: 'Due Date', default: '' },
  { key: 'status', label: 'Status', options: ['Not Started', 'In Progress', 'Completed', 'Delayed'], default: 'Not Started' },
  { key: 'priority', label: 'Priority', options: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
];

const skillFields = [
  { key: 'skill', label: 'Skill', primary: true },
  { key: 'account', label: 'Account' },
  { key: 'location', label: 'Location' },
  { key: 'count', label: 'Count', type: 'int', default: 1 },
];

const releaseFields = [
  { key: 'skill', label: 'Skill', primary: true },
  { key: 'account', label: 'Account' },
  { key: 'location', label: 'Location' },
  { key: 'count', label: 'Count', type: 'int', default: 1 },
  { key: 'releaseDate', label: 'Release Date', default: '' },
];

const challengeFields = [
  { key: 'title', label: 'Title', primary: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'severity', label: 'Severity', options: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  { key: 'mitigation', label: 'Mitigation', type: 'textarea' },
];

export default function DataEntry() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [regionId, setRegionId] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const { data: regionsData } = useQuery(GET_REGIONS, { variables: { activeOnly: true } });
  const regions = regionsData?.regions || [];
  const selectedRegion = regionId || regions.find(r => r.code === 'IN')?.id || regions[0]?.id || '';

  const currentMonth = getCurrentMonth();
  const canGoNext = month < currentMonth;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1>Data Entry</h1>
            <p>Add and manage monthly practice data</p>
          </div>
          <div className="controls-row">
            <select className="select-control" value={selectedRegion} onChange={e => setRegionId(e.target.value)}>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="month-nav">
              <button className="month-nav-btn" onClick={() => setMonth(prevMonth(month))}><ChevronLeft size={16} /></button>
              <span className="month-nav-label">{getMonthLabel(month)}</span>
              <button className="month-nav-btn" disabled={!canGoNext} onClick={() => setMonth(nextMonth(month))}><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="tabs">
          {TABS.map((tab, i) => (
            <button key={tab} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
          ))}
        </div>

        {activeTab === 0 && <MonthlySummaryTab regionId={selectedRegion} month={month} />}
        {activeTab === 1 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_PRE_SALES_LIST} createMut={CREATE_PRE_SALES} updateMut={UPDATE_PRE_SALES} deleteMut={DELETE_PRE_SALES} reorderMut={REORDER_PRE_SALES} fields={preSalesFields} itemKey="preSalesList" />}
        {activeTab === 2 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_OPEN_ROLES} createMut={CREATE_OPEN_ROLE} updateMut={UPDATE_OPEN_ROLE} deleteMut={DELETE_OPEN_ROLE} fields={skillFields} itemKey="openRoles" />}
        {activeTab === 3 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_UPCOMING_RELEASES} createMut={CREATE_UPCOMING_RELEASE} updateMut={UPDATE_UPCOMING_RELEASE} deleteMut={DELETE_UPCOMING_RELEASE} fields={releaseFields} itemKey="upcomingReleases" />}
        {activeTab === 4 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_NEW_HIRES} createMut={CREATE_NEW_HIRE} updateMut={UPDATE_NEW_HIRE} deleteMut={DELETE_NEW_HIRE} fields={skillFields} itemKey="newHires" />}
        {activeTab === 5 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_BENCH_RESOURCES} createMut={CREATE_BENCH_RESOURCE} updateMut={UPDATE_BENCH_RESOURCE} deleteMut={DELETE_BENCH_RESOURCE} fields={skillFields} itemKey="benchResources" />}
        {activeTab === 6 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_ACTION_PLANS} createMut={CREATE_ACTION_PLAN} updateMut={UPDATE_ACTION_PLAN} deleteMut={DELETE_ACTION_PLAN} reorderMut={REORDER_ACTION_PLANS} fields={actionPlanFields} itemKey="actionPlans" />}
        {activeTab === 7 && <CrudTab regionId={selectedRegion} month={month} queryDef={GET_CHALLENGES} createMut={CREATE_CHALLENGE} updateMut={UPDATE_CHALLENGE} deleteMut={DELETE_CHALLENGE} fields={challengeFields} itemKey="challenges" />}
      </div>
    </div>
  );
}
