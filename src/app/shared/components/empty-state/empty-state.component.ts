import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-empty-state',
    imports: [MatIconModule, MatButtonModule],
    template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon() }}</mat-icon>
      <h3 class="empty-title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty-message">{{ message() }}</p>
      }
      <div class="empty-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: #9e9e9e;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #bdbdbd;
    }

    .empty-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
      color: #616161;
    }

    .empty-message {
      margin: 0 0 24px;
      font-size: 14px;
      max-width: 400px;
    }

    .empty-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class EmptyStateComponent {
    icon = input<string>('inbox');
    title = input.required<string>();
    message = input<string>();
}
