import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { FooterComponent } from '@app/components/footer/footer.component';
import { StorageService } from '@app/services/storage.service';
import type { Post } from '@app/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-tagline">Your Space to Write, Share, and Inspire</h1>
        <p class="hero-subtitle">
          WriteSpace is a modern blogging platform where ideas come to life.
          Create beautiful posts, connect with readers, and grow your audience.
        </p>
        <div class="hero-actions">
          <a routerLink="/register" class="hero-btn-primary">Get Started Free</a>
          <a routerLink="/blog" class="hero-btn-secondary">Browse Posts</a>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="features-container">
        <div class="section-header">
          <h2 class="section-title">Why WriteSpace?</h2>
          <p class="section-subtitle">
            Everything you need to create, manage, and share your writing with the world.
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">✍️</div>
            <h3 class="feature-title">Easy Writing</h3>
            <p class="feature-description">
              A clean, distraction-free editor that lets you focus on what matters most — your words.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Role-Based Access</h3>
            <p class="feature-description">
              Powerful admin and author roles ensure the right people have the right permissions.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Responsive Design</h3>
            <p class="feature-description">
              Your content looks stunning on every device — desktop, tablet, and mobile.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="latest-posts-section">
      <div class="latest-posts-container">
        <div class="section-header">
          <h2 class="section-title">Latest Posts</h2>
          <p class="section-subtitle">
            Discover the most recent stories from our community of writers.
          </p>
        </div>
        @if (latestPosts.length > 0) {
          <div class="posts-grid">
            @for (post of latestPosts; track post.id) {
              <div class="post-card">
                <div class="post-image-placeholder"></div>
                <div class="post-content">
                  <div class="post-meta">
                    <span class="post-category">Blog</span>
                    <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                  </div>
                  <h3 class="post-title">
                    <a [routerLink]="['/blog', post.id]">{{ post.title }}</a>
                  </h3>
                  <p class="post-excerpt">{{ truncateContent(post.content) }}</p>
                  <a [routerLink]="['/blog', post.id]" class="post-read-more">
                    Read more <span>→</span>
                  </a>
                </div>
              </div>
            }
          </div>
          <div class="posts-view-all">
            <a routerLink="/blog">View All Posts</a>
          </div>
        } @else {
          <div class="empty-state">
            <p>No posts yet. Be the first to share your story!</p>
            <a routerLink="/register" class="hero-btn-primary" style="margin-top: 1.5rem;">Start Writing</a>
          </div>
        }
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-container">
        <h2 class="cta-title">Ready to Start Writing?</h2>
        <p class="cta-description">
          Join our growing community of writers and share your unique perspective with the world.
        </p>
        <div class="hero-actions">
          <a routerLink="/register" class="hero-btn-primary">Create Your Account</a>
          <a routerLink="/login" class="hero-btn-secondary">Sign In</a>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styleUrls: ['./landing.component.css']
})
export class LandingPageComponent implements OnInit {
  latestPosts: Post[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadLatestPosts();
  }

  private loadLatestPosts(): void {
    const posts = this.storageService.get<Post[]>('posts') ?? [];
    this.latestPosts = [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
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

  truncateContent(content: string): string {
    const maxLength = 120;
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength).trimEnd() + '…';
  }
}