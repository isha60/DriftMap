# DriftMap Deployment Fixes and EC2 Deployment Guide

I have analyzed all the errors you reported and made the necessary code adjustments to prepare DriftMap for a stable EC2 deployment.

## Issues Addressed and Code Fixes Applied

Here is a summary of the root causes identified from your bug report and how they have been fixed in the codebase:

### 1. Vercel Analytics Failure (404 Error)
**Root Cause:** Vercel Analytics relies on Vercel's proprietary edge network. Running it on EC2 caused a 404 since that endpoint doesn't exist on your server.
**Fix:** Removed `<Analytics />` from `app/layout.tsx`.

### 2. Cookie Configuration for HTTP
**Root Cause:** The `secure: process.env.NODE_ENV === "production"` flag enforced an HTTPS connection to send cookies. Because the initial EC2 deployment is often accessed via an HTTP IP, login redirection was happening but cookies weren't being stored/sent.
**Fix:** Changed `secure: false` in both `app/api/auth/login/route.ts` and `app/api/auth/signup/route.ts`.

### 3. Missing Credentials in API Requests
**Root Cause:** The `/me` API was functioning but the `driftmap_token` cookie wasn't being passed with client-side SWR fetches.
**Fix:** Added `credentials: "include"` to the `fetcher` in `lib/auth-context.tsx`.

### 4. Router Refresh After Login/Signup
**Root Cause:** The client router cache held onto the older "unauthenticated" state. Even when redirected to the dashboard, it didn't trigger a re-render pulling the new user data.
**Fix:** Added `router.refresh()` immediately after `router.push('/dashboard')` in both `login/page.tsx` and `signup/page.tsx`.

---

> [!WARNING] 
> **Action Required:** Your `.env.local` file has a duplicated string error!
> ```env
> # Broken String:
> MONGODB_URI=mongodb+srv://user:pass@driftmap...mongodb+srv://user:pass@driftmap...
> 
> # Correct String:
> MONGODB_URI=mongodb+srv://user:pass@driftmap.ceb83gv.mongodb.net/?appName=driftmap
> ```
> Please fix `.env.local` manually so the database connection succeeds! 

---

## Complete Guide to Deploying DriftMap on EC2 properly

The remaining errors (WebSocket 500s, HMR failures, Next.js proxy blocking) originated entirely from running the Next.js **Development Server** (`npm run dev`) in a public, production-like environment. 

To deploy correctly, follow these exact steps on your EC2 instance:

### Step 1: Secure Environment Variables
On your EC2 instance, ensure your `.env.local` (or `.env`) contains the valid single `MONGODB_URI` and a secret for JWT generation:

```env
MONGODB_URI=mongodb+srv://isha37623_db_user:Esmyp9mU4Y6zT4cc@driftmap.ceb83gv.mongodb.net/?appName=driftmap
JWT_SECRET=your_super_secret_string_here
```

### Step 2: Clean the Build Environment
Because you previously ran the app using development mode, your `.next` cache might be corrupted with dev-server specific traces. Clean it up before making a fresh build.
```bash
rm -rf .next
rm -rf node_modules
npm install
```

### Step 3: Build for Production
This compiles Next.js from Development Mode (which triggers HMR WebSockets) into highly optimized static and server-rendered production files.
```bash
npm run build
```

### Step 4: Start the Production Server
Start your application using the production server. This resolves **all cross-origin HMR WebSocket blocking errors**.
```bash
npm run start -- -p 3000
```

> [!TIP]
> **Use PM2 for Reliability:** running `npm start` directly will stop the server when you close the SSH session. Instead, use a process manager like PM2:
> ```bash
> npm install -g pm2
> pm2 start npm --name "driftmap" -- start
> pm2 save
> ```

### Step 5: (Optional but Recommended) Setup Nginx Reverse Proxy
Instead of hitting port `3000` via IP (HTTP), set up Nginx and a custom domain to proxy traffic internally and enable HTTPS (so you can eventually revert your cookie setting to `secure: true` for greater security).

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
