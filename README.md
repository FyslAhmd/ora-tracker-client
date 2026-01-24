# ORS Tracker - Frontend

A modern, responsive web application for managing Operational Roadworthiness Score (ORS) inspections. Built with React, TypeScript, and Tailwind CSS.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Pages Overview](#-pages-overview)
- [Test Credentials](#-test-credentials)
- [Mobile Responsiveness](#-mobile-responsiveness)

## ✨ Features

### User Interface
- **Modern Glass-morphism Design** - Sleek, professional UI with blur effects
- **Fully Responsive** - Mobile-first design for all screen sizes
- **Dark Theme** - Easy on the eyes with gradient accents
- **Smooth Animations** - Framer Motion for polished transitions
- **Toast Notifications** - Real-time feedback for user actions

### Authentication
- **Secure Login/Register** - JWT-based authentication
- **Persistent Sessions** - Token stored in localStorage
- **Protected Routes** - Automatic redirects for unauthenticated users
- **Role-Based UI** - Features shown/hidden based on user role

### Dashboard
- **Real-time Statistics** - Total inspections, average score, critical alerts
- **Score Distribution** - Visual breakdown by score levels
- **Recent Inspections** - Quick view of latest ORS plans
- **Welcome Card** - Personalized greeting with role info

### ORS Plans Management
- **Card & Table Views** - Toggle between visual layouts
- **Advanced Filtering** - Search, status, vehicle type filters
- **Pagination** - Efficient data loading
- **CRUD Operations** - Create, view, edit, delete plans
- **Score Visualization** - Color-coded score badges

### User Management (Admin)
- **User List** - View all system users
- **Create Users** - Add new admin, inspector, or viewer
- **Edit Users** - Modify user details and roles
- **Delete Users** - Remove users from system

### Analytics
- **Score Distribution Charts** - Visual bar charts
- **Status Overview** - Plans by status breakdown
- **Fleet Insights** - Key metrics at a glance
- **Pass Rate** - Percentage of good/excellent scores

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Redux Toolkit** | State management |
| **TanStack Query v5** | Server state & caching |
| **React Router v6** | Client-side routing |
| **React Hook Form** | Form handling |
| **Framer Motion** | Animations |
| **Axios** | HTTP client |
| **React Hot Toast** | Notifications |
| **React Icons** | Icon library |

## 🔄 How It Works

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    React Router                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │ │
│  │  │  Login   │ │Dashboard │ │ORS Plans │ │  Users    │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Redux Store (Auth State)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           TanStack Query (Server State)                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### State Management
- **Redux Toolkit** - Manages authentication state (user, token, loading)
- **TanStack Query** - Handles server data fetching, caching, and mutations
- **React Hook Form** - Manages form state and validation

### Authentication Flow
1. User enters credentials on Login page
2. Redux action dispatches login request to API
3. On success, token is stored in localStorage and Redux
4. AuthGuard component protects routes
5. API service automatically attaches token to requests

### Data Flow
1. Components use TanStack Query hooks to fetch data
2. Data is cached and automatically refetched when stale
3. Mutations trigger cache invalidation for fresh data
4. Loading and error states are handled automatically

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── guards/
│   │   │   ├── AuthGuard.tsx    # Route protection
│   │   │   └── RoleGuard.tsx    # Role-based access
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Top navigation bar
│   │   │   ├── Sidebar.tsx      # Side navigation
│   │   │   └── MainLayout.tsx   # Page layout wrapper
│   │   ├── ors/
│   │   │   ├── ORSCard.tsx      # Plan card component
│   │   │   ├── ORSForm.tsx      # Create/Edit form
│   │   │   ├── ORSTable.tsx     # Plans table view
│   │   │   └── ScoreBadge.tsx   # Score indicator
│   │   └── ui/
│   │       ├── Button.tsx       # Button component
│   │       ├── Input.tsx        # Input component
│   │       ├── Modal.tsx        # Modal dialog
│   │       ├── Card.tsx         # Card container
│   │       └── ...              # Other UI components
│   ├── features/
│   │   └── auth/
│   │       └── authSlice.ts     # Redux auth slice
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth hook
│   │   ├── usePermissions.ts    # Permission hook
│   │   └── useRedux.ts          # Typed Redux hooks
│   ├── pages/
│   │   ├── Dashboard.tsx        # Dashboard page
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Register page
│   │   ├── ORSPlans.tsx         # ORS plans page
│   │   ├── Users.tsx            # User management
│   │   └── Analytics.tsx        # Analytics page
│   ├── services/
│   │   ├── api.ts               # Axios instance
│   │   ├── authService.ts       # Auth API calls
│   │   ├── orsService.ts        # ORS API calls
│   │   └── usersService.ts      # Users API calls
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── utils/
│   │   └── constants.ts         # App constants
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   ├── store.ts                 # Redux store
│   └── index.css                # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL** (optional)
   
   The API URL defaults to `http://localhost:5000/api`. To change it, create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Production Build

```bash
npm run build
```

The build output will be in the `dist/` folder, ready to deploy to any static hosting service.

## 📱 Pages Overview

### Login Page (`/login`)
- Email and password authentication
- Show/hide password toggle
- Error message display
- Link to registration

### Register Page (`/register`)
- Name, email, password fields
- Password confirmation
- Input validation
- Redirect to login on success

### Dashboard (`/dashboard`)
- Statistics cards (Total, Average Score, Critical)
- Welcome card with user info
- Recent inspections list
- Quick navigation

### ORS Plans (`/ors-plans`)
- Search and filter controls
- Card/Table view toggle
- Create new plan button
- Pagination controls
- Edit/Delete actions (role-based)

### Users (`/users`) - Admin Only
- User list with search/filter
- Mobile: Card view
- Desktop: Table view
- Create/Edit/Delete modals

### Analytics (`/analytics`)
- Score distribution chart
- Status distribution chart
- Fleet insights cards

## 🔐 Test Credentials

Use these credentials to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@ors.com | admin123 | Full access |
| **Inspector** | john@ors.com | inspector123 | Create & edit own plans |
| **Viewer** | jane@ors.com | viewer123 | Read-only access |

### What Each Role Can Do

#### Admin
- ✅ View Dashboard & Analytics
- ✅ View all ORS Plans
- ✅ Create new ORS Plans
- ✅ Edit any ORS Plan
- ✅ Delete any ORS Plan
- ✅ Access User Management
- ✅ Create/Edit/Delete Users

#### Inspector
- ✅ View Dashboard & Analytics
- ✅ View all ORS Plans
- ✅ Create new ORS Plans
- ✅ Edit own ORS Plans
- ❌ Delete ORS Plans
- ❌ Access User Management

#### Viewer
- ✅ View Dashboard & Analytics
- ✅ View all ORS Plans
- ❌ Create ORS Plans
- ❌ Edit ORS Plans
- ❌ Delete ORS Plans
- ❌ Access User Management

## 📱 Mobile Responsiveness

The application is fully responsive with a mobile-first approach:

### Layout
- **Desktop (1024px+)**: Fixed sidebar, full header
- **Tablet (768px-1023px)**: Collapsible sidebar, compact layout
- **Mobile (<768px)**: Slide-in drawer navigation, hamburger menu

### Components Optimized for Mobile
- **Sidebar**: Converts to slide-in drawer with overlay
- **Header**: Hamburger menu, mobile logo
- **Tables**: Convert to card view or horizontal scroll
- **Modals**: Full-width, slide-up from bottom
- **Pagination**: Compact "1/5" format
- **Forms**: Single column layout

### Breakpoints Used
| Breakpoint | Screen Size | Tailwind Class |
|------------|-------------|----------------|
| Mobile | < 640px | Default |
| Small | ≥ 640px | `sm:` |
| Medium | ≥ 768px | `md:` |
| Large | ≥ 1024px | `lg:` |
| Extra Large | ≥ 1280px | `xl:` |

## 🎨 UI Components

### Available Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, danger, ghost variants |
| `Input` | Text input with label, error, icons |
| `Select` | Dropdown select component |
| `Modal` | Dialog with backdrop |
| `Card` | Container with glass effect |
| `Badge` | Status/label indicator |
| `Alert` | Success, error, warning, info messages |
| `LoadingSpinner` | Loading indicator |
| `Pagination` | Page navigation |
| `Textarea` | Multi-line text input |

### Score Colors

| Level | Score | Background | Text |
|-------|-------|------------|------|
| Excellent | 90-100 | Green | White |
| Good | 70-89 | Blue | White |
| Fair | 50-69 | Yellow | Dark |
| Poor | 30-49 | Orange | White |
| Critical | 0-29 | Red | White |

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on port 5000
   - Check VITE_API_URL in .env file
   - Verify CORS settings in backend

2. **Login Not Working**
   - Run `npm run seed` in backend to create test users
   - Check browser console for errors
   - Verify credentials are correct

3. **Styles Not Loading**
   - Run `npm install` to ensure Tailwind is installed
   - Check that PostCSS is configured correctly

4. **Build Errors**
   - Run `npm run lint` to check for TypeScript errors
   - Ensure all dependencies are installed

## 🔧 Configuration Files

### vite.config.ts
- Configured with React plugin
- Path alias `@/` points to `src/`
- Proxy can be added for API in development

### tailwind.config.js
- Custom colors for dark theme
- Extended with primary and dark color palettes
- Custom animations configured

### tsconfig.json
- Strict TypeScript settings
- Path mapping for `@/` alias
- React JSX configuration

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**
