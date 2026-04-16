// src/components/ui/index.jsx
// All reusable UI primitives — import everything from here
import React, { useState, useEffect, useRef } from 'react';
import { avatarColor } from '../../utils';
import { XIcon, SearchIcon, UploadIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon } from './Icons';

export * from './Icons';

/* ─────────────────────────────────────────────────────────────────────────────
   Button
───────────────────────────────────────────────────────────────────────────── */
const BTN_VARIANTS = {
  primary:   { background: 'var(--primary)',    color: '#fff',                   boxShadow: '0 1px 4px rgba(37,99,235,0.3)' },
  secondary: { background: 'var(--bg-surface)', color: 'var(--text-primary)',   border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' },
  danger:    { background: 'var(--danger)',      color: '#fff' },
  ghost:     { background: 'transparent',        color: 'var(--text-secondary)' },
  success:   { background: 'var(--success)',     color: '#fff' },
};
const BTN_SIZES = {
  sm:   { padding: '5px 11px',   fontSize: '0.75rem' },
  md:   { padding: '8px 16px',   fontSize: '0.8125rem' },
  lg:   { padding: '11px 22px',  fontSize: '0.9375rem' },
  icon: { padding: '7px',        fontSize: '0.8125rem' },
};

export function Button({ variant = 'primary', size = 'md', icon, children, style = {}, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
    fontWeight: 500, borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap', userSelect: 'none',
    ...BTN_VARIANTS[variant],
    ...BTN_SIZES[size],
    ...style,
  };

  const handleEnter = (e) => {
    if (variant === 'primary')   { e.currentTarget.style.background = 'var(--primary-dark)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.4)'; }
    if (variant === 'secondary') { e.currentTarget.style.background = 'var(--gray-50)'; }
    if (variant === 'ghost')     { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--text-primary)'; }
    e.currentTarget.style.transform = 'translateY(-1px)';
  };
  const handleLeave = (e) => {
    if (variant === 'primary')   { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(37,99,235,0.3)'; }
    if (variant === 'secondary') { e.currentTarget.style.background = 'var(--bg-surface)'; }
    if (variant === 'ghost')     { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }
    e.currentTarget.style.transform = '';
  };

  return (
    <button
      style={base}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Input
───────────────────────────────────────────────────────────────────────────── */
export function Input({ label, error, hint, required, suffix, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          style={{
            width: '100%', padding: '9px 12px', paddingRight: suffix ? 38 : 12,
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '0.875rem',
            color: 'var(--text-primary)', background: 'var(--bg-surface)', outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-focus)';
            e.target.style.boxShadow   = error ? '0 0 0 3px rgba(239,68,68,0.12)' : '0 0 0 3px rgba(37,99,235,0.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
            e.target.style.boxShadow   = '';
          }}
          {...props}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', padding: '4px 8px', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--danger)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{hint}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Textarea
───────────────────────────────────────────────────────────────────────────── */
export function Textarea({ label, error, required, rows = 3, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        style={{
          width: '100%', padding: '9px 12px', resize: 'vertical',
          border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '0.875rem',
          color: 'var(--text-primary)', background: 'var(--bg-surface)', outline: 'none',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Select
───────────────────────────────────────────────────────────────────────────── */
export function Select({ label, error, required, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select
        style={{
          width: '100%', padding: '9px 32px 9px 12px', appearance: 'none', cursor: 'pointer',
          border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '0.875rem',
          color: 'var(--text-primary)', background: 'var(--bg-surface)', outline: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', padding: '4px 8px', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--danger)' }}>{error}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Badge
───────────────────────────────────────────────────────────────────────────── */
const BADGE_VARIANTS = {
  success: { background: 'var(--success-light)', color: 'var(--success)' },
  warning: { background: 'var(--warning-light)', color: '#B45309' },
  danger:  { background: 'var(--danger-light)',  color: 'var(--danger)' },
  info:    { background: 'var(--info-light)',     color: 'var(--info)' },
  primary: { background: 'var(--primary-light)', color: 'var(--primary)' },
  gray:    { background: 'var(--gray-100)',       color: 'var(--gray-600)' },
};

export function Badge({ variant = 'gray', children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: '0.6875rem', fontWeight: 600,
      letterSpacing: '0.03em', textTransform: 'uppercase',
      ...BADGE_VARIANTS[variant],
    }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Avatar
───────────────────────────────────────────────────────────────────────────── */
export function Avatar({ name = '?', size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(name), color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      textTransform: 'uppercase', userSelect: 'none',
    }}>
      {name.charAt(0)}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Card
───────────────────────────────────────────────────────────────────────────── */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Modal
   FIX: Added portal-like stacking so modals always render above everything,
        moved body.overflow logic into a single effect to avoid race conditions.
───────────────────────────────────────────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const MAX_W = { sm: 420, md: 560, lg: 720, xl: 900 };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-scale-in"
        style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: MAX_W[size] || MAX_W.md,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, borderRadius: 'var(--radius-sm)', display: 'flex', transition: 'all var(--transition-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          >
            <XIcon size={18} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
        {/* Footer */}
        {footer && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0, background: 'var(--gray-50)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ConfirmModal
───────────────────────────────────────────────────────────────────────────── */
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', variant = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </>}
    >
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ToastContainer
   FIX: Added toastIn animation class for smooth slide-in from right
───────────────────────────────────────────────────────────────────────────── */
const TOAST_COLORS = {
  success: 'var(--success)',
  error:   'var(--danger)',
  warning: 'var(--warning)',
  info:    'var(--primary)',
};

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-toast-in"
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)', minWidth: 280, pointerEvents: 'all',
            borderLeft: `4px solid ${TOAST_COLORS[t.type] || TOAST_COLORS.info}`,
          }}
        >
          {t.type === 'success' && <CheckCircleIcon size={16} color="var(--success)" />}
          {t.type === 'error'   && <AlertCircleIcon size={16} color="var(--danger)" />}
          {t.type === 'warning' && <AlertCircleIcon size={16} color="var(--warning)" />}
          {t.type === 'info'    && <InfoIcon        size={16} color="var(--primary)" />}
          <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0, lineHeight: 1, fontSize: 18 }}
          >×</button>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EmptyState
───────────────────────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ color: 'var(--text-tertiary)', opacity: 0.45, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', maxWidth: 260, marginBottom: action ? 20 : 0 }}>{description}</p>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SearchInput
───────────────────────────────────────────────────────────────────────────── */
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <SearchIcon size={15} style={{ position: 'absolute', left: 10, color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: 32, padding: '8px 12px 8px 32px', width: '100%',
          border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
          fontFamily: 'inherit', fontSize: '0.875rem', color: 'var(--text-primary)',
          background: 'var(--bg-surface)', outline: 'none',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)'; }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FilterTabs
───────────────────────────────────────────────────────────────────────────── */
export function FilterTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3, background: 'var(--gray-100)', padding: 4, borderRadius: 'var(--radius-md)' }}>
      {tabs.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          style={{
            padding: '5px 14px', border: 'none', borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            background: active === t.value ? 'var(--bg-surface)' : 'transparent',
            color:      active === t.value ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow:  active === t.value ? 'var(--shadow-xs)' : 'none',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ProgressBar
───────────────────────────────────────────────────────────────────────────── */
export function ProgressBar({ value, showLabel = true }) {
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Profile Completion</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{value}%</span>
        </div>
      )}
      <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value}%`,
          background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   StatCard
───────────────────────────────────────────────────────────────────────────── */
export function StatCard({ icon, iconBg, label, value, trend, trendUp = true }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: 20,
        display: 'flex', alignItems: 'flex-start', gap: 16,
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow var(--transition-fast), transform var(--transition-fast)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = ''; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        {trend && <div style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: 4, color: trendUp ? 'var(--success)' : 'var(--danger)' }}>{trend}</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UploadArea
───────────────────────────────────────────────────────────────────────────── */
export function UploadArea({ onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); onFiles?.(e.dataTransfer.files); }}
      style={{
        border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', padding: '28px 20px',
        textAlign: 'center', cursor: 'pointer',
        background: dragging ? 'var(--primary-light)' : 'var(--gray-50)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <UploadIcon size={28} style={{ color: 'var(--text-tertiary)', marginBottom: 10 }} />
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
        Click to upload or <strong style={{ color: 'var(--primary)' }}>drag &amp; drop</strong>
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>PDF, JPG, PNG up to 10MB</p>
      <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => onFiles?.(e.target.files)} />
    </div>
  );
}
