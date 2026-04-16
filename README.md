# CodingBolt CMS — React + Vite

A production-ready React web app for managing clients, employees, tasks, and payments.
Built with **React 18 + Vite 5**. No backend required — all state in memory via Context + useReducer.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
codingbolt-vite/
├── index.html              ← Vite entry HTML (root level, not /public)
├── vite.config.js          ← Vite config with React plugin
├── package.json
│
└── src/
    ├── main.jsx            ← React root entry
    ├── App.jsx             ← Root: auth gate, routing, logout modal
    ├── index.css           ← Design system: CSS variables, animations, responsive
    │
    ├── context/
    │   └── StoreContext.jsx  ← All app state (useReducer + Context API)
    │
    ├── hooks/
    │   └── useToast.js       ← Toast notification hook
    │
    ├── utils/
    │   └── index.js          ← formatDate, formatCurrency, avatarColor, constants
    │
    └── components/
        ├── ui/
        │   ├── index.jsx     ← All primitive components:
        │   │                   Button, Input, Select, Textarea, Badge, Avatar,
        │   │                   Card, Modal, ConfirmModal, ToastContainer,
        │   │                   SearchInput, FilterTabs, ProgressBar,
        │   │                   StatCard, UploadArea, EmptyState
        │   └── Icons.jsx     ← All SVG icon components
        │
        ├── auth/
        │   └── AuthPage.jsx      ← Phone → login / signup (3-step flow)
        ├── layout/
        │   └── Layout.jsx        ← Sidebar + topbar shell (responsive)
        ├── dashboard/
        │   └── Dashboard.jsx     ← Stats, recent activity
        ├── clients/
        │   └── Clients.jsx       ← Card grid, CRUD, profile %, dynamic fields
        ├── employees/
        │   └── Employees.jsx     ← Card grid, CRUD, task stats
        ├── tasks/
        │   └── Tasks.jsx         ← Kanban board, drag & drop, CRUD
        └── payments/
            └── Payments.jsx      ← Table, mark-paid, revenue summary
```

---

## 🐛 Bugs Fixed vs Original CRA Version

| # | Component | Bug | Fix |
|---|-----------|-----|-----|
| 1 | `Layout.jsx` | Mobile overlay had `display:'none'` hardcoded — never showed | Controlled via opacity + pointerEvents |
| 2 | `Layout.jsx` | Hamburger button had `display:'none'` — never appeared on mobile | Controlled by CSS `.mobile-menu-btn` class |
| 3 | `Tasks.jsx` | `dragging` state stored `{taskId, fromStatus}` object but was compared to a status string — drag & drop never worked | Store only `taskId` string, compare `task.status !== targetStatus` |
| 4 | `StoreContext.jsx` | `getStats` wrapped in `useCallback` with array deps caused stale closure on first render | Changed to plain function — always fresh |
| 5 | `Employees.jsx` | Edit form didn't preserve `joinedAt` — could be overwritten | Spread existing employee first: `{ ...editing, ...data }` |
| 6 | `AuthPage.jsx` | `document.getElementById()` used for focus chain — fragile DOM imperative in React | Uses `React.forwardRef` + `useRef` for focus |
| 7 | `index.js` | CRA `ReactDOM.createRoot` entry — incompatible with Vite | Renamed to `main.jsx`, updated to Vite pattern |
| 8 | `ui/index.jsx` | Icons mixed with components, unused imports | Icons split to `Icons.jsx`, imports cleaned |

---

## 🎨 Design System

All tokens in `src/index.css` as CSS variables.
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Primary**: `#2563EB` (blue)
- **Sidebar**: Dark navy `#0F172A`

---

## 📦 Deploy

```bash
npm run build
# Upload the /dist folder to Vercel, Netlify, or any static host
```
