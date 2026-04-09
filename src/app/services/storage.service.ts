import { Injectable } from '@angular/core';
import type { User, Post } from '@app/models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly USERS_KEY = 'users';
  private readonly POSTS_KEY = 'posts';
  private readonly SESSION_KEY = 'session';

  constructor() {
    this.seedIfNeeded();
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return null;
      }
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable — silently fail
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage unavailable — silently fail
    }
  }

  seedIfNeeded(): void {
    const existingUsers = this.get<User[]>(this.USERS_KEY);
    if (!existingUsers || !Array.isArray(existingUsers) || existingUsers.length === 0) {
      const seedUsers: User[] = [
        {
          displayName: 'Jane Author',
          username: 'jane',
          password: 'jane123',
          role: 'user'
        },
        {
          displayName: 'Bob Writer',
          username: 'bob',
          password: 'bob123',
          role: 'user'
        },
        {
          displayName: 'Sara Editor',
          username: 'sara',
          password: 'sara123',
          role: 'user'
        }
      ];
      this.set<User[]>(this.USERS_KEY, seedUsers);
    }

    const existingPosts = this.get<Post[]>(this.POSTS_KEY);
    if (!existingPosts || !Array.isArray(existingPosts) || existingPosts.length === 0) {
      const now = new Date();
      const seedPosts: Post[] = [
        {
          id: this.generateId(),
          title: 'Getting Started with Angular 17',
          content: 'Angular 17 introduces a host of new features including the new control flow syntax with @if and @for, deferred loading with @defer, and improved server-side rendering. In this post, we explore the key changes and how to migrate your existing applications to take advantage of these powerful new capabilities. The standalone component model is now the default, simplifying module management and reducing boilerplate across your projects.',
          author: 'jane',
          createdAt: new Date(now.getTime() - 86400000 * 3).toISOString()
        },
        {
          id: this.generateId(),
          title: 'Building Responsive Layouts with CSS Custom Properties',
          content: 'CSS custom properties (also known as CSS variables) provide a powerful way to create maintainable and themeable designs. By defining design tokens at the root level, you can ensure consistency across your entire application while making it trivial to implement dark mode, brand theming, and responsive adjustments. This article walks through practical patterns for spacing, typography, and color systems using custom properties.',
          author: 'bob',
          createdAt: new Date(now.getTime() - 86400000 * 2).toISOString()
        },
        {
          id: this.generateId(),
          title: 'Understanding Role-Based Access Control in SPAs',
          content: 'Role-based access control (RBAC) is essential for any application that serves multiple user types. In single-page applications, RBAC must be enforced both in the UI layer through route guards and conditional rendering, and in the service layer through ownership and permission checks. This post covers the fundamentals of implementing RBAC in Angular, including guard strategies, service-level enforcement, and common pitfalls to avoid.',
          author: 'sara',
          createdAt: new Date(now.getTime() - 86400000).toISOString()
        },
        {
          id: this.generateId(),
          title: 'localStorage as a Persistence Layer for Prototypes',
          content: 'When building prototypes or demo applications, localStorage offers a quick and effective persistence solution that requires no backend infrastructure. While it has limitations in storage capacity and lacks query capabilities, it is perfect for MVPs and proof-of-concept projects. This article discusses best practices for structuring data in localStorage, handling serialization edge cases, and implementing versioned storage keys for future migrations.',
          author: 'jane',
          createdAt: new Date(now.getTime() - 86400000 * 5).toISOString()
        },
        {
          id: this.generateId(),
          title: 'Deploying Angular Apps to Vercel',
          content: 'Vercel provides an excellent platform for deploying Angular single-page applications with minimal configuration. By setting up proper SPA rewrite rules and configuring the correct output directory, you can have your Angular app live in minutes. This guide covers the complete deployment workflow from local build verification to production deployment, including troubleshooting common issues like 404 errors on page refresh and missing assets.',
          author: 'bob',
          createdAt: new Date(now.getTime() - 86400000 * 4).toISOString()
        }
      ];
      this.set<Post[]>(this.POSTS_KEY, seedPosts);
    }
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomPart}`;
  }
}