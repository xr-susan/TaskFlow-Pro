# TaskFlow Pro

A professional task management web application built with React, TypeScript, and modern web technologies.

## ✨ Features

### Core Task Management
- ✅ Create, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Batch operations (delete, move to category)
- ✅ Drag-and-drop task reordering

### Organization
- ✅ Create custom categories with colors
- ✅ Priority levels (High, Medium, Low)
- ✅ Due date tracking with overdue alerts
- ✅ Search tasks by title

### Filtering & Views
- ✅ Filter by status (All, Active, Completed, Overdue)
- ✅ Filter by priority
- ✅ Filter by category
- ✅ Combined filters support

### Analytics & Statistics
- ✅ Task completion rate
- ✅ Priority distribution chart
- ✅ Category distribution chart
- ✅ Weekly completion trend

### User Experience
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Empty state guidance
- ✅ Data persistence with localStorage

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **localStorage** - Data persistence

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow-pro.git
   cd taskflow-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── Header/          # Navigation header
│   ├── TaskCard/        # Individual task display
│   ├── TaskFilter/      # Search and filter controls
│   ├── TaskForm/        # Task create/edit modal
│   ├── TaskList/        # Task list container
│   └── Statistics/      # Analytics charts
├── stores/
│   └── taskStore.ts     # Zustand state management
├── types/
│   └── task.ts          # TypeScript interfaces
├── pages/
│   ├── Home.tsx         # Main task view
│   ├── Analytics.tsx    # Statistics page
│   └── Settings.tsx     # App settings
├── hooks/
│   └── useLocalStorage.ts
├── utils/
│   └── formatDate.ts    # Date utilities
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## 🎯 Usage

### Managing Tasks
1. Click **"Add Task"** to create a new task
2. Fill in the task details (title, description, priority, category, due date)
3. Click on a task's checkbox to mark it complete
4. Use the edit (✏️) and delete (🗑️) buttons on each task

### Filtering Tasks
- Use the search bar to find tasks by title
- Click status chips (All, Active, Completed, Overdue)
- Click priority chips (High, Medium, Low)
- Click category chips to filter by category

### Batch Operations
1. Select multiple tasks using the checkboxes
2. Use the batch action bar to:
   - Move tasks to a different category
   - Delete selected tasks

### Analytics
Visit the **Analytics** page to view:
- Task completion rate
- Priority distribution
- Category breakdown
- Weekly completion trends

### Settings
In the **Settings** page you can:
- Toggle dark mode
- Manage categories (add, edit, delete)
- Export/import your data

## 📱 Responsive Design

- **Mobile** (< 640px): Single column, compact cards
- **Tablet** (640px - 1024px): Optimized layout
- **Desktop** (> 1024px): Full feature display

## 🌙 Dark Mode

Click the moon/sun icon in the header to toggle dark mode. Your preference is saved automatically.

## 💾 Data Storage

All data is stored locally in your browser's localStorage:
- Tasks and categories persist between sessions
- Use the Export/Import feature in Settings for backups

## 🚀 Deployment

### Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (no configuration needed)

### Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`

## 📄 License

MIT License

## 👨‍💻 Author

Your Name - [your-email@example.com](mailto:your-email@example.com)

---

⭐ If you found this project helpful, please give it a star!
