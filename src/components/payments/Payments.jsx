// src/components/payments/Payments.jsx
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDate, formatCurrency } from '../../utils';
import {
  Button, Input, Select, Badge, Avatar, Modal, ConfirmModal,
  SearchInput, FilterTabs, StatCard, EmptyState,
} from '../ui';
import {
  PlusIcon, TrashIcon, PaymentsIcon,
  CurrencyIcon, ClockIcon, TrendingUpIcon,
} from '../ui/Icons';

export default function Payments({ toast }) {
  const store  = useStore();
  const stats  = store.getStats();
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [modal,    setModal]    = useState(false);
  const [deleting, setDeleting] = useState(null);

  const filtered = store.payments.filter(p => {
    const client = store.clients.find(c => c.id === p.clientId);
    const matchStatus = filter === 'all' || p.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      client?.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const collectionRate = store.payments.length
    ? Math.round((store.payments.filter(p => p.status === 'paid').length / store.payments.length) * 100)
    : 0;

  const handleSave = (data) => {
    store.addPayment(data);
    toast('Payment recorded.', 'success');
    setModal(false);
  };

  const markPaid = (id) => {
    store.updatePaymentStatus(id, 'paid');
    toast('Marked as paid ✓', 'success');
  };

  const handleDelete = () => {
    store.deletePayment(deleting.id);
    toast('Payment deleted.', 'success');
  };

  return (
    <div style={{ padding: 28, animation: 'fadeUp 0.22s ease both' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:2 }}>Payments</h1>
          <p style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', margin:0 }}>{store.payments.length} total transactions</p>
        </div>
        <Button variant="primary" icon={<PlusIcon />} onClick={() => setModal(true)}>Record Payment</Button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
        <StatCard
          iconBg="var(--success-light)" icon={<CurrencyIcon size={22} color="var(--success)" />}
          label="Collected" value={formatCurrency(stats.totalRevenue)}
          trend={`${store.payments.filter(p => p.status === 'paid').length} paid`} trendUp={true}
        />
        <StatCard
          iconBg="var(--warning-light)" icon={<ClockIcon size={22} color="var(--warning)" />}
          label="Pending" value={formatCurrency(stats.dueAmount)}
          trend={`${stats.dueCount} invoices due`} trendUp={false}
        />
        <StatCard
          iconBg="var(--primary-light)" icon={<PaymentsIcon size={22} color="var(--primary)" />}
          label="Transactions" value={store.payments.length}
          trend="All time" trendUp={true}
        />
        <StatCard
          iconBg="var(--info-light)" icon={<TrendingUpIcon size={22} color="var(--info)" />}
          label="Collection Rate" value={`${collectionRate}%`}
          trend="Efficiency" trendUp={collectionRate >= 70}
        />
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, maxWidth:320 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by client…" />
        </div>
        <FilterTabs
          active={filter}
          onChange={setFilter}
          tabs={[{ value:'all', label:'All' }, { value:'paid', label:'Paid' }, { value:'due', label:'Due' }]}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<PaymentsIcon size={64} />}
          title="No payments found"
          description={search ? 'No results for your search.' : 'Record your first payment.'}
          action={!search && <Button variant="primary" icon={<PlusIcon />} onClick={() => setModal(true)} style={{ marginTop:12 }}>Record Payment</Button>}
        />
      ) : (
        <div style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead style={{ background:'var(--gray-50)' }}>
                <tr>
                  {['#', 'Client', 'Description', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.6875rem', fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const client = store.clients.find(c => c.id === p.clientId);
                  const isPaid = p.status === 'paid';
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.13s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-50)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                    >
                      <td style={{ padding:'12px 16px', color:'var(--text-tertiary)', fontSize:'0.8125rem' }}>{i + 1}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <Avatar name={client?.name || '?'} size={30} />
                          <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{client?.name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', color:'var(--text-secondary)', fontSize:'0.875rem' }}>{p.description}</td>
                      <td style={{ padding:'12px 16px', fontWeight:800, fontSize:'0.9375rem' }}>{formatCurrency(p.amount)}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <Badge variant={isPaid ? 'success' : 'warning'}>{isPaid ? '✓ Paid' : '⏳ Due'}</Badge>
                      </td>
                      <td style={{ padding:'12px 16px', color:'var(--text-tertiary)', fontSize:'0.875rem' }}>{formatDate(p.date)}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          {!isPaid && (
                            <Button variant="primary" size="sm" onClick={() => markPaid(p.id)}>Mark Paid</Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => setDeleting(p)} title="Delete">
                            <TrashIcon size={14} color="var(--danger)" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PaymentFormModal isOpen={modal} onClose={() => setModal(false)} store={store} onSave={handleSave} />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Payment"
        message="Delete this payment record? This cannot be undone."
      />
    </div>
  );
}

/* ── Payment Form Modal ──────────────────────────────────────────────────── */
function PaymentFormModal({ isOpen, onClose, store, onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const [form,   setForm]   = useState({ status: 'due', date: today });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) { setForm({ status: 'due', date: today }); setErrors({}); }
  }, [isOpen]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.clientId)            e.clientId    = 'Select a client.';
    if (!form.description?.trim()) e.description = 'Description is required.';
    if (!form.amount || form.amount <= 0) e.amount = 'Enter a valid amount.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      amount: parseFloat(form.amount),
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
    });
  };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose} title="Record Payment" size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Record Payment</Button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Select label="Client" required value={form.clientId || ''} onChange={e => set('clientId', e.target.value)} error={errors.clientId}>
          <option value="">Select client…</option>
          {store.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Input label="Description" required placeholder="e.g. GST Registration Fees" value={form.description || ''} onChange={e => set('description', e.target.value)} error={errors.description} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Input label="Amount (₹)" required type="number" min="1" placeholder="0" value={form.amount || ''} onChange={e => set('amount', e.target.value)} error={errors.amount} />
          <Select label="Status" value={form.status || 'due'} onChange={e => set('status', e.target.value)}>
            <option value="due">Due</option>
            <option value="paid">Paid</option>
          </Select>
        </div>
        <Input label="Date" type="date" value={form.date || today} onChange={e => set('date', e.target.value)} />
      </div>
    </Modal>
  );
}
