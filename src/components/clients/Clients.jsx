// src/components/clients/Clients.jsx
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDate, calcProfileCompletion, QUERY_TYPES } from '../../utils';
import {
  Button, Input, Select, Badge, Avatar, Modal, ConfirmModal,
  SearchInput, FilterTabs, ProgressBar, EmptyState, UploadArea,
} from '../ui';
import {
  PlusIcon, EditIcon, TrashIcon, EyeIcon,
  TagIcon, MailIcon, ClientsIcon,
} from '../ui/Icons';

export default function Clients({ toast }) {
  const store = useStore();
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [modal,    setModal]    = useState(null); // null | 'add' | 'edit' | 'view'
  const [active,   setActive]   = useState(null); // client being edited/viewed
  const [deleting, setDeleting] = useState(null);

  const filtered = store.clients.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.queryType.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const openAdd  = ()  => { setActive(null); setModal('add'); };
  const openEdit = (c) => { setActive(c);    setModal('edit'); };
  const openView = (c) => { setActive(c);    setModal('view'); };

  const handleSave = (data) => {
    if (modal === 'add') {
      store.addClient(data);
      toast('Client added successfully.', 'success');
    } else {
      store.updateClient({ ...data, id: active.id });
      toast('Client updated.', 'success');
    }
    setModal(null);
  };

  const handleDelete = () => {
    store.deleteClient(deleting.id);
    toast('Client deleted.', 'success');
  };

  return (
    <div style={{ padding: 28, animation: 'fadeUp 0.22s ease both' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:2 }}>Clients</h1>
          <p style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', margin:0 }}>{store.clients.length} total clients</p>
        </div>
        <Button variant="primary" icon={<PlusIcon />} onClick={openAdd}>Add Client</Button>
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, maxWidth:340 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search clients…" />
        </div>
        <FilterTabs
          active={filter}
          onChange={setFilter}
          tabs={[
            { value:'all',      label:'All' },
            { value:'Active',   label:'Active' },
            { value:'Inactive', label:'Inactive' },
          ]}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClientsIcon size={64} />}
          title="No clients found"
          description={search ? 'Try a different search term.' : 'Add your first client to get started.'}
          action={!search && <Button variant="primary" icon={<PlusIcon />} onClick={openAdd} style={{ marginTop: 12 }}>Add Client</Button>}
        />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
          {filtered.map(c => (
            <ClientCard
              key={c.id} client={c}
              onView={openView}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {/* Add / Edit */}
      <ClientFormModal
        isOpen={modal === 'add' || modal === 'edit'}
        onClose={() => setModal(null)}
        client={modal === 'edit' ? active : null}
        onSave={handleSave}
      />

      {/* View */}
      <ClientViewModal
        isOpen={modal === 'view'}
        onClose={() => setModal(null)}
        client={active}
        onEdit={c => { setActive(c); setModal('edit'); }}
      />

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
      />
    </div>
  );
}

/* ── Client Card ──────────────────────────────────────────────────────────── */
function ClientCard({ client: c, onView, onEdit, onDelete }) {
  const pct = calcProfileCompletion(c);
  return (
    <div
      style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', padding:20, display:'flex', flexDirection:'column', gap:14, transition:'box-shadow 0.18s, transform 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = ''; }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <Avatar name={c.name} size={44} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:'0.9375rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
          <div style={{ fontSize:'0.75rem', color:'var(--text-tertiary)', marginTop:2 }}>{c.phone}</div>
        </div>
        <Badge variant={c.status === 'Active' ? 'success' : 'gray'}>{c.status}</Badge>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        <InfoRow icon={<TagIcon size={13} color="var(--text-tertiary)" />}   text={c.queryType} />
        {c.email   && <InfoRow icon={<MailIcon size={13} color="var(--text-tertiary)" />}   text={c.email} />}
        {c.address && <InfoRow icon={<MapPin />} text={c.address} />}
      </div>

      <ProgressBar value={pct} />

      <div style={{ display:'flex', gap:8 }}>
        <Button variant="secondary" size="sm" icon={<EyeIcon size={13} />} style={{ flex:1 }} onClick={() => onView(c)}>View</Button>
        <Button variant="secondary" size="sm" icon={<EditIcon size={13} />} style={{ flex:1 }} onClick={() => onEdit(c)}>Edit</Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(c)} title="Delete">
          <TrashIcon size={14} color="var(--danger)" />
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
      <span style={{ marginTop:1, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{text}</span>
    </div>
  );
}

const MapPin = () => (
  <svg width="13" height="13" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

/* ── Client Form Modal ─────────────────────────────────────────────────────── */
function ClientFormModal({ isOpen, onClose, client, onSave }) {
  const isEdit = !!client;
  const [form,        setForm]        = useState({});
  const [errors,      setErrors]      = useState({});
  const [extraFields, setExtraFields] = useState([]);
  const [files,       setFiles]       = useState([]);
  const [gstOpen,     setGstOpen]     = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setForm(client ? { ...client } : { status: 'Active' });
      setExtraFields(client?.extraFields || []);
      setGstOpen(!!client?.gstNumber);
      setErrors({});
      setFiles([]);
    }
  }, [isOpen, client]);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim())  e.name      = 'Name is required.';
    if (!form.phone?.trim()) e.phone     = 'Phone is required.';
    if (!form.queryType)     e.queryType = 'Select a query type.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, extraFields, documents: files.map(f => f.name) });
  };

  const addExtra    = ()        => setExtraFields(p => [...p, { label: '', value: '' }]);
  const setExtra    = (i, k, v) => setExtraFields(p => p.map((f, idx) => idx === i ? { ...f, [k]: v } : f));
  const removeExtra = (i)       => setExtraFields(p => p.filter((_, idx) => idx !== i));

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={isEdit ? 'Edit Client' : 'Add New Client'} size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Client'}</Button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Input label="Full Name" required placeholder="Client name" value={form.name || ''} onChange={e => set('name', e.target.value)} error={errors.name} />
          <Input label="Phone Number" required placeholder="10-digit number" value={form.phone || ''} onChange={e => set('phone', e.target.value)} error={errors.phone} type="tel" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Input label="Email" placeholder="email@example.com" value={form.email || ''} onChange={e => set('email', e.target.value)} type="email" />
          <Select label="Query Type" required value={form.queryType || ''} onChange={e => set('queryType', e.target.value)} error={errors.queryType}>
            <option value="">Select type…</option>
            {QUERY_TYPES.map(q => <option key={q} value={q}>{q}</option>)}
          </Select>
        </div>
        <Input label="Address" placeholder="Full address" value={form.address || ''} onChange={e => set('address', e.target.value)} />
        <Select label="Status" value={form.status || 'Active'} onChange={e => set('status', e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>

        {/* GST Section */}
        <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
          <button
            onClick={() => setGstOpen(v => !v)}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'var(--gray-50)', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'0.8125rem', fontWeight:600, color:'var(--text-primary)' }}
          >
            GST Details (Optional)
            <span style={{ transform: gstOpen ? 'rotate(180deg)' : '', transition:'transform 0.2s', display:'inline-block' }}>▾</span>
          </button>
          {gstOpen && (
            <div style={{ padding:14 }}>
              <Input label="GST Number" placeholder="e.g. 27AAPFU0939F1ZV" value={form.gstNumber || ''} onChange={e => set('gstNumber', e.target.value)} />
            </div>
          )}
        </div>

        {/* Upload */}
        <div>
          <label style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Upload Documents</label>
          <UploadArea onFiles={fl => setFiles(Array.from(fl))} />
          {files.length > 0 && (
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
              {files.map(f => (
                <div key={f.name} style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', display:'flex', gap:6 }}>
                  📄 {f.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extra fields */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <label style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)' }}>Additional Fields</label>
            <Button variant="secondary" size="sm" icon={<PlusIcon size={13} />} onClick={addExtra}>Add Field</Button>
          </div>
          {extraFields.map((f, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <input placeholder="Field name" value={f.label} onChange={e => setExtra(i, 'label', e.target.value)}
                style={{ flex:1, padding:'8px 10px', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', fontFamily:'inherit', fontSize:'0.875rem', outline:'none', color:'var(--text-primary)', background:'var(--bg-surface)' }} />
              <input placeholder="Value" value={f.value} onChange={e => setExtra(i, 'value', e.target.value)}
                style={{ flex:2, padding:'8px 10px', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', fontFamily:'inherit', fontSize:'0.875rem', outline:'none', color:'var(--text-primary)', background:'var(--bg-surface)' }} />
              <Button variant="ghost" size="icon" onClick={() => removeExtra(i)}>
                <TrashIcon size={13} color="var(--danger)" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ── Client View Modal ─────────────────────────────────────────────────────── */
function ClientViewModal({ isOpen, onClose, client: c, onEdit }) {
  if (!c) return null;
  const pct = calcProfileCompletion(c);
  const rows = [
    ['Phone', c.phone], ['Email', c.email], ['Address', c.address],
    ['GST Number', c.gstNumber], ['Member Since', formatDate(c.createdAt)],
  ].filter(([, v]) => v);

  return (
    <Modal
      isOpen={isOpen} onClose={onClose} title="Client Profile" size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={() => onEdit(c)}>Edit Client</Button>
        </>
      }
    >
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--border)' }}>
        <Avatar name={c.name} size={56} />
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ marginBottom:4 }}>{c.name}</h3>
          <p style={{ margin:0, color:'var(--text-secondary)' }}>{c.queryType}</p>
        </div>
        <Badge variant={c.status === 'Active' ? 'success' : 'gray'}>{c.status}</Badge>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ display:'flex', gap:12 }}>
            <span style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', minWidth:110, flexShrink:0 }}>{label}</span>
            <span style={{ fontSize:'0.8125rem', fontWeight:500 }}>{value}</span>
          </div>
        ))}
      </div>

      {c.extraFields?.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:'0.6875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-tertiary)', marginBottom:10 }}>Additional Info</div>
          {c.extraFields.map((f, i) => (
            <div key={i} style={{ display:'flex', gap:12, marginBottom:8 }}>
              <span style={{ fontSize:'0.8125rem', color:'var(--text-tertiary)', minWidth:110, flexShrink:0 }}>{f.label}</span>
              <span style={{ fontSize:'0.8125rem', fontWeight:500 }}>{f.value || '—'}</span>
            </div>
          ))}
        </div>
      )}

      <ProgressBar value={pct} />
    </Modal>
  );
}
