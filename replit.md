# Prodigy MUN Registration System

## Overview

A comprehensive Model United Nations registration website for Prodigy Public School featuring student registration, committee selection, and admin management capabilities. The system allows students to register as delegates, select committees, and provides administrators with tools to manage registrations and export data.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API**: RESTful endpoints for registration and admin operations
- **Authentication**: Simple hardcoded admin credentials
- **Session Management**: Basic session handling for admin access

### Directory Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-specific page components
│   │   ├── lib/            # Utility functions and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations layer
│   └── db.ts              # Database connection setup
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts          # Database schema and validation
└── migrations/            # Database migration files
```

## Key Components

### Student Registration System
- **Registration Form**: Collects student information (name, class 8th-12th, division A-K)
- **Committee Selection**: Radio group interface for choosing from 19 available committees
- **Validation**: Prevents duplicate registrations and ensures data integrity
- **Optional Fields**: Email and suggestions are optional inputs

### Committee Management
- **Indian Committees**: 6 committees including Lok Sabha, Rajya Sabha, NITI Aayog, Supreme Court, Union Cabinet, Maharashtra Legislative Assembly
- **International Committees**: 13 committees including UN Security Council, UN General Assembly, ECOSOC, WHO, NATO, European Parliament, G20, and others
- **Committee Display**: Organized with visual distinction between Indian and International committees

### Admin Dashboard
- **Secure Login**: Hardcoded credentials (username: admin, password: prodigymun0)
- **Registration Overview**: Statistics and summary of registrations
- **Data Export**: CSV download functionality for registration data
- **Real-time Updates**: Live view of registration statistics

### UI Components
- **Design System**: shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Components**: Validated form inputs with error handling
- **Toast Notifications**: User feedback for actions and errors

## Data Flow

### Registration Process
1. Student fills out registration form
2. Client-side validation using Zod schema
3. Duplicate check against existing registrations
4. Registration stored in PostgreSQL database
5. Success confirmation displayed to user

### Admin Operations
1. Admin login with hardcoded credentials
2. Dashboard displays registration statistics
3. Registration data retrieved from database
4. Export functionality generates CSV from database records

### Database Operations
- **Create**: New student registrations
- **Read**: Admin dashboard statistics and registration lists
- **Validation**: Duplicate prevention and data integrity checks
- **Export**: CSV generation for administrative use

## External Dependencies

### Database Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations and schema management
- **WebSocket**: Real-time database connections via Neon's serverless setup

### UI and Styling
- **Radix UI**: Accessible component primitives via shadcn/ui
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for UI elements

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Setup
- Local development with Vite dev server
- Database URL configuration via environment variables
- Hot module replacement for rapid development

### Production Build
- Vite builds optimized client bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Static file serving from Express for client assets

### Environment Configuration
- `DATABASE_URL` environment variable required for Neon connection
- Development vs production mode handling
- REPL_ID detection for Replit-specific features

### Database Management
- Drizzle Kit for schema migrations (`npm run db:push`)
- Schema definitions in `shared/schema.ts`
- Connection pooling via Neon's serverless infrastructure

## Changelog
- June 30, 2025. Initial setup with separate Indian/International committee sections
- June 30, 2025. Updated to unified committee display per user request
- June 30, 2025. Changed admin password to: munprodiy#123@12@12

## User Preferences

Preferred communication style: Simple, everyday language.
Committee Display: Single unified list (not separated by Indian/International)
Admin Credentials: admin / munprodiy#123@12@12