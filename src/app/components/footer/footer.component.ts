import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-branding">
          <span class="footer-logo">WriteSpace</span>
          <p class="footer-tagline">Your space to write, share, and inspire.</p>
        </div>
        <nav class="footer-links">
          <a href="/about" class="footer-link">About</a>
          <a href="/privacy" class="footer-link">Privacy</a>
          <a href="/terms" class="footer-link">Terms</a>
        </nav>
        <div class="footer-copyright">
          <p>&copy; {{ currentYear }} WriteSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #1a1a2e;
      color: #e0e0e0;
      padding: 2rem 1rem;
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .footer-branding {
      text-align: center;
    }

    .footer-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.05em;
    }

    .footer-tagline {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      color: #a0a0b0;
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;
    }

    .footer-link {
      color: #c0c0d0;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    .footer-copyright {
      text-align: center;
      font-size: 0.8rem;
      color: #808090;
    }

    .footer-copyright p {
      margin: 0;
    }
  `]
})
export class FooterComponent {
  readonly currentYear: number = new Date().getFullYear();
}