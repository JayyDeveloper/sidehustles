# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hustleboard is a Progressive Web App (PWA) for tracking and managing side hustles. Built with React 19, TypeScript, and Vite, it features offline-first architecture with IndexedDB for local data persistence.

## Development Commands

```bash
npm run dev          # Start dev server on http://localhost:5173
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with Vitest UI
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Running Single Tests

```bash
npx vitest run path/to/test.test.ts           # Run specific test file
npx vitest run -t "test name pattern"         # Run tests matching pattern
npx vitest --watch path/to/test.test.ts       # Watch mode for specific file
```

## Architecture

### Data Flow

1. **Schema** (`src/types/schema.ts`): Central type definitions for all data structures
2. **Database Layer** (`src/lib/db.ts`): IndexedDB wrapper with typed CRUD operations
3. **Custom Hooks** (`src/hooks/`): Business logic and state management
4. **Context** (`src/context/AppContext.tsx`): Global state provider aggregating all hooks
5. **Components** (`src/components/`): UI components consuming context
6. **Routes** (`src/routes/`): Page-level components

### State Management Pattern

The app uses a **Context + Custom Hooks** pattern instead of Redux/Zustand:

- **AppContext** aggregates three custom hooks:
  - `useHustles` - CRUD operations, status changes, sub-entity management (notes, resources, transactions, tasks, goals)
  - `useSettings` - Theme and app preferences
  - `useToast` - Toast notifications with undo functionality

- All components access state via `useApp()` hook
- Business logic lives in custom hooks, keeping components presentational

### Database Architecture

IndexedDB with three object stores:

1. **hustles** - Main entity store with indexes:
   - `by-status` - For filtering active/future/archived
   - `by-priority` - For priority-based queries
   - `by-createdAt` - For chronological sorting
   - `by-order` - For drag-and-drop ordering

2. **settings** - Single document store for app settings

3. **syncQueue** - Future sync capability (currently unused)

All database operations are in `src/lib/db.ts` exported as:
- `hustleDB` - CRUD for hustles
- `settingsDB` - Settings persistence
- `syncQueueDB` - Sync queue operations

### Type System

The `Hustle` type is the core domain model containing nested entities:
- `Note[]` - Markdown notes with timestamps
- `Resource[]` - External links/references
- `Transaction[]` - Financial records (income/expense/investment)
- `Task[]` - To-do items
- `Goal[]` - Financial goals with progress tracking
- `StreakData` - Work streak tracking
- `ActivityLogEntry[]` - Audit trail

Input types (e.g., `CreateHustleInput`, `UpdateHustleInput`) provide validation and partial updates.

### PWA Configuration

PWA setup in `vite.config.ts`:
- Service worker with Workbox for offline support
- Auto-update registration strategy
- Caches all static assets + Google Fonts
- Manifest configured for iOS/Android installation

During development, service worker is enabled (`devOptions.enabled: true`) for testing PWA features.

### Component Patterns

Components follow these conventions:
- Presentational components receive props, no direct context access
- Container components (routes) use `useApp()` for state
- Panels (e.g., `NotesPanel`, `FinancePanel`) handle sub-entity CRUD within a hustle
- Modal components for forms (`HustleForm` used for both create/edit)

### Routing Structure

Two main routes:
- `/` - Dashboard with status-grouped lists (active/future/archived)
- `/hustle/:id` - Detail view with tabbed panels for notes, resources, transactions, etc.

Navigation handled by React Router v7.

## Key Files to Understand

1. `src/types/schema.ts` - Complete type system (read this first)
2. `src/lib/db.ts` - Database operations and schema
3. `src/hooks/useHustles.ts` - Core business logic
4. `src/context/AppContext.tsx` - State provider integration
5. `vite.config.ts` - PWA and build configuration

## Adding Features

### New Data Field to Hustle

1. Update `Hustle` type in `src/types/schema.ts`
2. Update database schema version in `src/lib/db.ts` if adding indexes
3. Add corresponding input type if needed
4. Update `useHustles` hook with any new operations
5. Expose in AppContext if needed by multiple components

### New Sub-Entity Type

Follow the pattern of existing sub-entities (notes/resources/transactions):

1. Define types in `src/types/schema.ts` (entity + create input)
2. Add to `Hustle` type as array property
3. Add CRUD functions in `useHustles` hook
4. Expose functions in AppContext
5. Create Panel component for UI (see `NotesPanel.tsx` as reference)

### New Page/Route

1. Create component in `src/routes/`
2. Add route in `App.tsx` Routes
3. Add navigation link in `Header.tsx` if needed

## Tailwind Configuration

Custom glassmorphism theme with cyan accents:
- Glass cards: `backdrop-blur-lg bg-white/10` (dark mode)
- Accent color: `cyan-500` (#0891b2)
- Extended color palette in `tailwind.config.js`
- Tailwind Forms plugin enabled for better form styling

## Testing

Tests use Vitest + React Testing Library:
- Setup file: `src/test/setup.ts`
- Run with `npm run test`
- UI mode for debugging: `npm run test:ui`
- Tests run in jsdom environment with globals enabled
