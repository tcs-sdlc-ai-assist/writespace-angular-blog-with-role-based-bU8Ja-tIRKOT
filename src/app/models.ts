export type Role = 'admin' | 'user';

export interface User {
  displayName: string;
  username: string;
  password: string;
  role: Role;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Session {
  username: string;
  role: Role;
}

export interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
}