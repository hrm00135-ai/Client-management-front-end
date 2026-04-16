// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Avatar } from '../ui';
import {
  DashboardIcon, ClientsIcon, EmployeesIcon,
  TasksIcon, PaymentsIcon, BellIcon, MenuIcon, LogOutIcon,
} from '../ui/Icons';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon, section: 'Main' },
  { id: 'clients',   label: 'Clients',   Icon: ClientsIcon,   section: 'Manage' },
  { id: 'employees', label: 'Employees', Icon: EmployeesIcon, section: 'Manage' },
  { id: 'tasks',     label: 'Tasks',     Icon: TasksIcon,     section: 'Work' },
  { id: 'payments',  label: 'Payments',  Icon: PaymentsIcon,  section: 'Work' },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  clients:   'Clients',
  employees: 'Employees',
  tasks:     'Tasks',
  payments:  'Payments',
};

export default function Layout({ currentPage, onNavigate, onLogout, children }) {
  const { currentUser, clients, employees } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const badges = { clients: clients.length, employees: employees.length };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Mobile overlay — FIX: no inline display:none, controlled via CSS class ── */}
      <div
        className="mobile-overlay"
        onClick={closeSidebar}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 150,
          // visibility toggled by adding/removing a class below
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'all' : 'none',
          transition: 'opacity var(--transition-slow)',
        }}
      />

      {/* ── Sidebar — FIX: CSS class controls transform, not inline style ── */}
      <aside
        className={`sidebar${sidebarOpen ? ' open' : ''}`}
        style={{
          width: 240,
          background: 'var(--gray-900)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          zIndex: 200,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.875rem', color: '#fff', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
          }}>CB</div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>CodingBolt</div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>CMS</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px', overflowY: 'auto', overflowX: 'hidden' }}>
          {['Main', 'Manage', 'Work'].map(section => {
            const items = NAV_ITEMS.filter(i => i.section === section);
            return (
              <div key={section}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', padding: '14px 10px 6px' }}>
                  {section}
                </div>
                {items.map(item => (
                  <NavItem
                    key={item.id}
                    item={item}
                    active={currentPage === item.id}
                    badge={badges[item.id]}
                    onClick={() => { onNavigate(item.id); closeSidebar(); }}
                  />
                ))}
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', border: 'none', background: 'transparent',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Avatar name={currentUser?.name || 'U'} size={32} />
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)' }}>Administrator</div>
            </div>
            <LogOutIcon size={14} color="rgba(255,255,255,0.35)" />
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 'var(--topbar-h)', background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0, boxShadow: 'var(--shadow-xs)', zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* FIX: mobile-menu-btn display controlled by CSS, not inline display:none */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', padding: 6,
                borderRadius: 'var(--radius-sm)', alignItems: 'center',
              }}
            >
              <MenuIcon size={20} />
            </button>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {PAGE_TITLES[currentPage]}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TopbarBtn title="Notifications">
              <BellIcon size={17} />
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7, background: 'var(--danger)',
                borderRadius: '50%', border: '2px solid var(--bg-surface)',
              }} />
            </TopbarBtn>
            <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
            <Avatar name={currentUser?.name || 'U'} size={32} />
          </div>
        </header>

        {/* Page area */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-app)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

/* ── NavItem ─────────────────────────────────────────────────────────────── */
function NavItem({ item, active, badge, onClick }) {
  const { Icon } = item;
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', border: 'none', borderRadius: 'var(--radius-md)',
        cursor: 'pointer', marginBottom: 2,
        fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500,
        textAlign: 'left', transition: 'all var(--transition-fast)',
        background: active ? 'rgba(37,99,235,0.85)' : 'transparent',
        color:      active ? '#fff' : 'rgba(255,255,255,0.65)',
        boxShadow:  active ? '0 2px 8px rgba(37,99,235,0.4)' : 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
    >
      <Icon size={17} color={active ? '#fff' : 'rgba(255,255,255,0.65)'} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {badge != null && (
        <span style={{
          background: active ? 'rgba(255,255,255,0.25)' : 'var(--primary)',
          color: '#fff', fontSize: '0.625rem', fontWeight: 700,
          minWidth: 18, height: 18, borderRadius: 99,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── TopbarBtn ───────────────────────────────────────────────────────────── */
function TopbarBtn({ children, title }) {
  return (
    <button
      title={title}
      style={{
        width: 36, height: 36, border: 'none', background: 'transparent',
        cursor: 'pointer', borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)', transition: 'all var(--transition-fast)',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}
