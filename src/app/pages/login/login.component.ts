import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="login-card">
      <h1>Welcome Back</h1>

      <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        @if (formError) {
          <p class="form-error">{{ formError }}</p>
        }

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="Enter your username"
            [class.invalid]="isFieldInvalid('username')"
            autocomplete="username">
          @if (isFieldInvalid('username')) {
            <p class="error-message">
              @if (loginForm.get('username')?.hasError('required')) {
                Username is required.
              } @else if (loginForm.get('username')?.hasError('minlength')) {
                Username must be at least 3 characters.
              }
            </p>
          }
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Enter your password"
            [class.invalid]="isFieldInvalid('password')"
            autocomplete="current-password">
          @if (isFieldInvalid('password')) {
            <p class="error-message">
              @if (loginForm.get('password')?.hasError('required')) {
                Password is required.
              } @else if (loginForm.get('password')?.hasError('minlength')) {
                Password must be at least 4 characters.
              }
            </p>
          }
        </div>

        <button
          type="submit"
          class="submit-button"
          [disabled]="loginForm.invalid && loginForm.touched">
          Sign In
        </button>
      </form>

      <p class="login-footer">
        Don't have an account? <a routerLink="/register">Sign up</a>
      </p>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formError = '';

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.formError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';

    const success = this.sessionService.login(username, password);

    if (!success) {
      this.formError = 'Invalid username or password. Please try again.';
      return;
    }

    const session = this.sessionService.getSession();

    if (session && session.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/blogs']);
    }
  }
}