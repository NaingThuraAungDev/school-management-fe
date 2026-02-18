import { Component, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatBadgeModule,
        MatTooltipModule,
        MatDividerModule
    ],
    template: `
    <mat-toolbar class="header-toolbar">
      <button 
        mat-icon-button 
        (click)="onToggleSidebar()"
        matTooltip="Toggle menu"
      >
        <mat-icon>menu</mat-icon>
      </button>

      <span class="toolbar-spacer"></span>

      <!-- Notifications -->
      <button 
        mat-icon-button 
        [matBadge]="notificationCount"
        [matBadgeHidden]="notificationCount === 0"
        matBadgeColor="warn"
        matTooltip="Notifications"
        [matMenuTriggerFor]="notificationMenu"
      >
        <mat-icon>notifications</mat-icon>
      </button>

      <!-- User Menu -->
      <button 
        mat-icon-button 
        [matMenuTriggerFor]="userMenu"
        matTooltip="Account"
      >
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>

<!-- Notifications Menu -->
    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="menu-header">
        <h3>Notifications</h3>
      </div>
      <mat-divider></mat-divider>
      
      @if (notificationCount === 0) {
        <div class="empty-notifications">
          <mat-icon>notifications_none</mat-icon>
          <p>No new notifications</p>
        </div>
      } @else {
        <button mat-menu-item class="notification-item">
          <mat-icon>info</mat-icon>
          <div class="notification-content">
            <p class="notification-title">Sample Notification</p>
            <p class="notification-time">2 hours ago</p>
          </div>
        </button>
      }
    </mat-menu>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu">
      <div class="user-menu-header">
        <div class="user-avatar">
          <mat-icon>account_circle</mat-icon>
        </div>
        <div class="user-details">
          <p class="user-name">{{ authService.currentUser()?.email }}</p>
          <p class="user-email">{{ authService.currentUser()?.userType }}</p>
        </div>
      </div>
      <mat-divider></mat-divider>
      
      <button mat-menu-item (click)="navigateToProfile()">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      
      <button mat-menu-item (click)="navigateToSettings()">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      
      <mat-divider></mat-divider>
      
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
    styles: [`
    .header-toolbar {
      background: white;
      color: #424242;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      height: 64px;
      padding: 0 16px;
    }

    .toolbar-spacer {
      flex: 1;
    }

    // Notification Menu Styles
    .notification-menu {
      max-width: 360px;
    }

    .menu-header {
      padding: 16px;
      
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .empty-notifications {
      padding: 32px;
      text-align: center;
      color: #9e9e9e;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .notification-item {
      height: auto;
      padding: 12px 16px;
      line-height: normal;

      mat-icon {
        margin-right: 12px;
      }
    }

    .notification-content {
      .notification-title {
        margin: 0 0 4px;
        font-size: 14px;
        color: #424242;
      }

      .notification-time {
        margin: 0;
        font-size: 12px;
        color: #9e9e9e;
      }
    }

    // User Menu Styles
    .user-menu-header {
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 12px;
    }

    .user-avatar {
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #757575;
      }
    }

    .user-details {
      flex: 1;
      min-width: 0;

      .user-name {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
      }

      .user-email {
        margin: 0;
        font-size: 12px;
        color: #757575;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  `]
})
export class HeaderComponent {
    protected authService = inject(AuthService);
    private router = inject(Router);

    toggleSidebar = output<void>();

    protected notificationCount = 0;

    protected onToggleSidebar(): void {
        this.toggleSidebar.emit();
    }

    protected navigateToProfile(): void {
        this.router.navigate(['/profile']);
    }

    protected navigateToSettings(): void {
        this.router.navigate(['/settings']);
    }

    protected async logout(): Promise<void> {
        await this.authService.logout();
    }
}
