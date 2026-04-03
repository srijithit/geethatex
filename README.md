# GeethaTex — Vercel Deployment Guide

## Project Structure

```
geethatex/
├── api/
│   ├── login.js       ← Serverless login endpoint (credentials stay SERVER-SIDE)
│   └── verify.js      ← Token verification endpoint
├── public/
│   └── index.html     ← Main website (NO credentials in this file)
├── .env.example       ← Template for environment variables
├── .gitignore         ← Protects .env files from being committed
└── vercel.json        ← Vercel routing config
```

## 🚀 Deploy to Vercel — Step by Step

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/geethatex.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `geethatex` repo
4. Click **Deploy** (don't deploy yet — set env vars first!)

### Step 3: Set Environment Variables ⚠️ CRITICAL
In Vercel Dashboard → Your Project → **Settings → Environment Variables**

Add these two variables:

| Name           | Value                          |
|----------------|--------------------------------|
| `ADMIN_PIN`    | `1629` (or your chosen PIN)    |
| `ADMIN_SECRET` | `AnyLongRandomStringHere123!`  |

> ✅ These are NEVER visible in the browser or source code.
> ✅ Choose a strong password — not `2025`!

### Step 4: Deploy
Click **Deploy** in Vercel. Your site will be live at `https://geethatex.vercel.app`

---

## 🔒 How Security Works

| Before (Old)                          | After (New)                                  |
|---------------------------------------|----------------------------------------------|
| `const ADMIN_PASS='2025'` in HTML     | Password stored in Vercel environment variable |
| Anyone could read it in DevTools      | Never sent to the browser                    |
| Login checked in browser JS           | Login checked on the server (`/api/login`)   |
| No token — anyone could fake login    | Server returns a signed token                |
| Token stored forever in localStorage  | Token in sessionStorage — clears on tab close |

## 🔧 Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Copy env template
cp .env.example .env.local
# Edit .env.local with your credentials

# Run locally
vercel dev
```

The site runs at `http://localhost:3000` with the same serverless functions.

---

## ⚡ Upgrading to a Real Database (Optional)

Currently products are saved in the visitor's browser `localStorage`.
This means product changes only appear on the device where you made them.

To share products across all devices, use **Vercel KV** (free tier available):

1. In Vercel Dashboard → Storage → Create KV Database
2. Install: `npm install @vercel/kv`
3. Replace `localStorage` calls in `api/` with KV reads/writes

Ask for help if you'd like this upgrade!
