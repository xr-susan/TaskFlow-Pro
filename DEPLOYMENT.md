# Deployment Guide

This guide covers how to deploy TaskFlow Pro to various hosting platforms.

## Prerequisites

Before deploying, make sure your project builds successfully:

```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

---

## 🚀 Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/taskflow-pro.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Deploy**
   - Click "Deploy"
   - Done! Your app is live

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

Create `vercel.json` if needed:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🌐 Netlify

### Option 1: Deploy via Netlify Dashboard

1. **Push to GitHub** (same as above)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Deploy**
   - Click "Deploy site"

### Option 2: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize project
netlify init

# Deploy
netlify deploy --prod
```

### Option 3: Drag and Drop

1. Run `npm run build` locally
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder to the browser

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📦 GitHub Pages

### Setup

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/taskflow-pro/', // Your repo name
   })
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages`

---

## 🔥 Firebase Hosting

### Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

---

## ☁️ AWS Amplify

1. **Push to GitHub**

2. **Connect to AWS Amplify**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

4. **Deploy**
   - Click "Save and deploy"

---

## 🐳 Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Build and Run

```bash
docker build -t taskflow-pro .
docker run -p 3000:80 taskflow-pro
```

---

## 🌍 Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown

### Netlify
1. Go to Site Settings → Domain management
2. Add custom domain
3. Update DNS records

---

## 📝 Pre-deployment Checklist

- [ ] All features working locally
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Dark mode works correctly
- [ ] Data persists after refresh
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set (if any)
- [ ] README.md is up to date

---

## 🐛 Troubleshooting

### Blank page after deployment
- Check if `base` in vite.config.ts is correct
- Verify all routes redirect to index.html

### Assets not loading
- Ensure paths are relative
- Check if CDN is configured correctly

### Build fails
- Run `npm install` before building
- Check for TypeScript errors: `npx tsc --noEmit`

---

Need help? Open an issue on GitHub!
