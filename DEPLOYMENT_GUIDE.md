# Deployment Guide - Prodigy MUN Registration System

This guide will help you deploy the MUN registration system to production using GitHub, Netlify (frontend), and Render (backend).

## Prerequisites

- GitHub account
- Netlify account
- Render account
- PostgreSQL database (we'll use Render's PostgreSQL service)

## Step 1: Prepare Your Repository

1. **Download the project** - Download all files from this Replit project
2. **Create a new GitHub repository**:
   - Go to GitHub and create a new repository
   - Name it something like `prodigy-mun-registration`
   - Don't initialize with README (we'll push our existing code)

3. **Upload to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Prodigy MUN Registration System"
   git branch -M main
   git remote add origin https://github.com/yourusername/prodigy-mun-registration.git
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

### 2.1 Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "PostgreSQL"
3. Fill in:
   - **Name**: `prodigy-mun-db`
   - **Database**: `prodigy_mun`
   - **User**: `prodigy_mun_user`
   - **Region**: Choose closest to your location
   - **Plan**: Free tier is sufficient for testing
4. Click "Create Database"
5. **Important**: Copy the "External Database URL" - you'll need this

### 2.2 Deploy Backend Service

1. In Render Dashboard, click "New" → "Web Service"
2. Connect your GitHub repository
3. Fill in the service details:
   - **Name**: `prodigy-mun-backend`
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (paste the External Database URL from step 2.1)
   - `PORT`: `10000` (Render's default)

5. Click "Create Web Service"

### 2.3 Update Backend for Production

Create a `package.json` script for production:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc && cp -r client/dist dist/public",
    "dev": "NODE_ENV=development tsx server/index.ts"
  }
}
```

## Step 3: Deploy Frontend to Netlify

### 3.1 Build Configuration

1. Create a `netlify.toml` file in your project root:

```toml
[build]
  publish = "client/dist"
  command = "cd client && npm install && npm run build"

[build.environment]
  NODE_VERSION = "18"

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

### 3.2 Update Frontend Configuration

Update `client/src/lib/queryClient.ts` to use your backend URL:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  // ... rest of the function
}
```

### 3.3 Deploy to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`
5. Add environment variables:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com`
6. Click "Deploy site"

## Step 4: Configure Domain and SSL

### 4.1 Custom Domain (Optional)

1. In Netlify, go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

### 4.2 SSL Certificate

- Netlify automatically provides SSL certificates
- Render also provides SSL for custom domains

## Step 5: Testing the Deployment

### 5.1 Test Frontend

1. Visit your Netlify URL
2. Test the registration form
3. Verify committee selection works
4. Check responsive design on mobile

### 5.2 Test Backend

1. Test the API endpoints directly:
   ```bash
   curl https://your-backend-url.onrender.com/api/registrations
   ```

### 5.3 Test Admin Panel

1. Go to `/admin-login` on your site
2. Login with:
   - **Username**: `admin`
   - **Password**: `munprodiy#123@12@12`
3. Verify dashboard statistics
4. Test CSV export functionality

## Step 6: Database Setup

### 6.1 Initialize Database Schema

The database schema will be automatically created when the backend starts. The tables include:

- `users` - Admin authentication
- `registrations` - Student registrations

### 6.2 Verify Database Connection

Check Render logs to ensure database connection is successful:

```
[express] serving on port 10000
Database connected successfully
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify DATABASE_URL is correct
   - Check if database is running
   - Ensure IP allowlist includes Render's IPs

2. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

3. **API Connection Issues**:
   - Verify CORS settings in backend
   - Check if API URL is correct in frontend
   - Ensure environment variables are set

4. **Admin Login Issues**:
   - Verify admin credentials in code
   - Check if password matches exactly
   - Ensure session handling works

### Performance Optimization

1. **Database Indexing**:
   ```sql
   CREATE INDEX idx_registrations_name ON registrations(name);
   CREATE INDEX idx_registrations_class ON registrations(class);
   CREATE INDEX idx_registrations_committee ON registrations(committee);
   ```

2. **Caching Headers**:
   - Static assets are cached by Netlify
   - API responses can be cached for statistics

## Monitoring and Maintenance

### 1. Monitoring

- **Render**: Check application logs and metrics
- **Netlify**: Monitor build and deployment logs
- **Database**: Monitor connection count and performance

### 2. Backups

- **Database**: Render provides automatic backups
- **Code**: GitHub serves as version control backup

### 3. Updates

- Push changes to GitHub
- Netlify and Render will auto-deploy
- Test thoroughly before major updates

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Admin Password**: Consider using environment variables for admin credentials
3. **Database**: Use connection pooling and prepared statements
4. **HTTPS**: Ensure all traffic uses SSL
5. **Input Validation**: Validate all user inputs

## Support

For issues with:
- **Netlify**: Check Netlify documentation and support
- **Render**: Check Render documentation and support
- **Application**: Review application logs and error messages

## File Structure for Deployment

```
prodigy-mun-registration/
├── client/                 # Frontend (deploys to Netlify)
│   ├── dist/              # Built frontend files
│   ├── src/               # Source code
│   └── package.json
├── server/                # Backend (deploys to Render)
│   ├── dist/              # Built backend files
│   └── *.ts files
├── shared/                # Shared code
├── netlify.toml          # Netlify configuration
├── package.json          # Root package.json
├── drizzle.config.ts     # Database configuration
└── README.md
```

This deployment setup ensures your MUN registration system is production-ready with proper separation of frontend and backend, secure database hosting, and reliable deployment pipelines.