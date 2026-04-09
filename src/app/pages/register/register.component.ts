import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="register-card">
      <h2>Create Account</h2>
      <p class="subtitle">Join WriteSpace and start sharing your stories.</p>

      @if (formError) {
        <div class="form-error">{{ formError }}</div>
      }

      <form class="register-form" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            placeholder="Your display name"
            [class.invalid]="isFieldInvalid('displayName')">
          @if (isFieldInvalid('displayName')) {
            <span class="error-message">
              @if (registerForm.get('displayName')?.errors?.['required']) {
                Display name is required.
              } @else if (registerForm.get('displayName')?.errors?.['minlength']) {
                Display name must be at least 2 characters.
              } @else if (registerForm.get('displayName')?.errors?.['maxlength']) {
                Display name must be at most 32 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="Choose a username"
            [class.invalid]="isFieldInvalid('username')">
          @if (isFieldInvalid('username')) {
            <span class="error-message">
              @if (registerForm.get('username')?.errors?.['required']) {
                Username is required.
              } @else if (registerForm.get('username')?.errors?.['minlength']) {
                Username must be at least 3 characters.
              } @else if (registerForm.get('username')?.errors?.['maxlength']) {
                Username must be at most 20 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Create a password"
            [class.invalid]="isFieldInvalid('password')">
          @if (isFieldInvalid('password')) {
            <span class="error-message">
              @if (registerForm.get('password')?.errors?.['required']) {
                Password is required.
              } @else if (registerForm.get('password')?.errors?.['minlength']) {
                Password must be at least 6 characters.
              } @else if (registerForm.get('password')?.errors?.['maxlength']) {
                Password must be at most 32 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            placeholder="Confirm your password"
            [class.invalid]="isFieldInvalid('confirmPassword') || (registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch'])">
          @if (isFieldInvalid('confirmPassword')) {
            <span class="error-message">
              @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                Please confirm your password.
              }
            </span>
          } @else if (registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']) {
            <span class="error-message">Passwords do not match.</span>
          }
        </div>

        <button
          type="submit"
          class="submit-btn"
          [disabled]="registerForm.invalid || isSubmitting">
          {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account? <a routerLink="/login">Sign in</a>
      </p>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formError = '';
  isSubmitting = false;

  registerForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(32)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  }, { validators: this.passwordMatchValidator });

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field !== null && field.invalid && field.touched;
  }

  onSubmit(): void {
    this.formError = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const displayName = this.registerForm.get('displayName')?.value?.trim() ?? '';
    const username = this.registerForm.get('username')?.value?.trim() ?? '';
    const password = this.registerForm.get('password')?.value ?? '';

    const success = this.sessionService.register(displayName, username, password);

    if (success) {
      this.router.navigate(['/blog']);
    } else {
      this.formError = 'Username is already taken. Please choose a different one.';
      this.isSubmitting = false;
    }
  }
}