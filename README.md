# TaskFlow Pro

[![CI](https://github.com/xr-susan/TaskFlow-Pro/actions/workflows/ci.yml/badge.svg)](https://github.com/xr-susan/TaskFlow-Pro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vitejs.dev/)

A task management web application built with React 18, TypeScript, Zustand and Tailwind CSS.
Everything runs in the browser — tasks, categories and preferences are persisted to
`localStorage`, so there is no backend to run and no account to create.

## ✨ Features

### Core task management

- ✅ Create, edit and delete tasks
- ✅ Mark tasks complete / incomplete, with a completion timestamp
- ✅ Drag-and-drop reordering, plus keyboard reordering (focus the grip handle and press `↑` / `↓`)
- ✅ Batch operations: select multiple tasks, delete them or move them to another category

### Organisation

- ✅ Custom categories with colours
- ✅ Priority levels (High / Medium / Low)
- ✅ Due date tracking with overdue and "due soon" highlighting
- ✅ Search tasks by title

### Filtering & views

- ✅ Filter by status (All / Active / Completed / Overdue)
- ✅ Filter by priority
- ✅ Filter by category
- ✅ Combined filters — all filters apply together

### Analytics

- ✅ Completion rate
- ✅ Priority distribution chart
- ✅ Category distribution chart
- ✅ Weekly completion trend

### User experience

- ✅ Responsive layout (mobile / tablet / desktop)
- ✅ Dark mode, persisted across sessions
- ✅ Empty states that distinguish "no tasks" from "no matches"
- ✅ Data export / import from the Settings page

## 🛠️ Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 18 |
| Language | TypeScript 5 (strict mode) |
| Build | Vite 5 |
| State | Zustand 4 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 |
| Charts | Chart.js 4 via react-chartjs-2 |
| Tests | Vitest + Testing Library (jsdom) |
| Lint | ESLint 8 + `@typescript-eslint` + `react-hooks` |

## 📦 Getting started

### Prerequisites

- Node.js 18 or newer (Vite 5 requires 18+)
- npm 9+

### Install and run

```bash
git clone https://github.com/xr-susan/TaskFlow-Pro.git
cd TaskFlow-Pro
npm install
npm run dev
```

The dev server starts at **http://localhost:3000** and opens automatically.

## 📜 Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Typecheck with `tsc`, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run typecheck` | Typecheck without emitting |
| `npm run lint` | ESLint over `src`, zero warnings tolerated |

## 🧪 Testing

```bash
npm test
```

64 tests across three layers, running on Vitest with jsdom:

| Area | File | Tests | What is covered |
| --- | --- | --- | --- |
| Date utilities | `src/utils/formatDate.test.ts` | 18 | Formatting, overdue detection, relative time, day counts, timezone-stable behaviour |
| Store | `src/stores/taskStore.test.ts` | 29 | CRUD, completion timestamps, reordering, filtering, statistics, categories, selection, persistence |
| Component | `src/components/TaskList/TaskList.test.tsx` | 17 | Rendering, empty states, drag-and-drop reordering, keyboard reordering, reordering while a filter is active |

Reordering is the trickiest part of the app, so it is covered from both the store side
(that orders stay contiguous) and the component side (that dragging and `↑` / `↓` produce
the expected visible order).

## 📁 Project structure

```text
src/
├── components/
│   ├── Header/          # Navigation header, dark mode toggle
│   ├── Statistics/      # Analytics charts
│   ├── TaskCard/        # Single task row, incl. drag handle
│   ├── TaskFilter/      # Search box, status/priority/category chips
│   ├── TaskForm/        # Create / edit modal
│   └── TaskList/        # List container + drag-and-drop orchestration
├── pages/
│   ├── Home.tsx         # Main task view
│   ├── Analytics.tsx    # Statistics page
│   └── Settings.tsx     # Dark mode, categories, export / import
├── stores/
│   └── taskStore.ts     # Zustand store: state, actions, computed selectors
├── hooks/
│   └── useLocalStorage.ts
├── types/
│   └── task.ts          # Shared interfaces and display config
├── utils/
│   └── formatDate.ts    # Date helpers
├── test/
│   └── setup.ts         # Vitest setup (jest-dom, localStorage reset)
├── App.tsx              # Router + dark mode side effect
└── main.tsx             # Entry point
```

## 🎯 Usage

### Managing tasks

1. Click **Add Task** to create a task.
2. Fill in the title, description, priority, category and due date.
3. Click the circle to toggle completion.
4. Use the edit (✏️) and delete (🗑️) buttons that appear on hover.

### Reordering

- **Mouse**: drag a card and drop it where you want it.
- **Keyboard**: `Tab` to a card's grip handle (⠿, revealed on hover or focus), then press `↑` or `↓`.

Reordering is stored on a global `order` field, so it behaves correctly even while a
filter is hiding some tasks — the visible tasks keep their relative order.

### Batch operations

1. Tick the checkbox on two or more tasks.
2. Use the batch action bar to move the selection to another category or delete it.

### Analytics

The **Analytics** page shows completion rate, priority distribution, category breakdown
and the weekly completion trend.

### Settings

The **Settings** page lets you toggle dark mode, manage categories, and export or import
your data as JSON.

## 📱 Responsive design

- **Mobile** (< 640px): single column, compact cards
- **Tablet** (640px – 1024px): optimised layout
- **Desktop** (> 1024px): full feature display

## 🌙 Dark mode

Use the moon / sun icon in the header. The preference is saved and restored on the next visit.

## 💾 Data storage

Everything is stored in your browser's `localStorage`:

| Key | Contents |
| --- | --- |
| `taskflow-tasks` | All tasks |
| `taskflow-categories` | Categories |
| `taskflow-darkmode` | Theme preference |

Nothing leaves your machine. Use the export / import feature in Settings to back up or
move your data between browsers.

## 🚀 Deployment

The build output in `dist/` is a static site, so any static host works.

**Vercel**

1. Push the repository to GitHub.
2. Import it at [vercel.com](https://vercel.com).
3. Deploy — Vercel detects Vite automatically.

**Netlify**

1. Import the repository at [netlify.com](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`

**GitHub Pages** also works; the app uses `BrowserRouter`, so configure a SPA fallback
(rewrite all paths to `index.html`) or switch to `HashRouter`.

## 🖼️ Screenshots

The repository does not ship screenshots yet. To add them, capture the screens below and
place them in `docs/screenshots/`, then reference them from this section:

| Suggested filename | Screen |
| --- | --- |
| `docs/screenshots/home-light.png` | Task list, light mode |
| `docs/screenshots/home-dark.png` | Task list, dark mode |
| `docs/screenshots/analytics.png` | Analytics page with charts |
| `docs/screenshots/settings.png` | Settings page |

## 📄 License

MIT — see [LICENSE](LICENSE).

## 👤 Author

**Xiaorou He** — [ymsusan8748@qq.com](mailto:ymsusan8748@qq.com)

---

⭐ If you found this project useful, a star is appreciated.
