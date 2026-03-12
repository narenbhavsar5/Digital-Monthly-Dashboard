import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Globe2, User, Activity } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Activity size={20} />
        </div>
        <div>
          <h1>BenchWise</h1>
          <span>Practice Management</span>
        </div>
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
    </aside>
  );
}
