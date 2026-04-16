// src/App.jsx
import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { useToast } from './hooks/useToast';
import { ToastContainer, Modal, Button } from './components/ui';
import AuthPage    from './components/auth/AuthPage';
import Layout      from './components/layout/Layout';
import Dashboard   from './components/dashboard/Dashboard';
import Clients     from './components/clients/Clients';
import Employees   from './components/employees/Employees';
import Tasks       from './components/tasks/Tasks';
import Payments    from './components/payments/Payments';

const PAGES = {
  dashboard: Dashboard,
  clients:   Clients,
  employees: Employees,
  tasks:     Tasks,
  payments:  Payments,
};

function AppInner() {
  const { currentUser, logout } = useStore();
  const { toasts, toast, removeToast } = useToast();
  const [page,        setPage]        = useState('dashboard');
  const [showLogout,  setShowLogout]  = useState(false);

  const handleLogout = () => {
    logout();
    setPage('dashboard');
    setShowLogout(false);
  };

  const PageComponent = PAGES[page] || Dashboard;

  if (!currentUser) {
    return (
      <>
        <AuthPage onLogin={() => {}} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <>
      <Layout currentPage={page} onNavigate={setPage} onLogout={() => setShowLogout(true)}>
        <PageComponent toast={toast} onNavigate={setPage} />
      </Layout>

      {/* Logout confirm modal */}
      <Modal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        title="Sign Out"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Are you sure you want to sign out of CodingBolt CMS?
        </p>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
