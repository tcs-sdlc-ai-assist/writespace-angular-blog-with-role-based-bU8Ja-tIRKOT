import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { BlogService } from '@app/services/blog.service';
import { SessionService } from '@app/services/session.service';
import type { Post, Session } from '@app/models';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="editor-card">
      <h2>{{ isEditMode ? 'Edit Post' : 'Create New Post' }}</h2>

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            class="title-input"
            placeholder="Enter your post title"
            [class.input-error]="postForm.get('title')?.invalid && postForm.get('title')?.touched"
          />
          @if (postForm.get('title')?.invalid && postForm.get('title')?.touched) {
            <span class="error-message">
              @if (postForm.get('title')?.hasError('required')) {
                Title is required.
              } @else if (postForm.get('title')?.hasError('minlength')) {
                Title must be at least 3 characters.
              } @else if (postForm.get('title')?.hasError('maxlength')) {
                Title must be at most 100 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea
            id="content"
            formControlName="content"
            class="content-textarea"
            placeholder="Write your post content here..."
            [class.input-error]="postForm.get('content')?.invalid && postForm.get('content')?.touched"
          ></textarea>
          @if (postForm.get('content')?.invalid && postForm.get('content')?.touched) {
            <span class="error-message">
              @if (postForm.get('content')?.hasError('required')) {
                Content is required.
              } @else if (postForm.get('content')?.hasError('maxlength')) {
                Content must be at most 5000 characters.
              }
            </span>
          }
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-cancel" (click)="onCancel()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="postForm.invalid">
            {{ isEditMode ? 'Update Post' : 'Publish Post' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./blog-editor.component.css']
})
export class BlogEditorComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  postId: string | null = null;
  existingPost: Post | null = null;
  errorMessage = '';

  constructor(
    private blogService: BlogService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.maxLength(5000)
      ])
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.isEditMode = true;
      this.loadPost(this.postId);
    }
  }

  private loadPost(id: string): void {
    const post = this.blogService.findPost(id);

    if (!post) {
      this.errorMessage = 'Post not found.';
      return;
    }

    const session: Session | null = this.sessionService.getSession();

    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    if (session.role !== 'admin' && post.author !== session.username) {
      this.errorMessage = 'You do not have permission to edit this post.';
      return;
    }

    this.existingPost = post;
    this.postForm.patchValue({
      title: post.title,
      content: post.content
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const title = this.postForm.get('title')?.value as string;
    const content = this.postForm.get('content')?.value as string;

    this.errorMessage = '';

    if (this.isEditMode && this.existingPost) {
      const updatedPost: Post = {
        ...this.existingPost,
        title,
        content
      };

      const success = this.blogService.updatePost(updatedPost);

      if (success) {
        this.router.navigate(['/blog', this.existingPost.id]);
      } else {
        this.errorMessage = 'Failed to update post. Please check your permissions and try again.';
      }
    } else {
      const newPost = this.blogService.createPost(title, content);

      if (newPost) {
        this.router.navigate(['/blog', newPost.id]);
      } else {
        this.errorMessage = 'Failed to create post. Please ensure you are logged in and try again.';
      }
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.existingPost) {
      this.router.navigate(['/blog', this.existingPost.id]);
    } else {
      this.router.navigate(['/blog']);
    }
  }
}