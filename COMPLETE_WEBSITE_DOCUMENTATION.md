# Complete Website Documentation - Prodigy MUN Registration System

## Project Overview

This is a full-stack web application for Model United Nations (MUN) delegate registration at Prodigy Public School, Wagholi-Pune. The system allows students to register as delegates, select committees, and provides administrators with management capabilities.

## Architecture Summary

- **Frontend**: React 18 + TypeScript + Tailwind CSS (deploys to Netlify)
- **Backend**: Express.js + TypeScript (deploys to Render)
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter for client-side navigation
- **Styling**: shadcn/ui component library

## Directory Structure

```
prodigy-mun-registration/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── committee-selection.tsx  # Committee selection radio group
│   │   │   └── registration-form.tsx    # Main student registration form
│   │   ├── pages/                   # Route-specific page components
│   │   │   ├── home.tsx            # Main registration page
│   │   │   ├── admin-login.tsx     # Admin authentication page
│   │   │   ├── admin-dashboard.tsx # Admin management interface
│   │   │   └── not-found.tsx       # 404 error page
│   │   ├── lib/                     # Utility functions and configurations
│   │   │   ├── committees.ts       # Committee data and helper functions
│   │   │   ├── queryClient.ts      # TanStack Query configuration
│   │   │   └── utils.ts            # General utility functions
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── use-toast.ts        # Toast notification hook
│   │   ├── App.tsx                 # Main app component with routing
│   │   ├── main.tsx                # React app entry point
│   │   └── index.css               # Global styles and Tailwind CSS
│   ├── index.html                  # HTML template
│   ├── vite.config.ts              # Vite configuration
│   └── package.json                # Frontend dependencies
├── server/                          # Backend Express application
│   ├── index.ts                    # Server entry point
│   ├── routes.ts                   # API route definitions
│   ├── storage.ts                  # Database operations layer
│   ├── db.ts                       # Database connection setup
│   └── vite.ts                     # Vite integration for development
├── shared/                          # Shared code between frontend and backend
│   └── schema.ts                   # Database schema and validation
├── attached_assets/                 # Static assets
│   └── IMG_20250627_141514660_1751260346213.jpg  # School building image
├── components.json                  # shadcn/ui configuration
├── drizzle.config.ts               # Database configuration
├── netlify.toml                    # Netlify deployment configuration
├── package.json                    # Root package.json with scripts
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── DEPLOYMENT_GUIDE.md             # Detailed deployment instructions
└── README.md                       # Project documentation
```

## Database Schema

### Tables

1. **users** (Admin authentication)
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL
   );
   ```

2. **registrations** (Student registrations)
   ```sql
   CREATE TABLE registrations (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     class TEXT NOT NULL,
     division TEXT NOT NULL,
     committee TEXT NOT NULL,
     email TEXT,
     suggestions TEXT,
     created_at TIMESTAMP DEFAULT NOW() NOT NULL
   );
   ```

### Data Validation

- **Classes**: 8th, 9th, 10th, 11th, 12th
- **Divisions**: A, B, C, D, E, F, G, H, I, J, K
- **Committees**: 19 total committees (see committee list below)
- **Email**: Optional field with email validation
- **Duplicate Prevention**: Same name + class + division cannot register twice

## Committee System

### Complete Committee List (19 total)

**Indian Committees (6):**
1. `lok-sabha` - Lok Sabha (Lower House of Indian Parliament)
2. `rajya-sabha` - Rajya Sabha (Upper House of Indian Parliament)
3. `niti-aayog` - NITI Aayog (Policy Think Tank of India)
4. `supreme-court` - Supreme Court of India (Highest Judicial Authority)
5. `cabinet` - Union Cabinet (Executive Council of Ministers)
6. `assembly` - Maharashtra Legislative Assembly (State Legislative Body)

**International Committees (13):**
1. `unsc` - UN Security Council (Peace and Security)
2. `unga` - UN General Assembly (Global Deliberative Body)
3. `ecosoc` - ECOSOC (Economic and Social Council)
4. `unhrc` - UN Human Rights Council (Human Rights Protection)
5. `who` - World Health Organization (Global Health Governance)
6. `nato` - NATO (North Atlantic Treaty Organization)
7. `eu-parliament` - European Parliament (EU Legislative Body)
8. `g20` - G20 Summit (Economic Cooperation)
9. `icc` - International Criminal Court (Justice and Accountability)
10. `us-senate` - US Senate (Upper House of US Congress)
11. `arab-league` - Arab League (Regional Cooperation)
12. `asean` - ASEAN (Southeast Asian Nations)
13. `african-union` - African Union (Continental Unity)

### Committee Display

- **Single unified list** (not separated by Indian/International)
- **Radio button selection** (only one committee per student)
- **Visual styling** with hover effects and selection states

## API Endpoints

### Student Registration
- **POST** `/api/registrations`
  - Body: `{ name, class, division, committee, email?, suggestions? }`
  - Response: `{ success: boolean, registration?: Registration, message?: string }`
  - Validates duplicate registrations

### Admin Authentication
- **POST** `/api/admin/login`
  - Body: `{ username, password }`
  - Credentials: `admin` / `munprodiy#123@12@12`
  - Response: `{ success: boolean, message: string }`

### Admin Data Access
- **GET** `/api/registrations`
  - Response: `{ success: boolean, registrations: Registration[] }`
  - Returns all student registrations

- **GET** `/api/registrations/stats`
  - Response: `{ success: boolean, stats: Stats }`
  - Stats: `{ total, indianCommittees, internationalCommittees, seniorStudents }`

## Frontend Components

### Main Pages

1. **Home Page** (`/`)
   - School building image display
   - Student registration form
   - Committee selection interface
   - Success/error handling

2. **Admin Login** (`/admin-login`)
   - Username/password form
   - Authentication handling
   - Redirect to dashboard on success

3. **Admin Dashboard** (`/admin-dashboard`)
   - Registration statistics cards
   - Complete registration table
   - CSV export functionality
   - Committee badge display

### Key Components

1. **RegistrationForm**
   - Form validation with Zod schema
   - File uploads handled (school image)
   - Success dialog with confirmation
   - Error handling and display

2. **CommitteeSelection**
   - Radio group with 19 committees
   - Unified display (no Indian/International separation)
   - Hover effects and visual feedback
   - Committee descriptions

3. **AdminDashboard**
   - Statistics overview with icons
   - Sortable registration table
   - Export to CSV functionality
   - Committee badge rendering

## Configuration Files

### package.json (Root)
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

### netlify.toml
```toml
[build]
  publish = "client/dist"
  command = "cd client && npm install && npm run build"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### drizzle.config.ts
```typescript
export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
```

## Environment Variables

### Development
- `NODE_ENV=development`
- `DATABASE_URL` (provided by Replit/Neon)

### Production Backend (Render)
- `NODE_ENV=production`
- `DATABASE_URL` (PostgreSQL connection string)
- `PORT=10000`

### Production Frontend (Netlify)
- `VITE_API_URL` (backend URL from Render)

## Features Implementation

### Student Registration
1. **Form Fields**: Name, class, division, committee (required) + email, suggestions (optional)
2. **Validation**: Client-side with Zod, server-side validation
3. **Duplicate Prevention**: Checks name + class + division combination
4. **Success Handling**: Modal dialog with confirmation message

### Admin Management
1. **Authentication**: Hardcoded credentials stored in server
2. **Dashboard**: Real-time statistics and registration list
3. **Export**: CSV download with all registration data
4. **Security**: Simple session-based authentication

### UI/UX Features
1. **Responsive Design**: Mobile-first approach with Tailwind CSS
2. **Dark Mode Support**: CSS variables for theming
3. **Loading States**: Spinners and skeleton states
4. **Error Handling**: Toast notifications and form validation
5. **Accessibility**: Proper ARIA labels and keyboard navigation

## Styling System

### Tailwind CSS Configuration
- Custom color palette with CSS variables
- Component-specific styles in index.css
- Responsive breakpoints and utilities
- Animation and transition classes

### shadcn/ui Components
- Form components with validation
- Dialog and modal systems
- Table and data display components
- Button and input variants
- Toast notification system

## Data Flow

### Registration Process
1. Student fills form → Client validation → API call → Database storage
2. Duplicate check performed before insertion
3. Success/error feedback to user
4. Admin dashboard updates automatically

### Admin Workflow
1. Admin login → Credential verification → Dashboard access
2. Statistics calculated from database
3. Registration list retrieved and displayed
4. CSV export generates from live data

## Security Considerations

### Current Implementation
- Hardcoded admin credentials (suitable for single-admin use)
- Basic SQL injection prevention via Drizzle ORM
- Client-side input validation + server-side validation
- HTTPS enforcement in production

### Recommendations for Production
- Move admin credentials to environment variables
- Implement session management with secure cookies
- Add rate limiting for login attempts
- Regular database backups
- Input sanitization and validation

## Performance Optimizations

### Frontend
- Code splitting with Vite
- Image optimization and lazy loading
- React Query for efficient data fetching
- Component memoization where needed

### Backend
- Database connection pooling
- Prepared statements via Drizzle ORM
- Response compression
- Static file serving optimization

### Database
- Indexes on frequently queried columns
- Connection pooling for concurrent users
- Query optimization for statistics

## Deployment Requirements

### Minimum Server Requirements
- **Memory**: 512MB RAM minimum
- **Storage**: 1GB minimum
- **Node.js**: Version 18 or higher
- **Database**: PostgreSQL 13+

### Recommended for Production
- **CDN**: For static asset delivery
- **Load Balancer**: For high traffic
- **Monitoring**: Application and database monitoring
- **Backup**: Automated database backups
- **SSL**: HTTPS certificates

## Testing Strategy

### Manual Testing Checklist
1. **Student Registration**:
   - All form fields work correctly
   - Validation prevents invalid submissions
   - Duplicate prevention works
   - Success/error messages display

2. **Admin Functions**:
   - Login authentication works
   - Dashboard displays correct statistics
   - Registration table shows all data
   - CSV export downloads correctly

3. **Responsive Design**:
   - Works on mobile devices
   - Tablet layout is functional
   - Desktop experience is optimal

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Common Issues and Solutions

### Development Issues
1. **Port conflicts**: Use different ports or kill existing processes
2. **Database connection**: Verify DATABASE_URL is correctly set
3. **Build errors**: Clear node_modules and reinstall dependencies

### Production Issues
1. **API connection**: Verify backend URL in frontend configuration
2. **Database timeouts**: Check connection pooling settings
3. **Static files**: Ensure proper build and deployment configuration

### Performance Issues
1. **Slow queries**: Add database indexes
2. **Large response times**: Optimize API endpoints
3. **Frontend loading**: Implement code splitting and lazy loading

## Maintenance Tasks

### Regular Maintenance
- Monitor server logs for errors
- Check database performance metrics
- Update dependencies for security patches
- Backup registration data regularly

### Seasonal Tasks
- Clear old registration data after events
- Update committee information if needed
- Review and update admin credentials
- Performance optimization reviews

This documentation provides complete technical details for understanding, deploying, and maintaining the Prodigy MUN Registration System. All configurations, credentials, and implementation details are included for easy reference during deployment and troubleshooting.