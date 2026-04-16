// src/components/employees/Employees.jsx
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDate, EMPLOYEE_ROLES } from '../../utils';
import { Button, Input, Select, Badge, Avatar, Modal, ConfirmModal, SearchInput, EmptyState } from '../ui';
import { PlusIcon, EditIcon, TrashIcon, EmployeesIcon } from '../ui/Icons';

export default function Employees({ toast }) {
  const store = useStore();
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = store.employees.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      (e.role || '').toLowerCase().includes(q)
    );
  });

  const openAdd  = ()  => { setEditing(null); setModal(true); };
  const openEdit = (e) => { setEditing(e);    setModal(true); };

  const handleSave = (data) => {
    if (!editing) {
      store.addEmployee(data);
      toast('Employee added.', 'success');
    } else {
      // FIX: preserve joinedAt from the existing employee record
      store.updateEmployee({ ...editing, ...data, id: editing.id });
      toast('Employee updated.', 'success');
    }
    setModal(false);
  };

  const handleDelete = () => {
    store.deleteEmployee(deleting.id);
    toast('Employee removed.', 'success');
  };

  return (
    <div style={{ padding: 28, animation: 'fadeUp 0.22s ease both' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:2 }}>Employees</h1>
          <p style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', margin:0 }}>{store.employees.length} team members</p>
        </div>
        <Button variant="primary" icon={<PlusIcon />} onClick={openAdd}>Add Employee</Button>
      </div>

      <div style={{ marginBottom:20, maxWidth:340 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search employees…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<EmployeesIcon size={64} />}
          title="No employees found"
          description={search ? 'No results for your search.' : 'Add your first team member.'}
          action={!search && <Button variant="primary" icon={<PlusIcon />} onClick={openAdd} style={{ marginTop:12 }}>Add Employee</Button>}
        />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
          {filtered.map(emp => (
            <EmployeeCard
              key={emp.id} emp={emp} store={store}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <EmployeeFormModal
        isOpen={modal}
        onClose={() => setModal(false)}
        employee={editing}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Remove Employee"
        message={`Remove "${deleting?.name}" from the team?`}
        confirmLabel="Remove"
      />
    </div>
  );
}

/* ── Employee Card ───────────────────────────────────────────────────────── */
function EmployeeCard({ emp, store, onEdit, onDelete }) {
  const tasks     = store.tasks.filter(t => t.employeeId === emp.id);
  const active    = tasks.filter(t => t.status !== 'completed').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  return (
    <div
      style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', padding:20, display:'flex', flexDirection:'column', gap:14, transition:'box-shadow 0.18s, transform 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = ''; }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <Avatar name={emp.name} size={48} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:'0.9375rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emp.name}</div>
          <div style={{ fontSize:'0.75rem', color:'var(--text-tertiary)', marginTop:2 }}>{emp.role || 'Staff'}</div>
        </div>
        <Badge variant={emp.status === 'Active' ? 'success' : 'gray'}>{emp.status}</Badge>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        <DetailRow label="Phone"  value={emp.phone} />
        {emp.address && <DetailRow label="Address" value={emp.address} />}
        <DetailRow label="Joined" value={formatDate(emp.joinedAt)} />
      </div>

      {/* Stats strip */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1px 1fr 1px 1fr', background:'var(--gray-50)', borderRadius:'var(--radius-md)', padding:'10px 14px' }}>
        {[
          ['Active',  active,    'var(--primary)'],
          ['Done',    completed, 'var(--success)'],
          ['Total',   tasks.length, 'var(--text-primary)'],
        ].map(([lbl, val, col], i) => (
          <React.Fragment key={lbl}>
            {i > 0 && <div style={{ background:'var(--border)' }} />}
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.125rem', fontWeight:800, color: col }}>{val}</div>
              <div style={{ fontSize:'0.6875rem', color:'var(--text-tertiary)' }}>{lbl}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <Button variant="secondary" size="sm" icon={<EditIcon size={13} />} style={{ flex:1 }} onClick={() => onEdit(emp)}>Edit</Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(emp)} title="Remove">
          <TrashIcon size={14} color="var(--danger)" />
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display:'flex', gap:8, fontSize:'0.8125rem' }}>
      <span style={{ color:'var(--text-tertiary)', minWidth:55, flexShrink:0 }}>{label}</span>
      <span style={{ color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</span>
    </div>
  );
}

/* ── Employee Form Modal ──────────────────────────────────────────────────── */
function EmployeeFormModal({ isOpen, onClose, employee, onSave }) {
  const isEdit = !!employee;
  const [form,   setForm]   = useState({});
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setForm(employee ? { ...employee } : { status: 'Active' });
      setErrors({});
    }
  }, [isOpen, employee]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim())  e.name  = 'Name is required.';
    if (!form.phone?.trim()) e.phone = 'Phone is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={isEdit ? 'Edit Employee' : 'Add Employee'} size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { if (validate()) onSave(form); }}>
            {isEdit ? 'Save Changes' : 'Add Employee'}
          </Button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Input label="Full Name" required placeholder="Employee name" value={form.name || ''} onChange={e => set('name', e.target.value)} error={errors.name} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Input label="Phone" required placeholder="10-digit number" value={form.phone || ''} onChange={e => set('phone', e.target.value)} error={errors.phone} type="tel" />
          <Select label="Role" value={form.role || ''} onChange={e => set('role', e.target.value)}>
            <option value="">Select role…</option>
            {EMPLOYEE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </div>
        <Input label="Address" placeholder="Residential address" value={form.address || ''} onChange={e => set('address', e.target.value)} />
        <Select label="Status" value={form.status || 'Active'} onChange={e => set('status', e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>
    </Modal>
  );
}
