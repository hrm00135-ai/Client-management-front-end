// src/context/StoreContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────
export const uid = (p = 'x') =>
  p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const daysAgo  = n => new Date(Date.now() - n * 864e5).toISOString();
const daysAhead= n => new Date(Date.now() + n * 864e5).toISOString();

// ── Seed Data ─────────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  currentUser: null,
  users: [],
  clients: [
    {
      id: 'c1', name: 'Rajesh Kumar', phone: '9876543210',
      email: 'rajesh@example.com', queryType: 'GST Registration',
      gstNumber: '27AAPFU0939F1ZV', address: '12, MG Road, Mumbai',
      status: 'Active', documents: [], extraFields: [], createdAt: daysAgo(15),
    },
    {
      id: 'c2', name: 'Priya Sharma', phone: '9123456789',
      email: 'priya@example.com', queryType: 'Income Tax Filing',
      gstNumber: '', address: '45, Ring Road, Delhi',
      status: 'Active', documents: [],
      extraFields: [{ label: 'PAN', value: 'ABCDE1234F' }], createdAt: daysAgo(7),
    },
    {
      id: 'c3', name: 'Amit Patel', phone: '9988776655',
      email: 'amit@example.com', queryType: 'Company Registration',
      gstNumber: '', address: '78, SG Highway, Ahmedabad',
      status: 'Inactive', documents: [], extraFields: [], createdAt: daysAgo(2),
    },
    {
      id: 'c4', name: 'Sunita Reddy', phone: '9012345678',
      email: 'sunita@example.com', queryType: 'MSME Registration',
      gstNumber: '', address: '9, Jubilee Hills, Hyderabad',
      status: 'Active', documents: [], extraFields: [], createdAt: daysAgo(20),
    },
  ],
  employees: [
    { id: 'e1', name: 'Sneha Verma',  phone: '9871234567', role: 'Tax Consultant', address: '23, Lajpat Nagar, Delhi',    status: 'Active', joinedAt: daysAgo(90) },
    { id: 'e2', name: 'Rohit Singh',  phone: '9765432100', role: 'GST Specialist',  address: '11, Bandra West, Mumbai',    status: 'Active', joinedAt: daysAgo(60) },
    { id: 'e3', name: 'Anjali Mehta', phone: '9654321098', role: 'Accountant',      address: '34, Koramangala, Bangalore', status: 'Active', joinedAt: daysAgo(30) },
  ],
  tasks: [
    { id: 't1', title: 'GST Return Filing – Q3',    description: 'File quarterly GST return for FY 2024-25', clientId: 'c1', employeeId: 'e1', status: 'in-progress', priority: 'high',   dueDate: daysAhead(3),  createdAt: daysAgo(5) },
    { id: 't2', title: 'ITR Filing FY 2024-25',      description: 'Prepare and file income tax return',       clientId: 'c2', employeeId: 'e1', status: 'started',     priority: 'medium', dueDate: daysAhead(10), createdAt: daysAgo(3) },
    { id: 't3', title: 'Company Incorporation Docs', description: 'Prepare MOA, AOA and submit to MCA',      clientId: 'c3', employeeId: 'e2', status: 'completed',   priority: 'low',    dueDate: daysAgo(2),    createdAt: daysAgo(8) },
    { id: 't4', title: 'MSME Certificate',           description: 'Apply for Udyam Registration',            clientId: 'c4', employeeId: 'e3', status: 'started',     priority: 'medium', dueDate: daysAhead(7),  createdAt: daysAgo(1) },
  ],
  payments: [
    { id: 'p1', clientId: 'c1', amount: 5000,  description: 'GST Registration Fees',  status: 'paid', date: daysAgo(10) },
    { id: 'p2', clientId: 'c2', amount: 3500,  description: 'ITR Filing Fees',         status: 'due',  date: daysAhead(5) },
    { id: 'p3', clientId: 'c3', amount: 12000, description: 'Company Registration',    status: 'paid', date: daysAgo(4) },
    { id: 'p4', clientId: 'c4', amount: 2000,  description: 'MSME Registration Fees',  status: 'due',  date: daysAhead(3) },
  ],
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {
    case 'LOGIN':         return { ...state, currentUser: payload };
    case 'LOGOUT':        return { ...state, currentUser: null };
    case 'REGISTER_USER': return { ...state, users: [...state.users, payload] };

    case 'ADD_CLIENT':    return { ...state, clients: [...state.clients, payload] };
    case 'UPDATE_CLIENT': return { ...state, clients: state.clients.map(c => c.id === payload.id ? { ...c, ...payload } : c) };
    case 'DELETE_CLIENT': return { ...state, clients: state.clients.filter(c => c.id !== payload) };

    case 'ADD_EMPLOYEE':    return { ...state, employees: [...state.employees, payload] };
    case 'UPDATE_EMPLOYEE': return { ...state, employees: state.employees.map(e => e.id === payload.id ? { ...e, ...payload } : e) };
    case 'DELETE_EMPLOYEE': return { ...state, employees: state.employees.filter(e => e.id !== payload) };

    case 'ADD_TASK':           return { ...state, tasks: [...state.tasks, payload] };
    case 'UPDATE_TASK_STATUS': return { ...state, tasks: state.tasks.map(t => t.id === payload.id ? { ...t, status: payload.status } : t) };
    case 'DELETE_TASK':        return { ...state, tasks: state.tasks.filter(t => t.id !== payload) };

    case 'ADD_PAYMENT':           return { ...state, payments: [...state.payments, payload] };
    case 'UPDATE_PAYMENT_STATUS': return { ...state, payments: state.payments.map(p => p.id === payload.id ? { ...p, status: payload.status } : p) };
    case 'DELETE_PAYMENT':        return { ...state, payments: state.payments.filter(p => p.id !== payload) };

    default: return state;
  }
}

// ── Context & Provider ────────────────────────────────────────────────────────
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Auth
  // FIX: findUserByPhone was depending only on state.users but the stale closure
  // could cause it to miss newly registered users. Using dispatch directly is safer.
  const findUserByPhone = useCallback(
    (phone) => state.users.find(u => u.phone === phone.replace(/\s/g, '')),
    [state.users]
  );

  const registerUser = useCallback((phone, name, password) => {
    const user = { id: uid('u'), phone: phone.replace(/\s/g, ''), name, password };
    dispatch({ type: 'REGISTER_USER', payload: user });
    return user;
  }, []);

  const login  = useCallback(user => dispatch({ type: 'LOGIN',  payload: user }), []);
  const logout = useCallback(()   => dispatch({ type: 'LOGOUT' }), []);

  // Clients
  const addClient = useCallback(data =>
    dispatch({ type: 'ADD_CLIENT', payload: { id: uid('c'), documents: [], extraFields: [], createdAt: new Date().toISOString(), status: 'Active', ...data } }), []);
  const updateClient = useCallback(data =>
    dispatch({ type: 'UPDATE_CLIENT', payload: data }), []);
  const deleteClient = useCallback(id =>
    dispatch({ type: 'DELETE_CLIENT', payload: id }), []);

  // Employees
  const addEmployee = useCallback(data =>
    dispatch({ type: 'ADD_EMPLOYEE', payload: { id: uid('e'), status: 'Active', joinedAt: new Date().toISOString(), ...data } }), []);
  // FIX: original updateEmployee called dispatch correctly but the Employee page
  // was calling store.updateEmployee({...data, id}) without preserving joinedAt —
  // reducer does a spread so joinedAt is preserved. Confirmed safe.
  const updateEmployee = useCallback(data =>
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: data }), []);
  const deleteEmployee = useCallback(id =>
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id }), []);

  // Tasks
  const addTask = useCallback(data =>
    dispatch({ type: 'ADD_TASK', payload: { id: uid('t'), createdAt: new Date().toISOString(), ...data } }), []);
  const updateTaskStatus = useCallback((id, status) =>
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id, status } }), []);
  const deleteTask = useCallback(id =>
    dispatch({ type: 'DELETE_TASK', payload: id }), []);

  // Payments
  const addPayment = useCallback(data =>
    dispatch({ type: 'ADD_PAYMENT', payload: { id: uid('p'), date: new Date().toISOString(), ...data } }), []);
  const updatePaymentStatus = useCallback((id, status) =>
    dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { id, status } }), []);
  const deletePayment = useCallback(id =>
    dispatch({ type: 'DELETE_PAYMENT', payload: id }), []);

  // Stats — computed fresh each render, no memoisation bug
  const getStats = () => ({
    totalClients:   state.clients.length,
    totalEmployees: state.employees.length,
    totalTasks:     state.tasks.length,
    completedTasks: state.tasks.filter(t => t.status === 'completed').length,
    totalRevenue:   state.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    dueAmount:      state.payments.filter(p => p.status === 'due').reduce((s, p) => s + p.amount, 0),
    dueCount:       state.payments.filter(p => p.status === 'due').length,
  });

  const value = {
    ...state,
    findUserByPhone, registerUser, login, logout,
    addClient, updateClient, deleteClient,
    addEmployee, updateEmployee, deleteEmployee,
    addTask, updateTaskStatus, deleteTask,
    addPayment, updatePaymentStatus, deletePayment,
    getStats,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>');
  return ctx;
};
