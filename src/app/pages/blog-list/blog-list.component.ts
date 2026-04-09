import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import { BlogService } from '@app/services/blog.service';
import { UserService } from '@app/services/user.service';
import type { Post, User } from '@app/models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AvatarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="blog-list-page">
      <div class="blog-list-header">
        <h1>Blog Posts</h1>
        <a class="write-btn" routerLink="/blog/new">
          <span class="write-btn-icon">✍️</span>
          Write New Post
        </a>
      </div>

      <div class="posts-grid">
        @if (posts.length === 0) {
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <h3 class="empty-state-title">No posts yet</h3>
            <p class="empty-state-message">
              Be the first to share your thoughts. Click the "Write New Post" button to get started.
            </p>
            <a class="write-btn" routerLink="/blog/new">
              <span class="write-btn-icon">✍️</span>
              Write New Post
            </a>
          </div>
        }

        @for (post of posts; track post.id) {
          <div class="post-card">
            <div class="post-card-body">
              <h2 class="post-card-title">
                <a [routerLink]="['/blog', post.id]">{{ post.title }}</a>
              </h2>
              <p class="post-card-excerpt">{{ getExcerpt(post.content) }}</p>
              <div class="post-card-footer">
                <div class="author-line">
                  <app-avatar
                    [role]="getAuthorRole(post.author)"
                    [displayName]="getAuthorDisplayName(post.author)"
                    size="sm">
                  </app-avatar>
                  <span class="author-name">{{ getAuthorDisplayName(post.author) }}</span>
                </div>
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  posts: Post[] = [];
  private userCache: Map<string, User | null> = new Map();

  constructor(
    private blogService: BlogService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    const allPosts = this.blogService.getPosts();
    this.posts = [...allPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getExcerpt(content: string): string {
    if (!content) {
      return '';
    }
    const maxLength = 150;
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength).trimEnd() + '…';
  }

  getAuthorDisplayName(username: string): string {
    const user = this.getCachedUser(username);
    return user?.displayName ?? username;
  }

  getAuthorRole(username: string): 'admin' | 'user' {
    const user = this.getCachedUser(username);
    return user?.role ?? 'user';
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

  private getCachedUser(username: string): User | null {
    if (this.userCache.has(username)) {
      return this.userCache.get(username) ?? null;
    }
    const user = this.userService.findUser(username);
    this.userCache.set(username, user);
    return user;
  }
}