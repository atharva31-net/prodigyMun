# Prodigy MUN Registration System

A comprehensive Model United Nations registration website for Prodigy Public School with student registration, committee selection, and admin management features.

## Features

### Student Features
- **Registration Form**: Complete student information including name, class (8th-12th), division (A-K)
- **Committee Selection**: Choose from 19 committees (6 Indian + 13 International)
- **Email Optional**: Students can optionally provide email
- **Suggestions Box**: Optional feedback and suggestions field
- **Validation**: Prevents duplicate registrations and ensures one committee per student

### Admin Features
- **Secure Login**: Admin authentication with hardcoded credentials
- **Dashboard**: Overview statistics and student management
- **Data Export**: Download registration data as CSV
- **Real-time Updates**: Live statistics and registration tracking

### Committees Available

#### Indian Committees
1. Lok Sabha - Lower House of Indian Parliament
2. Rajya Sabha - Upper House of Indian Parliament
3. NITI Aayog - Policy Think Tank of India
4. Supreme Court of India - Highest Judicial Authority
5. Union Cabinet - Executive Council of Ministers
6. Maharashtra Legislative Assembly - State Legislative Body

#### International Committees
1. UN Security Council - Peace and Security
2. UN General Assembly - Global Deliberative Body
3. ECOSOC - Economic and Social Council
4. UN Human Rights Council - Human Rights Protection
5. World Health Organization - Global Health Governance
6. NATO - North Atlantic Treaty Organization
7. European Parliament - EU Legislative Body
8. G20 Summit - Economic Cooperation
9. International Criminal Court - Justice and Accountability
10. US Senate - Upper House of US Congress
11. Arab League - Regional Cooperation
12. ASEAN - Southeast Asian Nations
13. African Union - Continental Unity

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Wouter** for routing
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Zod** for validation
- **bcrypt** for password hashing (if needed)

### Database Schema
```sql
-- Users table (for admin authentication)
users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)

-- Registrations table
registrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  division TEXT NOT NULL,
  committee TEXT NOT NULL,
  email TEXT,
  suggestions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
