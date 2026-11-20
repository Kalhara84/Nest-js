import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon"><i className="bi bi-cash-coin" /></span>
          Payroll System
        </div>
        <div className="nav-label">Master Files</div>
        <NavLink to="/employees" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-people" /> Employees
        </NavLink>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="fw-semibold">Employee Master Maintenance</div>
          <div className="text-muted small"><i className="bi bi-person-circle me-1" />Admin</div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
