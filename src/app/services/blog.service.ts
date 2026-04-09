import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { SessionService } from './session.service';
import type { Post } from '@app/models';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly POSTS_KEY = 'posts';

  constructor(
    private storageService: StorageService,
    private sessionService: SessionService
  ) {}

  getPosts(): Post[] {
    return this.storageService.get<Post[]>(this.POSTS_KEY) ?? [];
  }

  createPost(title: string, content: string): Post | null {
    const session = this.sessionService.getSession();
    if (!session) {
      return null;
    }

    if (!title || title.trim().length < 3 || title.trim().length > 100) {
      return null;
    }

    if (!content || content.trim().length < 1 || content.trim().length > 5000) {
      return null;
    }

    const post: Post = {
      id: this.generateId(),
      title: title.trim(),
      content: content.trim(),
      author: session.username,
      createdAt: new Date().toISOString()
    };

    const posts = this.getPosts();
    posts.push(post);
    this.storageService.set<Post[]>(this.POSTS_KEY, posts);

    return post;
  }

  updatePost(post: Post): boolean {
    if (!post || !post.id) {
      return false;
    }

    const session = this.sessionService.getSession();
    if (!session) {
      return false;
    }

    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index === -1) {
      return false;
    }

    const existingPost = posts[index];

    if (session.role !== 'admin' && existingPost.author !== session.username) {
      return false;
    }

    if (!post.title || post.title.trim().length < 3 || post.title.trim().length > 100) {
      return false;
    }

    if (!post.content || post.content.trim().length < 1 || post.content.trim().length > 5000) {
      return false;
    }

    posts[index] = {
      ...existingPost,
      title: post.title.trim(),
      content: post.content.trim()
    };

    this.storageService.set<Post[]>(this.POSTS_KEY, posts);
    return true;
  }

  deletePost(postId: string): boolean {
    if (!postId) {
      return false;
    }

    const session = this.sessionService.getSession();
    if (!session) {
      return false;
    }

    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) {
      return false;
    }

    const existingPost = posts[index];

    if (session.role !== 'admin' && existingPost.author !== session.username) {
      return false;
    }

    posts.splice(index, 1);
    this.storageService.set<Post[]>(this.POSTS_KEY, posts);
    return true;
  }

  findPost(postId: string): Post | null {
    if (!postId) {
      return null;
    }

    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    return post ? { ...post } : null;
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomPart}`;
  }
}