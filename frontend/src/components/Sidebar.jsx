import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Globe2, User, LayoutGrid, Moon, Sun, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const [theme, setTheme] = useState('dark');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <LayoutGrid size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1rem' }}>Digital Practice</h1>
          <span>Monthly Updates</span>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Theme</span>
        <button onClick={toggleTheme} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-secondary)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s ease' }}>
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Main</span>
        <NavLink to="/" end className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/data-entry" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
          <PenSquare size={18} />
          Data Entry
        </NavLink>
        <span className="sidebar-nav-label">Settings</span>
        <NavLink to="/regions" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
          <Globe2 size={18} />
          Region Management
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          User Profile
        </NavLink>
      </nav>

      {/* User Profile Section */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-secondary)', position: 'relative' }} ref={menuRef}>
        {showProfileMenu && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '16px',
            right: '16px',
            marginBottom: '8px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            zIndex: 1000
          }}>
            <NavLink to="/profile" onClick={() => setShowProfileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'background 0.2s' }} className="profile-menu-item">
              <User size={16} />
              Profile Settings
            </NavLink>
            <button onClick={() => { setShowProfileMenu(false); logout(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', borderTop: '1px solid var(--border-secondary)', background: 'transparent', color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} className="profile-menu-item">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '12px', transition: 'background 0.2s', background: showProfileMenu ? 'var(--bg-glass-hover)' : 'transparent' }} className="sidebar-profile-btn">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-indigo-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'N'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Narendra Bhavsar
              </span>
              <Shield size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
              {user?.email || 'naren.bhavsar@gmail.com'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Practice Lead
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
