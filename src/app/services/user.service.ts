import { Injectable } from '@angular/core';
import { User } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly HARD_CODED_ADMIN: User = {
    displayName: 'Administrator',
    username: 'admin',
    password: 'admin',
    role: 'admin'
  };

  constructor(private storageService: StorageService) {}

  getUsers(): User[] {
    const storedUsers = this.storageService.get<User[]>('users_v1');
    const users = storedUsers ?? [];
    const hasAdmin = users.some(u => u.username === this.HARD_CODED_ADMIN.username);
    if (!hasAdmin) {
      return [this.HARD_CODED_ADMIN, ...users];
    }
    return users;
  }

  createUser(user: User): boolean {
    if (!user.username || !user.displayName || !user.password || !user.role) {
      return false;
    }

    if (user.username.length < 3 || user.username.length > 20) {
      return false;
    }

    if (user.password.length < 6 || user.password.length > 32) {
      return false;
    }

    if (user.displayName.length < 2 || user.displayName.length > 32) {
      return false;
    }

    if (user.role !== 'admin' && user.role !== 'user') {
      return false;
    }

    if (user.username === this.HARD_CODED_ADMIN.username) {
      return false;
    }

    const users = this.storageService.get<User[]>('users_v1') ?? [];
    const exists = users.some(u => u.username === user.username);
    if (exists) {
      return false;
    }

    users.push({
      displayName: user.displayName,
      username: user.username,
      password: user.password,
      role: user.role
    });

    this.storageService.set<User[]>('users_v1', users);
    return true;
  }

  deleteUser(username: string): boolean {
    if (!username) {
      return false;
    }

    if (username === this.HARD_CODED_ADMIN.username) {
      return false;
    }

    const users = this.storageService.get<User[]>('users_v1') ?? [];
    const index = users.findIndex(u => u.username === username);
    if (index === -1) {
      return false;
    }

    users.splice(index, 1);
    this.storageService.set<User[]>('users_v1', users);
    return true;
  }

  findUser(username: string): User | null {
    if (!username) {
      return null;
    }

    if (username === this.HARD_CODED_ADMIN.username) {
      return { ...this.HARD_CODED_ADMIN };
    }

    const users = this.storageService.get<User[]>('users_v1') ?? [];
    const user = users.find(u => u.username === username);
    return user ? { ...user } : null;
  }
}