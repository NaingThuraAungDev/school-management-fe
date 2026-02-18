import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-page-header',
    imports: [MatIconModule],
    template: `
    <div class="page-header">
      <div class="header-content">
        @if (icon()) {
          <mat-icon class="header-icon">{{ icon() }}</mat-icon>
        }
        <div class="header-text">
          <h1 class="header-title">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="header-subtitle">{{ subtitle() }}</p>
          }
        </div>
      </div>
      <div class="header-actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .header-text {
      flex: 1;
      min-width: 0;
    }

    .header-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #212121;
    }

    .header-subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: #757575;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    @media (max-width: 600px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class PageHeaderComponent {
    title = input.required<string>();
    subtitle = input<string>();
    icon = input<string>();
}
