import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import { BlogService } from '@app/services/blog.service';
import { SessionService } from '@app/services/session.service';
import { UserService } from '@app/services/user.service';
import type { Post, Session, User } from '@app/models';

@Component({
  selector: 'app-blog-reader',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AvatarComponent],
  template: `
    <app-navbar></app-navbar>

    @if (loading) {
      <div class="loading-container">
        <p>Loading post...</p>
      </div>
    } @else if (error) {
      <div class="error-container">
        <p>{{ error }}</p>
        <a routerLink="/blog" class="back-link">← Back to Blog</a>
      </div>
    } @else if (post) {
      <a routerLink="/blog" class="back-link">← Back to Blog</a>

      <article class="article-container">
        <h1 class="article-title">{{ post.title }}</h1>

        <div class="author-line">
          @if (authorUser) {
            <app-avatar
              [role]="authorUser.role"
              [displayName]="authorUser.displayName"
              size="md">
            </app-avatar>
          } @else {
            <div class="author-avatar">{{ getInitial(post.author) }}</div>
          }
          <div class="author-info">
            <span class="author-name">{{ authorUser?.displayName ?? post.author }}</span>
            <span class="article-date">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>

        <div class="article-content">
          <p>{{ post.content }}</p>
        </div>

        @if (canEdit || canDelete) {
          <div class="button-group">
            @if (canEdit) {
              <a class="btn btn-edit" [routerLink]="['/edit', post.id]">✏️ Edit</a>
            }
            @if (canDelete) {
              <button class="btn btn-delete" (click)="onDelete()">🗑️ Delete</button>
            }
          </div>
        }
      </article>
    }
  `,
  styleUrls: ['./blog-reader.component.css']
})
export class BlogReaderComponent implements OnInit {
  post: Post | null = null;
  authorUser: User | null = null;
  session: Session | null = null;
  loading = true;
  error = '';
  canEdit = false;
  canDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    const postId = this.route.snapshot.paramMap.get('id');

    if (!postId) {
      this.error = 'Post not found.';
      this.loading = false;
      return;
    }

    const post = this.blogService.findPost(postId);
    if (!post) {
      this.error = 'Post not found.';
      this.loading = false;
      return;
    }

    this.post = post;
    this.authorUser = this.userService.findUser(post.author);
    this.evaluatePermissions();
    this.loading = false;
  }

  private evaluatePermissions(): void {
    if (!this.session || !this.post) {
      this.canEdit = false;
      this.canDelete = false;
      return;
    }

    const isOwner = this.session.username === this.post.author;
    const isAdmin = this.session.role === 'admin';

    this.canEdit = isOwner || isAdmin;
    this.canDelete = isOwner || isAdmin;
  }

  onDelete(): void {
    if (!this.post) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    const deleted = this.blogService.deletePost(this.post.id);
    if (deleted) {
      this.router.navigate(['/blogs']);
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  getInitial(username: string): string {
    return username ? username.charAt(0).toUpperCase() : '?';
  }
}