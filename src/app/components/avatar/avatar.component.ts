import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import type { Role } from '@app/models';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="avatar-container"
         [ngClass]="[sizeClass, roleClass]"
         [attr.title]="displayName || role">
      <span class="avatar-emoji">{{ roleEmoji }}</span>
    </div>
    @if (displayName && showName) {
      <span class="avatar-display-name" [ngClass]="nameClass">{{ displayName }}</span>
    }
  `,
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
  @Input({ required: true }) role!: Role;
  @Input() displayName?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showName = false;

  get roleEmoji(): string {
    return this.role === 'admin' ? '👑' : '📖';
  }

  get sizeClass(): string {
    return `avatar-${this.size}`;
  }

  get roleClass(): string {
    return `avatar-${this.role}`;
  }

  get nameClass(): string {
    return `name-${this.size}`;
  }
}