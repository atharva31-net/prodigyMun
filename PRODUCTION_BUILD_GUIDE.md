# Production Build Guide - Prodigy MUN Registration System

## Overview
This guide covers building and deploying the MUN registration system with the new production-safe server architecture that avoids Vite imports in production and uses proper TypeScript compilation.

## Build Scripts

### Current Package.json Scripts
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

### Recommended Production Scripts
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc",
    "start": "node dist/server/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

## Production Build Process

### 1. Frontend Build (Client)
```bash
cd client
npm install
npm run build
```
- Creates optimized files in `client/dist/`
- Handles React, TypeScript, and asset bundling via Vite
- Generates production-ready static files

### 2. Backend Build (Server)
```bash
npm run build
```
- Compiles TypeScript server code to `dist/` directory
- Uses proper .js extensions for import compatibility
- Creates `dist/server/index.js` as entry point

### 3. Database Setup
```bash
npm run db:push
```
- Syncs database schema with PostgreSQL
- Required before first deployment

## Server Architecture

### Development Mode
- Uses existing `server/vite.ts` for hot reloading
- Imports Vite middleware dynamically
- Serves client files through Vite dev server

### Production Mode
- Serves static files from `client/dist/`
- No Vite imports or dependencies
- Uses Express static middleware
- SPA fallback routing for client-side routes

### Environment Detection
```typescript
if (process.env.NODE_ENV === "development") {
  // Use existing vite.ts for development
  const { setupVite } = await import("./vite.js");
  await setupVite(app, server);
} else {
  // Production static file serving
  const staticPath = path.resolve(__dirname, "..", "client", "dist");
  app.use(express.static(staticPath));
  // SPA fallback routing...
}
```

## Deployment Platforms

### Render (Backend)
1. **Environment Variables**:
   - `NODE_ENV=production`
   - `DATABASE_URL=<postgresql_connection_string>`
   - `PORT=10000`

2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Root Directory**: `/`

### Netlify (Frontend)
1. **Build Settings**:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/dist`

2. **Environment Variables**:
   - `VITE_API_URL=<render_backend_url>`

3. **Redirects** (netlify.toml):
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

## File Structure After Build

```
project/
├── dist/                          # Compiled server code
│   ├── server/
│   │   ├── index.js              # Main server entry
│   │   ├── routes.js             # API routes
│   │   ├── storage.js            # Database operations
│   │   └── db.js                 # Database connection
│   └── shared/
│       └── schema.js             # Shared schemas
├── client/
│   └── dist/                     # Built frontend
│       ├── index.html
│       ├── assets/
│       │   ├── index-[hash].js   # Bundled JS
│       │   └── index-[hash].css  # Bundled CSS
│       └── attached_assets/      # School images
└── node_modules/
```

## TypeScript Configuration

### Root tsconfig.json (Server + Shared)
```json
{
  "include": ["shared/**/*", "server/**/*"],
  "exclude": ["node_modules", "build", "dist", "client"],
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2022"],
    "types": ["node"]
  }
}
```

### Client tsconfig.json (Frontend)
```json
{
  "extends": "../tsconfig.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "noEmit": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"],
      "@assets/*": ["../attached_assets/*"]
    }
  }
}
```

## Production Verification

### Local Production Test
```bash
# Build everything
npm run build
cd client && npm run build && cd ..

# Start in production mode
NODE_ENV=production npm start
```

### Health Checks
1. **Server**: `curl http://localhost:5000/api/registrations/stats`
2. **Frontend**: Visit `http://localhost:5000` and test registration
3. **Admin**: Login at `/admin-login` with credentials
4. **Database**: Verify registrations are saved properly

## Troubleshooting

### Common Issues

1. **Import Extensions**
   - Ensure all imports use `.js` extensions in compiled code
   - TypeScript compiler handles `.ts` to `.js` conversion

2. **Static Files Not Found**
   - Verify `client/dist` directory exists after build
   - Check static path resolution in production mode

3. **Database Connection**
   - Verify `DATABASE_URL` environment variable
   - Run `npm run db:push` before deployment

4. **API Routes Not Working**
   - Ensure API routes are registered before static middleware
   - Check CORS configuration for cross-origin requests

### Performance Optimization

1. **Compression**: Add gzip compression middleware
2. **Caching**: Configure proper cache headers for static assets
3. **Database**: Use connection pooling (already configured with Neon)
4. **CDN**: Consider CDN for static assets in production

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **Admin Credentials**: Use environment variables in production
3. **HTTPS**: Ensure HTTPS in production (handled by Render/Netlify)
4. **Input Validation**: All inputs validated via Zod schemas

This build configuration ensures clean separation between development and production environments while maintaining all existing functionality.