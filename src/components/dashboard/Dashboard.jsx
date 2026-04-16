// src/components/dashboard/Dashboard.jsx
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDate, formatCurrency, TASK_STATUS_META } from '../../utils';
import { StatCard, Badge, Button, Avatar } from '../ui';
import { ClientsIcon, TasksIcon, PaymentsIcon, CurrencyIcon, ClockIcon, PlusIcon } from '../ui/Icons';

export default function Dashboard({ onNavigate }) {
  const store  = useStore();
  const stats  = store.getStats();

  const recentClients  = [...store.clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const pendingTasks   = store.tasks
    .filter(t => t.status !== 'completed')
    .slice(0, 5);

  const recentPayments = [...store.payments].reverse().slice(0, 5);

  return (
    <div style={{ padding: 28, animation: 'fadeUp 0.22s ease both' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:2 }}>Dashboard</h1>
          <p style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', margin:0 }}>
            Overview — {formatDate(new Date())}
          </p>
        </div>
        <Button variant="primary" icon={<PlusIcon />} onClick={() => onNavigate('clients')}>
          Add Client
        </Button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
        <StatCard
          iconBg="var(--primary-light)" icon={<ClientsIcon size={22} color="var(--primary)" />}
          label="Total Clients" value={stats.totalClients}
          trend="Active this month" trendUp={true}
        />
        <StatCard
          iconBg="var(--success-light)" icon={<CurrencyIcon size={22} color="var(--success)" />}
          label="Revenue Collected" value={formatCurrency(stats.totalRevenue)}
          trend="Payments received" trendUp={true}
        />
        <StatCard
          iconBg="var(--warning-light)" icon={<ClockIcon size={22} color="var(--warning)" />}
          label="Pending Amount" value={formatCurrency(stats.dueAmount)}
          trend={`${stats.dueCount} invoices due`} trendUp={false}
        />
        <StatCard
          iconBg="var(--info-light)" icon={<TasksIcon size={22} color="var(--info)" />}
          label="Active Tasks" value={stats.totalTasks - stats.completedTasks}
          trend={`${stats.completedTasks} completed`} trendUp={true}
        />
      </div>

      {/* Two-column grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:20, marginBottom:20 }}>

        {/* Recent Clients */}
        <div style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <h3 style={{ fontSize:'0.9375rem', fontWeight:700 }}>Recent Clients</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('clients')}>View all →</Button>
          </div>
          {recentClients.length === 0 ? (
            <p style={{ padding:24, color:'var(--text-tertiary)', fontSize:'0.875rem', textAlign:'center' }}>No clients yet.</p>
          ) : recentClients.map((c, i) => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderBottom: i < recentClients.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <Avatar name={c.name} size={36} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:'0.875rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-tertiary)' }}>{c.queryType}</div>
              </div>
              <Badge variant={c.status === 'Active' ? 'success' : 'gray'}>{c.status}</Badge>
            </div>
          ))}
        </div>

        {/* Pending Tasks */}
        <div style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <h3 style={{ fontSize:'0.9375rem', fontWeight:700 }}>Pending Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')}>View all →</Button>
          </div>
          {pendingTasks.length === 0 ? (
            <p style={{ padding:24, color:'var(--text-tertiary)', fontSize:'0.875rem', textAlign:'center' }}>All tasks done! 🎉</p>
          ) : pendingTasks.map((t, i) => {
            const meta   = TASK_STATUS_META[t.status];
            const client = store.clients.find(c => c.id === t.clientId);
            return (
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderBottom: i < pendingTasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:meta.dot, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:'0.875rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-tertiary)' }}>{client?.name}</div>
                </div>
                <Badge variant={t.status === 'in-progress' ? 'warning' : 'info'}>{meta.label}</Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments */}
      <div style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:'0.9375rem', fontWeight:700 }}>Recent Payments</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('payments')}>View all →</Button>
        </div>
        {recentPayments.length === 0 ? (
          <p style={{ padding:24, color:'var(--text-tertiary)', textAlign:'center' }}>No payments yet.</p>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead style={{ background:'var(--gray-50)' }}>
                <tr>
                  {['Client','Description','Amount','Status','Date'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'0.6875rem', fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p, i) => {
                  const client = store.clients.find(c => c.id === p.clientId);
                  return (
                    <tr key={p.id} style={{ borderBottom: i < recentPayments.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding:'12px 16px', fontWeight:600 }}>{client?.name || '—'}</td>
                      <td style={{ padding:'12px 16px', color:'var(--text-secondary)', fontSize:'0.875rem' }}>{p.description}</td>
                      <td style={{ padding:'12px 16px', fontWeight:700 }}>{formatCurrency(p.amount)}</td>
                      <td style={{ padding:'12px 16px' }}><Badge variant={p.status === 'paid' ? 'success' : 'warning'}>{p.status === 'paid' ? '✓ Paid' : '⏳ Due'}</Badge></td>
                      <td style={{ padding:'12px 16px', color:'var(--text-tertiary)', fontSize:'0.875rem' }}>{formatDate(p.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
