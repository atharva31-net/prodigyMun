# ChatGPT Complete Guide - Prodigy MUN Registration System

## IMPORTANT: Current State (Updated June 30, 2025)

This is the **COMPLETE** and **UP-TO-DATE** technical specification for the Prodigy MUN Registration System. Use this document for all future modifications and deployment assistance.

## Project Overview

**Purpose**: Model United Nations delegate registration system for Prodigy Public School, Wagholi-Pune
**Current Status**: Fully functional with complete registration management features
**Architecture**: Full-stack TypeScript application with PostgreSQL database

## Admin Credentials (CRITICAL INFO)
- **Username**: `admin`
- **Password**: `munprodiy#123@12@12`
- **Access**: Full registration management capabilities

## Complete Feature Set

### Student Features
1. **Registration Form**: Name, class (8th-12th), division (A-K), committee selection
2. **Committee Selection**: 19 committees in unified display (not separated)
3. **Optional Fields**: Email and suggestions
4. **Validation**: Prevents duplicate registrations
5. **Success Confirmation**: Modal dialog after successful registration

### Admin Features
1. **Secure Login**: Admin authentication
2. **Dashboard**: 7 statistics cards showing comprehensive metrics
3. **Registration Management**: Confirm, reject, or permanently remove registrations
4. **Status Tracking**: pending → confirmed/rejected workflow
5. **Data Export**: CSV download with all registration data
6. **Real-time Updates**: Live statistics and data refresh

## Current Database Schema

```sql
-- Users table (admin authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Registrations table (student data)
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  division TEXT NOT NULL,
  committee TEXT NOT NULL,
  email TEXT,
  suggestions TEXT,
  status TEXT DEFAULT 'pending' NOT NULL, -- NEW: pending/confirmed/rejected
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Complete API Specification

### 1. Student Registration
```
POST /api/registrations
Body: {
  name: string (required),
  class: string (required, values: "8th"|"9th"|"10th"|"11th"|"12th"),
  division: string (required, values: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"),
  committee: string (required, committee ID),
  email?: string (optional),
  suggestions?: string (optional)
}
Response: { success: boolean, registration?: Registration, message?: string }
```

### 2. Admin Authentication
```
POST /api/admin/login
Body: { username: "admin", password: "munprodiy#123@12@12" }
Response: { success: boolean, message: string }
```

### 3. Get All Registrations
```
GET /api/registrations
Response: { success: boolean, registrations: Registration[] }
```

### 4. Get Statistics
```
GET /api/registrations/stats
Response: { 
  success: boolean, 
  stats: {
    total: number,
    pending: number,
    confirmed: number,
    rejected: number,
    indianCommittees: number,
    internationalCommittees: number,
    seniorStudents: number
  }
}
```

### 5. Update Registration Status (NEW)
```
PATCH /api/registrations/:id/status
Body: { status: "pending"|"confirmed"|"rejected" }
Response: { success: boolean, registration: Registration }
```

### 6. Delete Registration (NEW)
```
DELETE /api/registrations/:id
Response: { success: boolean, message: string }
```

## Complete Committee List (19 Total)

### Indian Committees (6)
1. `lok-sabha` - Lok Sabha (Lower House of Indian Parliament)
2. `rajya-sabha` - Rajya Sabha (Upper House of Indian Parliament)
3. `niti-aayog` - NITI Aayog (Policy Think Tank of India)
4. `supreme-court` - Supreme Court of India (Highest Judicial Authority)
5. `cabinet` - Union Cabinet (Executive Council of Ministers)
6. `assembly` - Maharashtra Legislative Assembly (State Legislative Body)

### International Committees (13)
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

## Current File Structure

```
prodigy-mun-registration/
├── client/                                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── committee-selection.tsx       # Unified committee display
│   │   │   └── registration-form.tsx         # Student registration form
│   │   ├── pages/
│   │   │   ├── home.tsx                     # Main page with logo
│   │   │   ├── admin-login.tsx              # Admin authentication
│   │   │   ├── admin-dashboard.tsx          # Management interface
│   │   │   └── not-found.tsx                # 404 page
│   │   ├── lib/
│   │   │   ├── committees.ts                # Committee data
│   │   │   ├── queryClient.ts               # API configuration
│   │   │   └── utils.ts                     # Utilities
│   │   └── hooks/
│   │       └── use-toast.ts                 # Toast notifications
│   └── dist/                                # Built frontend
├── server/                                   # Backend (Express + TypeScript)
│   ├── index.ts                             # Server entry point
│   ├── routes.ts                            # API routes
│   ├── storage.ts                           # Database operations
│   ├── db.ts                                # Database connection
│   └── vite.ts                              # Development setup
├── shared/
│   └── schema.ts                            # Database schema + validation
├── attached_assets/
│   ├── IMG_20250627_141514660_1751260346213.jpg  # School building
│   └── images (4)_1751262564527.jpeg             # School logo (NEW)
├── netlify.toml                             # Netlify deployment config
├── package.json                             # Dependencies and scripts
├── drizzle.config.ts                        # Database configuration
└── README.md                                # Project documentation
```

## Key Component Details

### 1. Registration Form (`client/src/components/registration-form.tsx`)
- **Validation**: Zod schema with form validation
- **Committee Selection**: Single radio group with 19 options
- **Duplicate Check**: Prevents same name+class+division registration
- **Success Dialog**: Confirmation modal after submission

### 2. Admin Dashboard (`client/src/pages/admin-dashboard.tsx`)
- **7 Statistics Cards**: Total, Pending, Confirmed, Rejected, Indian, International, Senior
- **Registration Table**: Complete list with status badges and action buttons
- **Action Buttons**: Confirm (✓), Reject (✗), Delete (🗑️) for each registration
- **Export Function**: CSV download with all data

### 3. Committee Selection (`client/src/components/committee-selection.tsx`)
- **Unified Display**: All 19 committees in single list (not separated)
- **Radio Selection**: Only one committee per student
- **Visual Styling**: Hover effects and selection states

## Current Navigation & Branding

### Logo Implementation
- **Home Page**: Uses uploaded school logo (`images (4)_1751262564527.jpeg`)
- **Location**: Top-left navigation bar
- **Size**: 8x8 with rounded corners and object-cover
- **Alt Text**: "Prodigy Public School Logo"

## Environment Variables

### Development
- `NODE_ENV=development`
- `DATABASE_URL` (PostgreSQL connection)

### Production Backend (Render)
- `NODE_ENV=production`
- `DATABASE_URL` (PostgreSQL connection string)
- `PORT=10000`

### Production Frontend (Netlify)
- `VITE_API_URL` (backend URL)

## Deployment Configuration

### Package.json Scripts
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

### Netlify Configuration (netlify.toml)
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

## Status Management Workflow

### Registration States
1. **Pending** (default): New registrations await admin review
2. **Confirmed**: Admin approved the registration
3. **Rejected**: Admin rejected the registration

### Admin Actions
- **Confirm**: Changes status to 'confirmed' (green badge with checkmark)
- **Reject**: Changes status to 'rejected' (red badge with X)
- **Remove**: Permanently deletes registration (requires confirmation dialog)

## Data Types and Interfaces

### Registration Interface
```typescript
interface Registration {
  id: number;
  name: string;
  class: string;
  division: string;
  committee: string;
  email?: string;
  suggestions?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}
```

### Statistics Interface
```typescript
interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  rejected: number;
  indianCommittees: number;
  internationalCommittees: number;
  seniorStudents: number;
}
```

## Common Modifications Guide for ChatGPT

### Adding New Committee
1. Update `client/src/lib/committees.ts`
2. Add to appropriate category (indian/international)
3. Update committee count in statistics

### Changing Admin Credentials
1. Update `server/routes.ts` adminCredentials object
2. Update documentation files

### Adding New Status
1. Update `shared/schema.ts` status field
2. Update API validation in `server/routes.ts`
3. Update UI components in admin dashboard

### Modifying Statistics
1. Update `server/storage.ts` getRegistrationStats method
2. Update admin dashboard cards display
3. Update Stats interface

## Troubleshooting Common Issues

### 1. Database Connection
- Verify DATABASE_URL environment variable
- Run `npm run db:push` to sync schema

### 2. API Errors
- Check backend logs for specific error messages
- Verify request format matches API specification

### 3. Build Failures
- Clear node_modules and reinstall dependencies
- Check TypeScript errors in console

### 4. Admin Access
- Verify exact credentials: `admin` / `munprodiy#123@12@12`
- Check network requests in browser dev tools

## Testing Checklist

### Student Flow
- [ ] Registration form accepts all required fields
- [ ] Committee selection works (only one allowed)
- [ ] Duplicate prevention works
- [ ] Success dialog appears

### Admin Flow
- [ ] Login with correct credentials works
- [ ] Dashboard shows 7 statistics cards
- [ ] All registrations display with status badges
- [ ] Confirm/reject buttons update status
- [ ] Delete button removes registration (with confirmation)
- [ ] CSV export downloads data

## Recent Changes Log

- **June 30, 2025**: Added registration management (confirm/reject/remove)
- **June 30, 2025**: Added status tracking with 7 statistics cards
- **June 30, 2025**: Unified committee display (removed Indian/International separation)
- **June 30, 2025**: Updated logo to use uploaded school image
- **June 30, 2025**: Enhanced admin dashboard with action buttons

## Instructions for ChatGPT

When assisting with this project:

1. **Always refer to this document** for current state and specifications
2. **Use exact API endpoints** and data structures as specified
3. **Maintain existing admin credentials** unless explicitly asked to change
4. **Follow the established file structure** and naming conventions
5. **Test changes** using the provided testing checklist
6. **Update this documentation** when making significant changes
7. **Use the exact committee IDs** from the list above
8. **Respect the unified committee display** (not separated by category)

This system is production-ready and fully functional. All features work as documented above.