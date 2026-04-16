// src/utils/index.js

export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatCurrency = (amount) =>
  '₹' + Number(amount).toLocaleString('en-IN');

export const isValidPhone = (phone) =>
  /^\+?[0-9]{10,13}$/.test(phone.replace(/[\s\-()]/g, ''));

export const calcProfileCompletion = (client) => {
  const fields = ['name', 'phone', 'email', 'queryType', 'address', 'gstNumber'];
  const filled  = fields.filter(f => client[f]?.toString().trim()).length;
  const extra   = (client.extraFields?.length || 0) > 0 ? 1 : 0;
  return Math.round(((filled + extra) / (fields.length + 1)) * 100);
};

const AVATAR_COLORS = [
  '#2563EB', '#0EA5E9', '#6366F1', '#8B5CF6',
  '#EC4899', '#10B981', '#F59E0B', '#EF4444',
  '#14B8A6', '#F97316', '#84CC16', '#06B6D4',
];

export const avatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const QUERY_TYPES = [
  'GST Registration', 'GST Return Filing', 'Income Tax Filing',
  'Company Registration', 'LLP Registration', 'MSME Registration',
  'Trademark Registration', 'Accounting', 'Other',
];

export const EMPLOYEE_ROLES = [
  'Tax Consultant', 'GST Specialist', 'CA', 'Accountant',
  'Legal Advisor', 'Support Staff', 'Manager', 'Other',
];

export const TASK_STATUS_META = {
  started:      { label: 'Started',     color: '#6366F1', dot: '#6366F1' },
  'in-progress':{ label: 'In Progress', color: '#F59E0B', dot: '#F59E0B' },
  completed:    { label: 'Completed',   color: '#10B981', dot: '#10B981' },
};

export const PRIORITY_META = {
  high:   { label: 'High',   color: '#EF4444' },
  medium: { label: 'Medium', color: '#F59E0B' },
  low:    { label: 'Low',    color: '#10B981' },
};
