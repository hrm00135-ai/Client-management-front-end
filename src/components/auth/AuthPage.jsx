// src/components/auth/AuthPage.jsx
import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { isValidPhone } from '../../utils';
import { EyeIcon, EyeOffIcon, ChevronRight, UserPlusIcon, XIcon } from '../ui/Icons';

export default function AuthPage({ onLogin }) {
  const { findUserByPhone, registerUser, login } = useStore();

  const [step, setStep]             = useState('phone'); // 'phone' | 'login' | 'signup'
  const [phone, setPhone]           = useState('');
  const [name, setName]             = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [errors, setErrors]         = useState({});
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConf]  = useState(false);
  const [shake, setShake]           = useState(false);

  // FIX: Use refs for focus chain instead of fragile getElementById
  const pwdRef  = useRef(null);
  const confRef = useRef(null);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const clearErr = (field) =>
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });

  // ── Step 1: Phone ──────────────────────────────────────────────────────────
  const handlePhone = () => {
    const errs = {};
    if (!phone.trim())          errs.phone = '⚠ Phone number is required.';
    else if (!isValidPhone(phone)) errs.phone = '⚠ Enter a valid 10–13 digit number.';
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(); return; }
    setErrors({});
    const user = findUserByPhone(phone);
    setStep(user ? 'login' : 'signup');
  };

  // ── Step 2: Login ──────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (!password) { setErrors({ password: '⚠ Password is required.' }); return; }
    const user = findUserByPhone(phone);
    if (!user || user.password !== password) {
      setErrors({ password: '✕ Incorrect password. Please try again.' });
      triggerShake();
      return;
    }
    login(user);
    onLogin();
  };

  // ── Step 3: Signup ─────────────────────────────────────────────────────────
  const handleSignup = () => {
    const errs = {};
    if (!name.trim())      errs.name     = '⚠ Full name is required.';
    if (password.length<6) errs.password = '⚠ Password must be at least 6 characters.';
    if (password!==confirm)errs.confirm  = '⚠ Passwords do not match.';
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(); return; }
    const user = registerUser(phone, name.trim(), password);
    login(user);
    onLogin();
  };

  const goBack = () => {
    setStep('phone');
    setPassword(''); setConfirm(''); setName('');
    setErrors({}); setShowPwd(false); setShowConf(false);
  };

  const goSignup = () => {
    if (!phone.trim() || !isValidPhone(phone)) {
      setErrors({ phone: '⚠ Enter your phone number first.' });
      return;
    }
    setErrors({});
    setStep('signup');
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(37,99,235,0.18)', filter:'blur(90px)', top:-150, left:-150, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(14,165,233,0.14)', filter:'blur(80px)', bottom:-100, right:-100, pointerEvents:'none' }} />

      {/* Auth card */}
      <div
        className={shake ? 'animate-shake' : 'animate-scale-in'}
        style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24,
          padding: '40px', width: '100%', maxWidth: 420,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
          <div style={{
            width:44, height:44, borderRadius:11, background:'var(--primary)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'1.125rem', color:'#fff',
            boxShadow:'0 4px 14px rgba(37,99,235,0.45)',
          }}>CB</div>
          <div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:'#fff', letterSpacing:'-0.01em' }}>CodingBolt</div>
            <div style={{ fontSize:'0.6875rem', color:'rgba(255,255,255,0.38)' }}>Client Management System</div>
          </div>
        </div>

        {/* Back button */}
        {step !== 'phone' && (
          <button
            onClick={goBack}
            style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5, color:'rgba(255,255,255,0.5)', fontSize:'0.8125rem', padding:0, marginBottom:20 }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </button>
        )}

        <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#fff', marginBottom:4, letterSpacing:'-0.02em' }}>
          {{ phone:'Welcome back', login:'Enter password', signup:'Create account' }[step]}
        </h2>
        <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.45)', marginBottom:26 }}>
          {{ phone:'Enter your phone number to continue', login:`Logging in as ${phone}`, signup:'Set up your CodingBolt workspace' }[step]}
        </p>

        {/* ── Phone ── */}
        {step === 'phone' && (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <DarkInput
              label="Phone Number" required type="tel" maxLength={15}
              placeholder="+91 98765 43210" value={phone}
              onChange={e => { setPhone(e.target.value); clearErr('phone'); }}
              onKeyDown={e => e.key === 'Enter' && handlePhone()}
              error={errors.phone}
            />
            <DarkButton onClick={handlePhone}>
              Continue <ChevronRight size={16} />
            </DarkButton>
            <p style={{ textAlign:'center', fontSize:'0.8125rem', color:'rgba(255,255,255,0.4)', margin:0 }}>
              New to CodingBolt?{' '}
              <button onClick={goSignup} style={{ background:'none', border:'none', cursor:'pointer', color:'#38BDF8', fontWeight:500, fontSize:'0.8125rem' }}>
                Create account
              </button>
            </p>
          </div>
        )}

        {/* ── Login ── */}
        {step === 'login' && (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <DarkInput
              label="Password" required
              type={showPwd ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); clearErr('password'); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              error={errors.password}
              suffix={
                <button onClick={() => setShowPwd(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', display:'flex', padding:2 }}>
                  {showPwd ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              }
            />
            <DarkButton onClick={handleLogin}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In
            </DarkButton>
          </div>
        )}

        {/* ── Signup ── */}
        {step === 'signup' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <DarkInput
              label="Full Name" required placeholder="Your full name"
              value={name}
              onChange={e => { setName(e.target.value); clearErr('name'); }}
              onKeyDown={e => e.key === 'Enter' && pwdRef.current?.focus()}
              error={errors.name}
            />
            <DarkInput
              ref={pwdRef}
              label="Create Password" required placeholder="Min. 6 characters"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); clearErr('password'); }}
              onKeyDown={e => e.key === 'Enter' && confRef.current?.focus()}
              error={errors.password}
              suffix={
                <button onClick={() => setShowPwd(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', display:'flex', padding:2 }}>
                  {showPwd ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              }
            />
            <DarkInput
              ref={confRef}
              label="Confirm Password" required placeholder="Repeat your password"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={e => { setConfirm(e.target.value); clearErr('confirm'); }}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              error={errors.confirm}
              suffix={
                <button onClick={() => setShowConf(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', display:'flex', padding:2 }}>
                  {showConfirm ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              }
            />
            <DarkButton onClick={handleSignup} style={{ marginTop:4 }}>
              <UserPlusIcon size={16} /> Create Account
            </DarkButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Dark-themed Input ────────────────────────────────────────────────────── */
const DarkInput = React.forwardRef(function DarkInput({ label, required, error, suffix, ...props }, ref) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      {label && (
        <label style={{ fontSize:'0.8125rem', fontWeight:500, color:'rgba(255,255,255,0.6)' }}>
          {label}{required && <span style={{ color:'#FCA5A5', marginLeft:2 }}>*</span>}
        </label>
      )}
      <div style={{ position:'relative' }}>
        <input
          ref={ref}
          style={{
            width:'100%', padding:'10px 14px', paddingRight: suffix ? 40 : 14,
            background:'rgba(255,255,255,0.07)',
            border: `1.5px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius:'var(--radius-md)', fontFamily:'inherit', fontSize:'0.875rem',
            color:'#fff', outline:'none', transition:'all 0.15s',
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? 'rgba(239,68,68,0.9)' : 'rgba(37,99,235,0.8)';
            e.target.style.background  = 'rgba(255,255,255,0.10)';
            e.target.style.boxShadow   = error ? '0 0 0 3px rgba(239,68,68,0.18)' : '0 0 0 3px rgba(37,99,235,0.2)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)';
            e.target.style.background  = 'rgba(255,255,255,0.07)';
            e.target.style.boxShadow   = '';
          }}
          {...props}
        />
        {suffix && (
          <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', display:'flex' }}>
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <div style={{ fontSize:'0.8125rem', color:'#FCA5A5', padding:'6px 10px', background:'rgba(239,68,68,0.15)', borderRadius:'var(--radius-sm)', borderLeft:'3px solid rgba(239,68,68,0.7)' }}>
          {error}
        </div>
      )}
    </div>
  );
});

/* ── Dark-themed Button ───────────────────────────────────────────────────── */
function DarkButton({ children, style = {}, ...props }) {
  return (
    <button
      style={{
        width:'100%', padding:'11px 16px', border:'none', cursor:'pointer',
        background:'var(--primary)', color:'#fff', borderRadius:'var(--radius-md)',
        fontSize:'0.9375rem', fontWeight:700, fontFamily:'inherit',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        transition:'all 0.15s', boxShadow:'0 4px 14px rgba(37,99,235,0.4)',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.background='var(--primary-dark)'; e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.transform=''; }}
      {...props}
    >
      {children}
    </button>
  );
}
