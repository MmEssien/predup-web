# PredUp Frontend Deployment

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local` and verify values
- [ ] Set `NEXT_PUBLIC_API_URL` to your production backend URL
- [ ] Verify `NEXT_PUBLIC_APP_ENV=production` for production builds

### 2. API Connectivity
- [ ] Test all backend endpoints return 200 OK:
  - `GET /api/v1/health`
  - `GET /api/v1/dashboard`
  - `GET /api/v1/predictions/live`
  - `GET /api/v1/predictions/history`
  - `GET /api/v1/settings`
  - `GET /api/v1/performance`

### 3. Build Verification
- [ ] Run `npm run build` with no errors
- [ ] Verify no TypeScript errors
- [ ] Check all pages render correctly

### 4. Dependencies
- [ ] Run `npm install` with clean node_modules
- [ ] Verify all packages installed from package.json

---

## Vercel Setup Instructions

### Step 1: Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### Step 2: Connect to Vercel
```bash
cd predup-web
vercel login
```

### Step 3: Deploy

**Option A: CLI Deployment**
```bash
vercel --prod
```

**Option B: Git Integration**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`
   - `NEXT_PUBLIC_APP_ENV` = `production`
4. Deploy

### Step 4: Environment Variables in Vercel

Go to: **Project Settings → Environment Variables**

Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api-predup.up.railway.app` | Production, Development |
| `NEXT_PUBLIC_APP_NAME` | `PredUp` | All |
| `NEXT_PUBLIC_APP_ENV` | `production` | Production |

---

## Production Backend URL

When deploying, set `NEXT_PUBLIC_API_URL` to your backend:

**Railway Example:**
```
https://api-predup.up.railway.app
```

**Custom Domain Example:**
```
https://api.your-domain.com
```

---

## Troubleshooting

### Issue: "Connection refused" / Backend offline
- Check backend is running and accessible
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend

### Issue: Build fails
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all imports are correct

### Issue: Pages not loading
- Check browser console for errors
- Verify API endpoints are responding
- Check network tab for failed requests

---

## Quick Deploy Commands

```bash
# Local production build
npm run build

# Local preview
npm run start

# Vercel deploy (CLI)
vercel --prod

# Vercel deploy (preview)
vercel
```

---

## Post-Deployment Verification

1. Visit your deployed frontend URL
2. Check dashboard loads without errors
3. Verify API status shows "Connected"
4. Test navigation between pages
5. Check browser console for errors