# Quick Deployment Checklist

## Pre-Deployment Setup

### 1. Download Project Files
- [ ] Download all files from Replit
- [ ] Verify `COMPLETE_WEBSITE_DOCUMENTATION.md` is included
- [ ] Check that `attached_assets/IMG_20250627_141514660_1751260346213.jpg` is present

### 2. GitHub Repository Setup
```bash
git init
git add .
git commit -m "Initial commit: Prodigy MUN Registration System"
git branch -M main
git remote add origin https://github.com/yourusername/prodigy-mun-registration.git
git push -u origin main
```

## Backend Deployment (Render)

### 3. Create PostgreSQL Database
- [ ] Go to Render Dashboard → New → PostgreSQL
- [ ] Name: `prodigy-mun-db`
- [ ] Database: `prodigy_mun`
- [ ] User: `prodigy_mun_user`
- [ ] Plan: Free (for testing)
- [ ] **SAVE THE DATABASE URL** - you'll need it

### 4. Deploy Backend Service
- [ ] Render Dashboard → New → Web Service
- [ ] Connect GitHub repository
- [ ] Name: `prodigy-mun-backend`
- [ ] Environment: Node
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`

### 5. Backend Environment Variables
```
NODE_ENV=production
DATABASE_URL=[paste your database URL here]
PORT=10000
```

## Frontend Deployment (Netlify)

### 6. Update netlify.toml
- [ ] Replace `https://your-backend-url.onrender.com` with your actual Render URL
- [ ] Example: `https://prodigy-mun-backend.onrender.com`

### 7. Deploy to Netlify
- [ ] Netlify Dashboard → New site from Git
- [ ] Select your GitHub repository
- [ ] Build command: `cd client && npm install && npm run build`
- [ ] Publish directory: `client/dist`

### 8. Frontend Environment Variables
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Testing Deployment

### 9. Test Registration Flow
- [ ] Visit your Netlify URL
- [ ] Fill out student registration form
- [ ] Select a committee
- [ ] Submit registration
- [ ] Verify success message

### 10. Test Admin Functions
- [ ] Go to `/admin-login`
- [ ] Login with: `admin` / `munprodiy#123@12@12`
- [ ] Verify dashboard loads
- [ ] Check registration statistics
- [ ] Test CSV export

## Important URLs and Credentials

### Admin Login
- **Username:** `admin`
- **Password:** `munprodiy#123@12@12`

### Your Deployment URLs
- **Frontend (Netlify):** `https://[your-site-name].netlify.app`
- **Backend (Render):** `https://[your-service-name].onrender.com`
- **Database:** `[your-database-url]`

## File Structure for ChatGPT Reference

```
Key files for deployment:
├── COMPLETE_WEBSITE_DOCUMENTATION.md  ← Full technical details
├── DEPLOYMENT_GUIDE.md               ← Detailed deployment steps
├── DEPLOYMENT_CHECKLIST.md           ← This quick checklist
├── netlify.toml                      ← Netlify configuration
├── package.json                      ← Build scripts
├── client/                           ← Frontend code (Netlify)
├── server/                           ← Backend code (Render)
├── shared/schema.ts                  ← Database schema
└── attached_assets/                  ← School image
```

## Quick Troubleshooting

### Common Issues:
1. **Backend won't start:** Check DATABASE_URL is correct
2. **Frontend can't connect:** Update VITE_API_URL with backend URL
3. **Admin login fails:** Verify password is exactly `munprodiy#123@12@12`
4. **Database connection error:** Check if database is running on Render

### Success Indicators:
- ✓ Student can register successfully
- ✓ Admin can login and see registrations
- ✓ CSV export downloads data
- ✓ No console errors in browser

## For ChatGPT Assistance

When asking ChatGPT for help, provide:
1. The `COMPLETE_WEBSITE_DOCUMENTATION.md` file
2. Specific error messages from build logs
3. Your deployment URLs
4. Which step in this checklist you're stuck on

The documentation file contains all technical details including:
- Complete API endpoints and request/response formats
- Database schema and table structures
- Environment variables and configuration
- File structure and component details
- Admin credentials and functionality