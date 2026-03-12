import { useState } from 'react';
import { User, Mail, Building, Shield, Save, Bell, Moon, Sun, Globe } from 'lucide-react';

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: 'Naren Bhavsar',
    email: 'naren.bhavsar@company.com',
    role: 'Practice Lead',
    department: 'Digital Engineering',
    notifications: true,
    darkMode: true,
    defaultRegion: 'IN',
  });
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    setToast({ message: 'Profile settings saved!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1>User Profile</h1>
            <p>Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, maxWidth: 900 }}>
          {/* Profile Card */}
          <div className="profile-card" style={{ textAlign: 'center' }}>
            <div className="profile-avatar" style={{ margin: '0 auto 16px' }}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{profile.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>{profile.role}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>{profile.department}</p>
            <div style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <Mail size={14} /> {profile.email}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title"><User size={16} /> Personal Information</span>
              </div>
              <div className="section-card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input className="form-input" value={profile.role}
                      onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-input" value={profile.department}
                      onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title"><Shield size={16} /> Preferences</span>
              </div>
              <div className="section-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Bell size={16} style={{ color: 'var(--accent-indigo-light)' }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>Email Notifications</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive updates about your practice</div>
                      </div>
                    </div>
                    <button className={`btn btn-sm ${profile.notifications ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setProfile(p => ({ ...p, notifications: !p.notifications }))}>
                      {profile.notifications ? 'On' : 'Off'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {profile.darkMode ? <Moon size={16} style={{ color: 'var(--accent-violet)' }} /> : <Sun size={16} style={{ color: 'var(--accent-amber)' }} />}
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>Dark Mode</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toggle dark/light theme</div>
                      </div>
                    </div>
                    <button className={`btn btn-sm ${profile.darkMode ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setProfile(p => ({ ...p, darkMode: !p.darkMode }))}>
                      {profile.darkMode ? 'Dark' : 'Light'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Globe size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>Default Region</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shown on dashboard by default</div>
                      </div>
                    </div>
                    <select className="select-control" style={{ minWidth: 120 }} value={profile.defaultRegion}
                      onChange={e => setProfile(p => ({ ...p, defaultRegion: e.target.value }))}>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="EU">Europe</option>
                      <option value="APAC">Asia Pacific</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start' }}>
              <Save size={14} /> Save Settings
            </button>
          </div>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
