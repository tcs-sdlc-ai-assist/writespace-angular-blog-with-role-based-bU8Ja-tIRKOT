import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import { UserService } from '@app/services/user.service';
import { SessionService } from '@app/services/session.service';
import type { User, Session } from '@app/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, AvatarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="page-header">
      <h1>User Management</h1>
      <p>Create, view, and manage user accounts.</p>
    </div>

    <div class="create-user-card">
      <h2>Create New User</h2>

      @if (formMessage) {
        <div class="form-message" [class.success]="formMessageType === 'success'" [class.error]="formMessageType === 'error'">
          {{ formMessage }}
        </div>
      }

      <form class="create-user-form" [formGroup]="createUserForm" (ngSubmit)="onCreateUser()">
        <div class="form-group">
          <label for="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            placeholder="e.g. Jane Doe"
            [class.invalid]="createUserForm.get('displayName')!.invalid && createUserForm.get('displayName')!.touched">
          @if (createUserForm.get('displayName')!.invalid && createUserForm.get('displayName')!.touched) {
            <span class="validation-error">
              @if (createUserForm.get('displayName')!.hasError('required')) {
                Display name is required.
              } @else if (createUserForm.get('displayName')!.hasError('minlength')) {
                Must be at least 2 characters.
              } @else if (createUserForm.get('displayName')!.hasError('maxlength')) {
                Must be at most 32 characters.
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
            placeholder="e.g. janedoe"
            [class.invalid]="createUserForm.get('username')!.invalid && createUserForm.get('username')!.touched">
          @if (createUserForm.get('username')!.invalid && createUserForm.get('username')!.touched) {
            <span class="validation-error">
              @if (createUserForm.get('username')!.hasError('required')) {
                Username is required.
              } @else if (createUserForm.get('username')!.hasError('minlength')) {
                Must be at least 3 characters.
              } @else if (createUserForm.get('username')!.hasError('maxlength')) {
                Must be at most 20 characters.
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
            placeholder="Min 6 characters"
            [class.invalid]="createUserForm.get('password')!.invalid && createUserForm.get('password')!.touched">
          @if (createUserForm.get('password')!.invalid && createUserForm.get('password')!.touched) {
            <span class="validation-error">
              @if (createUserForm.get('password')!.hasError('required')) {
                Password is required.
              } @else if (createUserForm.get('password')!.hasError('minlength')) {
                Must be at least 6 characters.
              } @else if (createUserForm.get('password')!.hasError('maxlength')) {
                Must be at most 32 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select
            id="role"
            formControlName="role"
            [class.invalid]="createUserForm.get('role')!.invalid && createUserForm.get('role')!.touched">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-create" [disabled]="createUserForm.invalid">Create User</button>
        </div>
      </form>
    </div>

    <div class="user-list-section">
      <h2>All Users <span class="user-count">({{ users.length }})</span></h2>

      @if (users.length === 0) {
        <div class="empty-state">
          <p>No users found.</p>
        </div>
      } @else {
        <div class="user-table-wrapper">
          <table class="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users; track user.username) {
                <tr>
                  <td>
                    <div class="user-info">
                      <app-avatar [role]="user.role" [displayName]="user.displayName" size="sm"></app-avatar>
                      <div class="user-details">
                        <span class="user-display-name">{{ user.displayName }}</span>
                        <span class="user-username">&#64;{{ user.username }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="role-badge" [ngClass]="'role-' + user.role">{{ user.role }}</span>
                  </td>
                  <td>
                    @if (isProtected(user.username)) {
                      <span class="protected-label">Protected</span>
                    } @else {
                      <button class="btn-delete" (click)="onDeleteUser(user.username)" [disabled]="isProtected(user.username)">Delete</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="user-card-list">
          @for (user of users; track user.username) {
            <div class="user-card">
              <div class="user-card-header">
                <div class="user-card-info">
                  <app-avatar [role]="user.role" [displayName]="user.displayName" size="md"></app-avatar>
                  <div class="user-card-details">
                    <span class="user-card-display-name">{{ user.displayName }}</span>
                    <span class="user-card-username">&#64;{{ user.username }}</span>
                  </div>
                </div>
              </div>
              <div class="user-card-body">
                <span class="role-badge" [ngClass]="'role-' + user.role">{{ user.role }}</span>
                @if (isProtected(user.username)) {
                  <span class="protected-label">Protected</span>
                } @else {
                  <button class="btn-delete" (click)="onDeleteUser(user.username)" [disabled]="isProtected(user.username)">Delete</button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  session: Session | null = null;

  formMessage = '';
  formMessageType: 'success' | 'error' = 'success';

  createUserForm = new FormGroup({
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
    role: new FormControl<'admin' | 'user'>('user', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  isProtected(username: string): boolean {
    if (username === 'admin') {
      return true;
    }
    if (this.session && this.session.username === username) {
      return true;
    }
    return false;
  }

  onCreateUser(): void {
    this.formMessage = '';

    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const displayName = this.createUserForm.value.displayName?.trim() ?? '';
    const username = this.createUserForm.value.username?.trim() ?? '';
    const password = this.createUserForm.value.password ?? '';
    const role = this.createUserForm.value.role ?? 'user';

    const existingUser = this.userService.findUser(username);
    if (existingUser) {
      this.formMessage = `Username "${username}" is already taken.`;
      this.formMessageType = 'error';
      return;
    }

    const created = this.userService.createUser({
      displayName,
      username,
      password,
      role
    });

    if (created) {
      this.formMessage = `User "${displayName}" created successfully.`;
      this.formMessageType = 'success';
      this.createUserForm.reset({ displayName: '', username: '', password: '', role: 'user' });
      this.loadUsers();
    } else {
      this.formMessage = 'Failed to create user. Please check the input and try again.';
      this.formMessageType = 'error';
    }
  }

  onDeleteUser(username: string): void {
    if (this.isProtected(username)) {
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete user "@${username}"?`);
    if (!confirmed) {
      return;
    }

    const deleted = this.userService.deleteUser(username);
    if (deleted) {
      this.formMessage = `User "@${username}" has been deleted.`;
      this.formMessageType = 'success';
      this.loadUsers();
    } else {
      this.formMessage = `Failed to delete user "@${username}".`;
      this.formMessageType = 'error';
    }
  }
}