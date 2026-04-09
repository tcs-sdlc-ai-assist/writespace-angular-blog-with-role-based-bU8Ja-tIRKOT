import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import type { Session, User } from '@app/models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly SESSION_KEY = 'session_v1';

  private readonly HARD_CODED_ADMIN: User = {
    displayName: 'Administrator',
    username: 'admin',
    password: 'admin',
    role: 'admin'
  };

  constructor(
    private storageService: StorageService,
    private userService: UserService
  ) {}

  login(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }

    if (username === this.HARD_CODED_ADMIN.username && password === this.HARD_CODED_ADMIN.password) {
      const session: Session = {
        username: this.HARD_CODED_ADMIN.username,
        role: this.HARD_CODED_ADMIN.role
      };
      this.storageService.set<Session>(this.SESSION_KEY, session);
      return true;
    }

    const users = this.storageService.get<User[]>('users') ?? [];
    const usersV1 = this.storageService.get<User[]>('users_v1') ?? [];
    const allUsers = [...users, ...usersV1];

    const user = allUsers.find(u => u.username === username && u.password === password);
    if (!user) {
      return false;
    }

    const session: Session = {
      username: user.username,
      role: user.role
    };
    this.storageService.set<Session>(this.SESSION_KEY, session);
    return true;
  }

  logout(): void {
    this.storageService.remove(this.SESSION_KEY);
  }

  register(displayName: string, username: string, password: string): boolean {
    if (!displayName || !username || !password) {
      return false;
    }

    if (username.length < 3 || username.length > 20) {
      return false;
    }

    if (password.length < 6 || password.length > 32) {
      return false;
    }

    if (displayName.length < 2 || displayName.length > 32) {
      return false;
    }

    if (username === this.HARD_CODED_ADMIN.username) {
      return false;
    }

    const newUser: User = {
      displayName,
      username,
      password,
      role: 'user'
    };

    const created = this.userService.createUser(newUser);
    if (!created) {
      return false;
    }

    const session: Session = {
      username: newUser.username,
      role: newUser.role
    };
    this.storageService.set<Session>(this.SESSION_KEY, session);
    return true;
  }

  getSession(): Session | null {
    return this.storageService.get<Session>(this.SESSION_KEY);
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  isAdmin(): boolean {
    const session = this.getSession();
    return session !== null && session.role === 'admin';
  }
}