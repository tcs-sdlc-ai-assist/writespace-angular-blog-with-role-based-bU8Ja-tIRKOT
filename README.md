# WriteSpace Blog

A modern blogging platform built with Angular 17+ featuring role-based access control, a rich text editing experience, and a clean, customizable UI powered by CSS custom properties.

## Tech Stack

- **Framework:** Angular 17+ (Standalone Components)
- **Language:** TypeScript
- **Storage:** localStorage (no backend required)
- **Styling:** CSS with Custom Properties (CSS Variables)
- **Deployment:** Vercel

## Features

- **Role-Based Access Control** — Admin and User roles with distinct permissions
- **Blog Post Management** — Create, read, update, and delete blog posts
- **User Authentication** — Login/logout with session persistence via localStorage
- **Admin Dashboard** — Manage users and all blog posts
- **Responsive Design** — Mobile-first layout that works across all devices
- **Theming with CSS Custom Properties** — Easily customizable design tokens
- **Search & Filter** — Find posts by title, content, or author
- **Comments System** — Users can comment on blog posts
- **Lazy-Loaded Routes** — Optimized bundle size with route-level code splitting

## Folder Structure

```
writespace-blog/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── blog-list/
│   │   │   ├── blog-detail/
│   │   │   ├── blog-editor/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── admin-dashboard/
│   │   │   └── comment/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── models/
│   │   │   ├── post.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── comment.model.ts
│   │   ├── pipes/
│   │   │   ├── truncate.pipe.ts
│   │   │   └── time-ago.pipe.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── blog.service.ts
│   │   │   ├── comment.service.ts
│   │   │   └── storage.service.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vercel.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 17+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace-blog

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Build

```bash
# Build for production
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
# Run unit tests
ng test
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Build the project
ng build

# Deploy
vercel --prod
```

### Option 2: Git Integration

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"New Project"** and import your repository
4. Configure the build settings:
   - **Framework Preset:** Angular
   - **Build Command:** `ng build`
   - **Output Directory:** `dist/writespace-blog/browser`
5. Click **"Deploy"**

The `vercel.json` in the project root handles SPA routing rewrites automatically.

## Role-Based Access

WriteSpace implements two distinct roles:

### Admin

- Full access to all features
- Create, edit, and delete **any** blog post
- Access the Admin Dashboard
- Manage user accounts (view, promote, delete)
- Moderate comments on all posts

### User

- Browse and read all published blog posts
- Create new blog posts
- Edit and delete **only their own** posts
- Add comments to any post
- Edit and delete **only their own** comments
- Manage their own profile

### Default Credentials

The application ships with a pre-configured admin account for initial setup:

| Role  | Username | Password |
|-------|----------|----------|
| Admin | `admin`  | `admin`  |

> **⚠️ Important:** Change the default admin credentials after your first login. These are for development and initial setup purposes only.

New users can register through the registration page and are assigned the **User** role by default.

## CSS Custom Properties Reference

WriteSpace uses CSS custom properties (CSS variables) for consistent theming. Override these in your `styles.css` or a custom theme file:

### Colors

```css
:root {
  /* Primary */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-primary-light: #e0e7ff;

  /* Neutral */
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Typography

```css
:root {
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Fira Code', 'Cascadia Code', monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

### Spacing & Layout

```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  --container-max-width: 1200px;
  --header-height: 64px;
}
```

### Transitions

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

To create a dark theme, override the color variables within a `[data-theme="dark"]` selector or a `prefers-color-scheme` media query.

## License

**Private** — All rights reserved. This project is proprietary and not licensed for public use, distribution, or modification.