import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import type { DashboardStats, Post } from '@app/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private storageService: StorageService,
    private userService: UserService
  ) {}

  getStats(): DashboardStats {
    const users = this.userService.getUsers();
    const posts = this.storageService.get<Post[]>('posts') ?? [];

    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalRegularUsers = users.filter(u => u.role === 'user').length;
    const totalPosts = posts.length;

    return {
      totalPosts,
      totalUsers,
      totalAdmins,
      totalRegularUsers
    };
  }

  getRecentPosts(limit: number = 5): Post[] {
    const posts = this.storageService.get<Post[]>('posts') ?? [];

    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}