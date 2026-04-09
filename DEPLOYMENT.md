# Deployment Guide — WriteSpace Blog

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Configuration Files](#configuration-files)
- [Environment Notes](#environment-notes)
- [Build Details](#build-details)
- [Troubleshooting](#troubleshooting)
- [CI/CD Notes](#cicd-notes)

---

## Overview

WriteSpace Blog is a client-side Angular 17+ application deployed to **Vercel**. The application is a Single Page Application (SPA) and requires proper rewrite rules to handle client-side routing.

---

## Prerequisites

- A [Vercel](https://vercel.com) account
- The project repository hosted on GitHub, GitLab, or Bitbucket
- Node.js 18+ and npm 9+ installed locally (for local builds and testing)
- Angular CLI installed globally (`npm install -g @angular/cli`)

---

## Vercel Deployment

### Step 1: Connect Your Repository

1. Log in to [Vercel](https://vercel.com/dashboard).
2. Click **"Add New…"** → **"Project"**.
3. Select your Git provider (GitHub, GitLab, or Bitbucket).
4. Find and select the **writespace-blog** repository.
5. Click **"Import"**.

### Step 2: Configure Build Settings

Vercel will auto-detect the Angular framework. Verify or manually set the following:

| Setting              | Value                              |
| -------------------- | ---------------------------------- |
| **Framework Preset** | Angular                            |
| **Build Command**    | `ng build`                         |
| **Output Directory** | `dist/writespace-blog/browser`     |
| **Install Command**  | `npm install`                      |

> **Important:** Angular 17+ outputs to `dist/<project-name>/browser` by default. Ensure the output directory matches exactly.

### Step 3: Deploy

1. Click **"Deploy"**.
2. Vercel will install dependencies, run the build, and deploy the application.
3. Once complete, you will receive a production URL (e.g., `https://writespace-blog.vercel.app`).

### Step 4: Verify

- Visit the production URL and confirm the application loads.
- Navigate to a deep route (e.g., `/blog/my-post`) and refresh the page to confirm SPA routing works correctly.

---

## Configuration Files

### `vercel.json` — SPA Rewrite Configuration

The `vercel.json` file at the project root ensures all routes are rewritten to `index.html`, enabling Angular's client-side router to handle navigation:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Why this is needed:** Without this rewrite rule, refreshing or directly navigating to any route other than `/` will result in a 404 error because Vercel will look for a matching static file on the server.

### `angular.json` — Output Directory Setup

Ensure the `angular.json` file has the correct output path configured under the build architect:

```json
{
  "projects": {
    "writespace-blog": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/writespace-blog"
          }
        }
      }
    }
  }
}
```

Angular 17+ uses an `application` builder that outputs to a `browser` subdirectory within the configured `outputPath`. The final build artifacts will be located at:

```
dist/writespace-blog/browser/
├── index.html
├── main-[hash].js
├── polyfills-[hash].js
├── styles-[hash].css
└── ...
```

---

## Environment Notes

WriteSpace Blog is a **fully client-side application**. There are no server-side environment variables required for deployment.

- **No `.env` files** are needed.
- **No `NEXT_PUBLIC_*` or server-side secrets** are used.
- All configuration is embedded at build time or handled within the Angular application itself.
- If you add API integrations in the future, use Angular's `environment.ts` and `environment.prod.ts` files under `src/environments/` and configure them in `angular.json` file replacements.

> **Note:** If you do introduce environment-specific values later, you can add them as Vercel Environment Variables in the project settings and reference them during the build process via custom build scripts.

---

## Build Details

### Build Command

```bash
ng build
```

This runs the production build by default in Angular 17+. It performs:

- Ahead-of-Time (AOT) compilation
- Tree shaking and dead code elimination
- Minification and bundling
- CSS optimization

### Output Directory

```
dist/writespace-blog/browser
```

### Local Build Verification

Before deploying, you can verify the build locally:

```bash
# Install dependencies
npm install

# Run production build
ng build

# Serve the built files locally (optional)
npx http-server dist/writespace-blog/browser -o
```

Confirm that:
- The build completes without errors.
- The `dist/writespace-blog/browser` directory contains `index.html` and bundled assets.
- The application loads and routes work when served locally.

---

## Troubleshooting

### 404 on Page Refresh or Direct URL Access

**Cause:** Missing SPA rewrite rules.

**Fix:** Ensure `vercel.json` exists at the project root with the rewrite configuration shown above. Redeploy after adding the file.

---

### Build Fails with "Cannot find module" Errors

**Cause:** Dependencies are not installed or `package-lock.json` is out of sync.

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
ng build
```

Commit the updated `package-lock.json` and redeploy.

---

### Output Directory Not Found on Vercel

**Cause:** The output directory configured in Vercel does not match the actual build output.

**Fix:** Verify the output directory is set to `dist/writespace-blog/browser` (not `dist/writespace-blog` or `dist/`). Check `angular.json` to confirm the `outputPath` value and remember that Angular 17+ appends a `browser` subdirectory.

---

### Blank Page After Deployment

**Cause:** Incorrect `<base href>` in `index.html` or asset paths not resolving.

**Fix:**
1. Ensure `src/index.html` contains `<base href="/">`.
2. If deploying to a subdirectory, update the base href accordingly:
   ```bash
   ng build --base-href /your-subdirectory/
   ```

---

### Styles or Assets Missing in Production

**Cause:** Assets not included in the `angular.json` assets array.

**Fix:** Verify that `angular.json` includes the assets configuration:
```json
"assets": [
  "src/favicon.ico",
  "src/assets"
]
```

---

### Build Succeeds Locally but Fails on Vercel

**Cause:** Node.js version mismatch between local and Vercel environments.

**Fix:** Specify the Node.js version in `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Or set the Node.js version in Vercel project settings under **Settings** → **General** → **Node.js Version**.

---

### Angular SSR / Prerendering Conflicts

**Cause:** If SSR was accidentally enabled, the build output structure changes and Vercel's static hosting may not serve it correctly.

**Fix:** WriteSpace Blog is a client-side SPA. Ensure `angular.json` uses the `@angular-devkit/build-angular:application` builder (or `browser` builder) without SSR configuration. Remove any `server.ts` or SSR-related entries if they exist.

---

## CI/CD Notes

### Automatic Deployments

Once connected to Vercel, deployments are triggered automatically:

- **Production deployments** are triggered on pushes to the `main` (or `master`) branch.
- **Preview deployments** are triggered on pull requests and pushes to other branches.

Each preview deployment gets a unique URL for testing before merging.

### Branch Configuration

To customize which branches trigger production deployments:

1. Go to **Vercel Project Settings** → **Git**.
2. Update the **Production Branch** to your desired branch name.

### Skipping Deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in the commit message:

```bash
git commit -m "Update README [skip ci]"
```

### Build Caching

Vercel caches `node_modules` between deployments to speed up builds. If you encounter stale dependency issues, you can clear the cache:

1. Go to **Vercel Project Settings** → **General**.
2. Scroll to **Build & Development Settings**.
3. Use the **"Override"** option for the install command and set it to `npm ci` to force a clean install.

### Custom CI Pipeline

If you use an external CI/CD tool (e.g., GitHub Actions) alongside Vercel:

1. Disable Vercel's automatic Git integration if needed.
2. Use the [Vercel CLI](https://vercel.com/docs/cli) to deploy from your pipeline:
   ```bash
   npm install -g vercel
   vercel --prod --token $VERCEL_TOKEN
   ```
3. Store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as secrets in your CI environment.

### Pre-Deployment Checks

Consider adding these steps to your CI pipeline before deployment:

```bash
# Lint the codebase
ng lint

# Run unit tests
ng test --watch=false --browsers=ChromeHeadless

# Run production build to catch build errors
ng build
```

---