# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

#### Public Landing Page
- Hero section with call-to-action for new visitors.
- Featured blog posts displayed on the homepage.
- Responsive layout optimized for desktop, tablet, and mobile viewports.

#### Authentication
- User login page with email and password fields using Angular Reactive Forms.
- User registration page with form validation (required fields, email format, password strength).
- Auth service managing session state via localStorage tokens.
- Automatic redirect to login for unauthenticated users attempting to access protected routes.

#### Role-Based Access Control
- Two user roles: `admin` and `author`.
- Angular route guards implementing `CanActivate` to protect admin and author routes.
- Admin-only routes redirect non-admin users to the dashboard.
- Author routes restrict content management to authenticated authors and admins.

#### Avatar System
- Default avatar generation based on user initials.
- Avatar display in the navigation bar and user profile sections.
- Support for custom avatar URLs stored in user profile data.

#### Blog CRUD with Ownership Rules
- Create new blog posts with title, content, and optional featured image.
- Read blog posts in a paginated list view and individual detail view.
- Update blog posts restricted to the original author or an admin.
- Delete blog posts restricted to the original author or an admin.
- Blog post model includes title, content, author reference, timestamps, and published status.

#### Admin Dashboard with Stats
- Dashboard overview displaying total users, total posts, and recent activity.
- Summary cards with key metrics rendered via Angular components.
- Quick-access links to user management and content moderation.

#### User Management Panel
- Admin-only panel listing all registered users.
- Ability to view user details including role, registration date, and post count.
- Admin actions to change user roles and deactivate accounts.
- Search and filter functionality for the user list.

#### localStorage Persistence with Seeding
- All application data (users, blog posts, sessions) persisted in localStorage.
- Initial seed data loaded on first application launch including sample admin user, sample authors, and sample blog posts.
- Service layer abstracting localStorage operations with typed interfaces.

#### Responsive CSS UI
- Mobile-first responsive design using custom CSS.
- Consistent color scheme and typography across all pages.
- Navigation bar with hamburger menu for mobile viewports.
- Card-based layouts for blog post listings and dashboard stats.
- Form styling with validation state indicators (error highlights, helper text).

#### Vercel Deployment Configuration
- `vercel.json` configured with SPA rewrite rules for Angular routing.
- Build command and output directory specified for production builds.
- Environment-agnostic configuration supporting both development and production modes.