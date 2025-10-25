# Hustleboard - Side Hustle Tracker PWA

A modern, mobile-first Progressive Web App (PWA) for tracking and managing your side hustles. Built with React, TypeScript, and Tailwind CSS, featuring offline support, local data persistence, and a beautiful glassmorphism UI.

## Features

### Core Functionality
- **Full CRUD Operations**: Create, read, update, and delete hustles with ease
- **Status Management**: Organize hustles into Active, Future, and Archived categories
- **Drag-and-Drop Reordering**: Intuitive list reordering within each status category
- **Rich Data Model**: Track notes, resources, transactions, and activity logs for each hustle

### Financial Tracking
- **Transaction Management**: Record income, expenses, and investments
- **Analytics Dashboard**: View total income, expenses, and net profit across all hustles
- **Per-Hustle Finance**: Detailed financial breakdown for individual hustles

### User Experience
- **Glassmorphism UI**: Modern, frosted-glass design with subtle animations
- **Dark/Light Themes**: Toggle between dark and light modes
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Offline Support**: Full functionality without internet connection
- **PWA Install**: Install as a native app on iOS and Android

### Data Management
- **IndexedDB Storage**: Fast, local data persistence
- **Export/Import**: Export individual hustles or entire database as JSON
- **Seed Data**: Sample hustles for quick testing and demos

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with glassmorphism theme
- **Routing**: React Router v7
- **Database**: IndexedDB via `idb` library
- **PWA**: Vite PWA Plugin with Workbox
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## Usage

### Creating Your First Hustle

1. Click the "New Hustle" button on the dashboard
2. Fill in the hustle details (name, status, priority, description, tags)
3. Click "Create Hustle"

### Managing Hustles

- **View Details**: Click on any hustle card to see full details
- **Edit**: Click the "Edit" button on the detail page
- **Reorder**: Drag and drop hustles within their status lists
- **Change Status**: Use "Move to Active" or "Move to Future" buttons
- **Archive**: Click "Archive" to move to archived status
- **Delete**: Click "Delete" with confirmation
- **Duplicate**: Create a copy of a hustle
- **Export**: Download hustle as JSON

### Adding Notes, Resources, and Transactions

On the hustle detail page:

1. **Notes**: Click "Add Note" to create markdown-formatted notes
2. **Resources**: Click "Add Resource" to save useful links and references
3. **Transactions**: Click "Add Transaction" to record financial activities

### PWA Installation

#### Desktop
1. Look for the install icon in your browser's address bar
2. Or click the "Install" button in the header
3. Follow the browser's installation prompts

#### Mobile (Android/iOS)
1. Tap the share/menu button
2. Select "Add to Home Screen"
3. Confirm installation

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy Options

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: `npm install -g netlify-cli && netlify deploy --prod`
- **Static Hosting**: Upload `dist/` folder to any static host (AWS S3, GitHub Pages, etc.)

## Customization

### Theming

Edit `tailwind.config.js` to customize colors, spacing, and more:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        accent: {
          // Your custom color palette
        },
      },
    },
  },
}
```

### Adding Features

The codebase is structured for easy extension:

1. **New Data Fields**: Update `src/types/schema.ts`
2. **New Components**: Add to `src/components/`
3. **New Pages**: Add to `src/routes/` and update routing in `App.tsx`
4. **New Hooks**: Add to `src/hooks/`

## Troubleshooting

### PWA Not Installing

- Ensure you're using HTTPS (required for PWA)
- Check browser console for service worker errors
- Try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Data Not Persisting

- Check if IndexedDB is enabled in your browser
- Ensure you're not in private/incognito mode
- Clear browser cache and try again

### Build Errors

- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure Node.js version is 18 or higher
- Check for TypeScript errors: `npx tsc --noEmit`

## License

MIT

---

Made with ❤️ for side hustlers everywhere
