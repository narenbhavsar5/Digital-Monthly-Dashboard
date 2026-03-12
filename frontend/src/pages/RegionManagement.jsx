import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Globe2, Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle } from 'lucide-react';
import { GET_REGIONS, CREATE_REGION, UPDATE_REGION, DELETE_REGION } from '../graphql/queries';

export default function RegionManagement() {
  const { data, loading, refetch } = useQuery(GET_REGIONS, { variables: { activeOnly: false } });
  const [create] = useMutation(CREATE_REGION);
  const [update] = useMutation(UPDATE_REGION);
  const [remove] = useMutation(DELETE_REGION);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', isActive: true });
  const [toast, setToast] = useState(null);

  const regions = data?.regions || [];

  const openCreate = () => {
    setForm({ name: '', code: '', isActive: true });
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (region) => {
    setForm({ name: region.name, code: region.code, isActive: region.isActive });
    setEditing(region);
    setShowModal(true);
  };

  const handleSave = async () => {
    const input = { name: form.name, code: form.code.toUpperCase(), isActive: form.isActive };
    if (editing) {
      await update({ variables: { id: editing.id, input } });
      setToast({ message: 'Region updated!', type: 'success' });
    } else {
      await create({ variables: { input } });
      setToast({ message: 'Region created!', type: 'success' });
    }
    refetch();
    setShowModal(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this region and all associated data?')) return;
    await remove({ variables: { id } });
    refetch();
    setToast({ message: 'Region deleted', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1>Region Management</h1>
            <p>Manage practice regions and their settings</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} /> Add Region
          </button>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading"><div className="loading-spinner" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {regions.map(region => (
              <div key={region.id} className="region-card">
                <div className="region-card-info">
                  <Globe2 size={20} style={{ color: 'var(--accent-indigo-light)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{region.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span className="region-code">{region.code}</span>
                      {region.isActive ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-emerald)' }}>
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-rose)' }}>
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="region-card-actions">
                  <button className="btn-icon" onClick={() => openEdit(region)}><Edit2 size={14} /></button>
                  <button className="btn-icon" onClick={() => handleDelete(region.id)} style={{ color: 'var(--accent-rose)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {regions.length === 0 && (
              <div className="empty-state">
                <Globe2 size={40} />
                <p>No regions configured. Add your first region to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit' : 'Create'} Region</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Region Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. India" />
              </div>
              <div className="form-group">
                <label className="form-label">Region Code</label>
                <input className="form-input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. IN" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.name || !form.code}>
                <Save size={14} /> {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
