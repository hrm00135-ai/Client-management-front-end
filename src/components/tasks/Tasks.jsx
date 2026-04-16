// src/components/tasks/Tasks.jsx
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDate, TASK_STATUS_META, PRIORITY_META } from '../../utils';
import { Button, Select, Input, Textarea, Modal, ConfirmModal, Avatar, Badge, EmptyState } from '../ui';
import { PlusIcon, TrashIcon, TasksIcon } from '../ui/Icons';

const COLUMNS = [
  { status: 'started',     label: 'Started',     color: '#6366F1' },
  { status: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { status: 'completed',   label: 'Completed',   color: '#10B981' },
];

export default function Tasks({ toast }) {
  const store = useStore();
  const [modal,    setModal]    = useState(false);
  const [deleting, setDeleting] = useState(null);

  // FIX: store only the taskId string, not an object —
  // the original code stored {taskId, fromStatus} and then compared
  // that object to a status string, so drag-drop never moved tasks.
  const [draggedId, setDraggedId] = useState(null);

  const tasksByStatus = (status) => store.tasks.filter(t => t.status === status);

  const moveTask = (id, status) => {
    store.updateTaskStatus(id, status);
    toast(`Task moved to ${TASK_STATUS_META[status].label}.`, 'success');
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedId) {
      const task = store.tasks.find(t => t.id === draggedId);
      if (task && task.status !== targetStatus) {
        moveTask(draggedId, targetStatus);
      }
    }
    setDraggedId(null);
  };

  const handleDelete = () => {
    store.deleteTask(deleting.id);
    toast('Task deleted.', 'success');
  };

  return (
    <div style={{ padding: 28, animation: 'fadeUp 0.22s ease both' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:2 }}>Tasks</h1>
          <p style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', margin:0 }}>
            {store.tasks.length} total · {store.tasks.filter(t => t.status === 'completed').length} completed
          </p>
        </div>
        <Button variant="primary" icon={<PlusIcon />} onClick={() => setModal(true)}>Assign Task</Button>
      </div>

      {/* Kanban Board */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16, alignItems:'start' }}>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            col={col}
            tasks={tasksByStatus(col.status)}
            store={store}
            onMove={moveTask}
            onDelete={setDeleting}
            onDragStart={setDraggedId}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <TaskFormModal
        isOpen={modal}
        onClose={() => setModal(false)}
        store={store}
        onSave={data => {
          store.addTask(data);
          toast('Task assigned.', 'success');
          setModal(false);
        }}
      />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
      />
    </div>
  );
}

/* ── Kanban Column ───────────────────────────────────────────────────────── */
function KanbanColumn({ col, tasks, store, onMove, onDelete, onDragStart, onDrop }) {
  const [over, setOver] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: over ? '0 0 0 2px var(--primary)' : 'var(--shadow-sm)',
        transition: 'box-shadow 0.15s',
      }}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { setOver(false); onDrop(e, col.status); }}
    >
      {/* Column header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 16px', borderBottom:'1px solid var(--border)', background:'var(--gray-50)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:col.color }} />
          <span style={{ fontSize:'0.8125rem', fontWeight:700 }}>{col.label}</span>
        </div>
        <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--text-tertiary)', background:'var(--gray-200)', padding:'1px 8px', borderRadius:99 }}>
          {tasks.length}
        </span>
      </div>

      {/* Task list */}
      <div style={{
        padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120,
        background: over ? 'var(--primary-light)' : 'transparent', transition: 'background 0.15s',
      }}>
        {tasks.length === 0 && !over && (
          <div style={{ textAlign:'center', padding:'20px 10px', color:'var(--text-tertiary)', fontSize:'0.8125rem' }}>
            No tasks here
          </div>
        )}
        {tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            store={store}
            colStatus={col.status}
            onMove={onMove}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Task Card ───────────────────────────────────────────────────────────── */
function TaskCard({ task: t, store, colStatus, onMove, onDelete, onDragStart }) {
  const client   = store.clients.find(c => c.id === t.clientId);
  const employee = store.employees.find(e => e.id === t.employeeId);
  const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
  const prio = PRIORITY_META[t.priority] || PRIORITY_META.medium;

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; onDragStart(t.id); }}
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: 12, cursor: 'grab',
        userSelect: 'none', transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Priority row */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:prio.color, flexShrink:0 }} />
        <span style={{ fontSize:'0.625rem', fontWeight:700, color:prio.color, textTransform:'uppercase', letterSpacing:'0.05em' }}>{prio.label}</span>
        {isOverdue && <span style={{ marginLeft:'auto' }}><Badge variant="danger">Overdue</Badge></span>}
      </div>

      <div style={{ fontWeight:700, fontSize:'0.8125rem', marginBottom:4, lineHeight:1.4 }}>{t.title}</div>

      {t.description && (
        <p style={{ fontSize:'0.75rem', color:'var(--text-tertiary)', margin:'0 0 8px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {t.description}
        </p>
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {client ? (
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <Avatar name={client.name} size={20} />
            <span style={{ fontSize:'0.75rem', color:'var(--text-tertiary)' }}>{client.name}</span>
          </div>
        ) : <span />}
        {t.dueDate && (
          <span style={{ fontSize:'0.6875rem', color: isOverdue ? 'var(--danger)' : 'var(--text-tertiary)' }}>
            {formatDate(t.dueDate)}
          </span>
        )}
      </div>

      {employee && (
        <div style={{ display:'flex', alignItems:'center', gap:5, paddingTop:8, borderTop:'1px solid var(--border)', marginTop:8 }}>
          <svg width="11" height="11" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span style={{ fontSize:'0.75rem', color:'var(--text-tertiary)' }}>{employee.name}</span>
        </div>
      )}

      {/* Move & delete buttons */}
      <div style={{ display:'flex', gap:4, marginTop:10, flexWrap:'wrap', alignItems:'center' }}>
        {colStatus !== 'started'      && <MoveBtn label="← Back"       onClick={() => onMove(t.id, 'started')} />}
        {colStatus !== 'in-progress'  && <MoveBtn label="In Progress"  onClick={() => onMove(t.id, 'in-progress')} primary />}
        {colStatus !== 'completed'    && <MoveBtn label="Complete ✓"   onClick={() => onMove(t.id, 'completed')} primary />}
        <button
          onClick={() => onDelete(t)}
          style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--danger)', display:'flex', alignItems:'center', padding:'3px 5px', borderRadius:'var(--radius-sm)', transition:'background 0.13s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <TrashIcon size={12} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
}

function MoveBtn({ label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px 8px',
        border: primary ? 'none' : '1px solid var(--border)',
        background: primary ? 'var(--primary)' : 'transparent',
        color: primary ? '#fff' : 'var(--text-secondary)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem',
        fontWeight: 500, cursor: 'pointer', transition: 'all 0.13s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = primary ? 'var(--primary-dark)' : 'var(--gray-100)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = primary ? 'var(--primary)' : 'transparent'; }}
    >
      {label}
    </button>
  );
}

/* ── Task Form Modal ─────────────────────────────────────────────────────── */
function TaskFormModal({ isOpen, onClose, store, onSave }) {
  const [form,   setForm]   = useState({ status: 'started', priority: 'medium' });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) { setForm({ status: 'started', priority: 'medium' }); setErrors({}); }
  }, [isOpen]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title    = 'Task title is required.';
    if (!form.clientId)      e.clientId = 'Select a client.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose} title="Assign New Task" size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { if (validate()) onSave(form); }}>Assign Task</Button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Input label="Task Title" required placeholder="e.g. GST Return Filing Q3" value={form.title || ''} onChange={e => set('title', e.target.value)} error={errors.title} />
        <Textarea label="Description" placeholder="Brief task description…" value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Select label="Client" required value={form.clientId || ''} onChange={e => set('clientId', e.target.value)} error={errors.clientId}>
            <option value="">Select client…</option>
            {store.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Employee" value={form.employeeId || ''} onChange={e => set('employeeId', e.target.value)}>
            <option value="">Select employee…</option>
            {store.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Select>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Select label="Priority" value={form.priority || 'medium'} onChange={e => set('priority', e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input
            label="Due Date" type="date"
            value={form.dueDate ? form.dueDate.split('T')[0] : ''}
            onChange={e => set('dueDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
          />
        </div>

        {/* Status toggle */}
        <div>
          <label style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', display:'block', marginBottom:8 }}>Initial Status</label>
          <div style={{ display:'flex', gap:8 }}>
            {['started', 'in-progress'].map(s => (
              <button
                key={s}
                onClick={() => set('status', s)}
                style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '0.8125rem', transition: 'all 0.15s',
                  border: `1.5px solid ${form.status === s ? 'var(--primary)' : 'var(--border)'}`,
                  background: form.status === s ? 'var(--primary-light)' : 'transparent',
                  color: form.status === s ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: form.status === s ? 600 : 400,
                }}
              >
                {TASK_STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
