import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import { DashboardService } from '@app/services/dashboard.service';
import { BlogService } from '@app/services/blog.service';
import { SessionService } from '@app/services/session.service';
import type { DashboardStats, Post, Session } from '@app/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AvatarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon posts">📝</div>
          <div class="stat-info">
            <span class="stat-count">{{ stats.totalPosts }}</span>
            <span class="stat-label">Total Posts</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon users">👥</div>
          <div class="stat-info">
            <span class="stat-count">{{ stats.totalUsers }}</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon admins">👑</div>
          <div class="stat-info">
            <span class="stat-count">{{ stats.totalAdmins }}</span>
            <span class="stat-label">Admins</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon regular">📖</div>
          <div class="stat-info">
            <span class="stat-count">{{ stats.totalRegularUsers }}</span>
            <span class="stat-label">Regular Users</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-group">
          <a class="action-btn primary" routerLink="/blog/new">
            <span>✍️</span> Write New Post
          </a>
          <a class="action-btn secondary" routerLink="/users">
            <span>👥</span> Manage Users
          </a>
        </div>
      </div>

      <div class="recent-posts-section">
        <div class="section-header">
          <h2>Recent Posts</h2>
          <a class="view-all-link" routerLink="/blog">View All →</a>
        </div>

        @if (recentPosts.length === 0) {
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No posts yet. Start writing!</p>
          </div>
        } @else {
          <table class="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (post of recentPosts; track post.id) {
                <tr>
                  <td class="post-title-cell">{{ post.title }}</td>
                  <td class="post-author-cell">{{ post.author }}</td>
                  <td class="post-date-cell">{{ formatDate(post.createdAt) }}</td>
                  <td>
                    <div class="inline-controls">
                      <button class="inline-btn edit" (click)="editPost(post)">Edit</button>
                      <button class="inline-btn delete" (click)="confirmDeletePost(post)">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <div class="posts-list-mobile">
            @for (post of recentPosts; track post.id) {
              <div class="post-card">
                <div class="post-card-header">
                  <h3 class="post-card-title">{{ post.title }}</h3>
                </div>
                <div class="post-card-meta">
                  <span>By {{ post.author }}</span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
                <div class="post-card-actions">
                  <button class="inline-btn edit" (click)="editPost(post)">Edit</button>
                  <button class="inline-btn delete" (click)="confirmDeletePost(post)">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalPosts: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0
  };

  recentPosts: Post[] = [];
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private blogService: BlogService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.errorMessage = '';
    try {
      this.stats = this.dashboardService.getStats();
      this.recentPosts = this.dashboardService.getRecentPosts(5);
    } catch {
      this.errorMessage = 'Failed to load dashboard data. Please try again.';
    }
  }

  editPost(post: Post): void {
    this.router.navigate(['/blog', 'edit', post.id]);
  }

  confirmDeletePost(post: Post): void {
    const confirmed = window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    const success = this.blogService.deletePost(post.id);
    if (success) {
      this.loadData();
    } else {
      this.errorMessage = 'Failed to delete the post. You may not have permission.';
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}