import { Component, output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/auth.service';

interface NavItem {
    label: string;
    icon: string;
    route: string;
    roles?: string[];
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

@Component({
    selector: 'app-sidebar',
    imports: [
        MatListModule,
        MatIconModule,
        MatDividerModule,
        RouterLink,
        RouterLinkActive
    ],
    template: `
    <div class="sidebar-container">
      <div class="sidebar-header">
        <h2 class="app-title">School Management</h2>
        <p class="user-info">
          {{ authService.currentUser()?.email }}
          <span class="role-badge">{{ authService.currentUser()?.userType }}</span>
        </p>
      </div>

      <mat-divider></mat-divider>

      <nav class="sidebar-nav">
        @for (group of navGroups; track group.label) {
          <div class="nav-group">
            <h3 class="nav-group-label">{{ group.label }}</h3>
            <mat-nav-list>
              @for (item of group.items; track item.route) {
                @if (canShowItem(item)) {
                  <a
                    mat-list-item
                    [routerLink]="item.route"
                    routerLinkActive="active"
                    (click)="onNavItemClick()"
                  >
                    <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                    <span matListItemTitle>{{ item.label }}</span>
                  </a>
                }
              }
            </mat-nav-list>
          </div>
        }
      </nav>
    </div>
  `,
    styles: [`
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }

    .sidebar-header {
      padding: 24px 16px;
    }

    .app-title {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 600;
      color: #1976d2;
    }

    .user-info {
      margin: 0;
      font-size: 14px;
      color: #616161;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .role-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      width: fit-content;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .nav-group {
      margin-bottom: 16px;
    }

    .nav-group-label {
      padding: 8px 16px;
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    mat-nav-list {
      padding: 0;
    }

    a[mat-list-item] {
      color: #424242;
      height: 48px;

      &:hover {
        background: #f5f5f5;
      }

      &.active {
        background: #e3f2fd;
        color: #1976d2;

        mat-icon {
          color: #1976d2;
        }
      }
    }

    mat-icon {
      color: #757575;
      margin-right: 16px;
    }
  `]
})
export class SidebarComponent {
    protected authService = inject(AuthService);
    private router = inject(Router);

    closeSidebar = output<void>();

    protected navGroups: NavGroup[] = [
        {
            label: 'Dashboard',
            items: [
                { label: 'Overview', icon: 'dashboard', route: '/dashboard' }
            ]
        },
        {
            label: 'User Management',
            items: [
                {
                    label: 'Students',
                    icon: 'school',
                    route: '/students',
                    roles: ['Admin', 'Teacher']
                },
                {
                    label: 'Staff',
                    icon: 'people',
                    route: '/staff',
                    roles: ['Admin', 'SuperAdmin']
                }
            ]
        },
        {
            label: 'Academic',
            items: [
                {
                    label: 'Classes',
                    icon: 'class',
                    route: '/classes',
                    roles: ['Admin', 'Teacher']
                },
                {
                    label: 'Subjects',
                    icon: 'menu_book',
                    route: '/classes/subjects',
                    roles: ['Admin', 'Teacher']
                },
                {
                    label: 'Timetable',
                    icon: 'schedule',
                    route: '/timetable',
                    roles: ['Admin', 'Teacher']
                },
                {
                    label: 'Exams',
                    icon: 'assignment',
                    route: '/exams',
                    roles: ['Admin', 'Teacher']
                },
                {
                    label: 'Promotions',
                    icon: 'trending_up',
                    route: '/promotions',
                    roles: ['Admin', 'SuperAdmin']
                }
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'Profile',
                    icon: 'person',
                    route: '/profile'
                },
                {
                    label: 'Settings',
                    icon: 'settings',
                    route: '/settings',
                    roles: ['Admin', 'SuperAdmin']
                }
            ]
        }
    ];

    protected canShowItem(item: NavItem): boolean {
        if (!item.roles || item.roles.length === 0) {
            return true;
        }
        return this.authService.hasAnyRole(item.roles);
    }

    protected onNavItemClick(): void {
        this.closeSidebar.emit();
    }
}
