import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { UserService } from '@app/services/user.service';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import type { Session, User } from '@app/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/">
        <span class="navbar-brand-icon">✍️</span>
        <span>WriteSpace</span>
      </a>

      <button
        class="hamburger"
        [class.open]="menuOpen"
        (click)="toggleMenu()"
        aria-label="Toggle navigation menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      @if (session) {
        <ul class="navbar-links" [class.open]="menuOpen">
          @if (session.role === 'admin') {
            <li>
              <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a>
            </li>
          }
          <li>
            <a routerLink="/blog" routerLinkActive="active" (click)="closeMenu()">Blog</a>
          </li>
          <li>
            <a routerLink="/blog/new" routerLinkActive="active" (click)="closeMenu()">Write</a>
          </li>
        </ul>
        <div class="navbar-actions" [class.open]="menuOpen">
          <app-avatar
            [role]="session.role"
            [displayName]="currentDisplayName"
            [showName]="true"
            size="sm">
          </app-avatar>
          <button class="navbar-cta" (click)="logout()">Logout</button>
        </div>
      } @else {
        <ul class="navbar-links" [class.open]="menuOpen">
          <li>
            <a routerLink="/blog" routerLinkActive="active" (click)="closeMenu()">Blog</a>
          </li>
        </ul>
        <div class="navbar-actions" [class.open]="menuOpen">
          <a class="navbar-cta" routerLink="/login" style="background-color: transparent; color: #eaeaea; border: 1px solid #eaeaea;" (click)="closeMenu()">Login</a>
          <a class="navbar-cta" routerLink="/register" (click)="closeMenu()">Get Started</a>
        </div>
      }
    </nav>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;
  session: Session | null = null;
  currentDisplayName = '';

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshSession();
  }

  ngDoCheck(): void {
    const current = this.sessionService.getSession();
    const currentUsername = current?.username ?? null;
    const previousUsername = this.session?.username ?? null;
    if (currentUsername !== previousUsername) {
      this.refreshSession();
    }
  }

  private refreshSession(): void {
    this.session = this.sessionService.getSession();
    if (this.session) {
      const user: User | null = this.userService.findUser(this.session.username);
      this.currentDisplayName = user?.displayName ?? this.session.username;
    } else {
      this.currentDisplayName = '';
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.sessionService.logout();
    this.session = null;
    this.currentDisplayName = '';
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}