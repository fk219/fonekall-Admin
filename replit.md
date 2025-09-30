# KnightCall AI - Voice AI Platform Admin Panel

## Overview
KnightCall AI is an advanced voice AI platform admin panel built with React, TypeScript, and Vite. The application provides a comprehensive interface for managing organizations, agents, billing, and monitoring real-time analytics for voice AI calling platforms.

## Project Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn-ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query (React Query) 5.83.0
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (Authentication & Database)

### Key Features
- Admin dashboard with real-time analytics
- Organization management
- Subscription and billing management
- Protected routes with authentication
- Dark mode support via next-themes
- Voice AI integration with Retell SDK

## Project Structure
```
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-specific components
│   │   ├── auth/           # Authentication components
│   │   └── ui/             # shadcn UI components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── AuthPage.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── supabase/              # Supabase migrations and config
└── index.html             # HTML entry point
```

## Configuration

### Vite Configuration
- **Port**: 5000 (required for Replit)
- **Host**: 0.0.0.0 (allows proxy access)
- **Strict Port**: Enabled
- **SWC**: Using React SWC plugin for faster builds

### Supabase
- Project ID: `sgokzbhnfvezbybidnqh`
- Connected to Supabase for authentication and database
- Local migrations available in `supabase/migrations/`

## Development

### Running Locally
The application is configured to run with:
```bash
npm run dev
```
This starts the Vite dev server on port 5000.

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Workflow
The "Start application" workflow is configured to run `npm run dev` and serves the frontend on port 5000.

## Deployment
Configured for Replit Autoscale deployment:
- **Build**: `npm run build`
- **Run**: `npm run preview`
- **Target**: Autoscale (stateless frontend)

## Dependencies
Key dependencies include:
- React and React DOM
- Supabase client for authentication
- TanStack Query for data fetching
- React Router for routing
- shadcn-ui component library
- Tailwind CSS for styling
- Zod for schema validation
- Retell SDK for voice AI integration

## Recent Changes (Sept 30, 2025)
- Configured for Replit environment
- Updated Vite config to use port 5000 and host 0.0.0.0
- Set up workflow for development server
- Configured deployment settings for Autoscale
- Installed all dependencies via npm
