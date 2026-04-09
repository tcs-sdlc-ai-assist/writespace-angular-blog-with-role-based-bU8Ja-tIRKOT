import { Routes } from '@angular/router';
import { authGuard, adminGuard } from '@app/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/pages/landing/landing.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('@app/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@app/pages/register/register.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'blogs',
    canActivate: [authGuard],
    loadComponent: () => import('@app/pages/blog-list/blog-list.component').then(m => m.BlogListComponent)
  },
  {
    path: 'blog/new',
    canActivate: [authGuard],
    loadComponent: () => import('@app/pages/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent)
  },
  {
    path: 'blog/:id',
    canActivate: [authGuard],
    loadComponent: () => import('@app/pages/blog-reader/blog-reader.component').then(m => m.BlogReaderComponent)
  },
  {
    path: 'write',
    canActivate: [authGuard],
    loadComponent: () => import('@app/pages/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('@app/pages/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('@app/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('@app/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadComponent: () => import('@app/pages/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];