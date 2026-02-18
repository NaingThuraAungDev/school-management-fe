import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AuthService } from '../../core/auth/auth.service';

interface DashboardCard {
    title: string;
    value: number;
    icon: string;
    color: string;
    route: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        PageHeaderComponent
    ],
    template: `
    <div class="dashboard-container">
      <app-page-header 
        title="Dashboard"
        [subtitle]="'Welcome back, ' + (authService.currentUser()?.email || '')"
        icon="dashboard"
      ></app-page-header>

      <div class="stats-grid">
        @for (card of cards; track card.title) {
          <mat-card class="stat-card" (click)="navigate(card.route)">
            <div class="stat-content">
              <div class="stat-info">
                <h3 class="stat-title">{{ card.title }}</h3>
                <p class="stat-value">{{ card.value }}</p>
              </div>
              <div class="stat-icon" [style.background-color]="card.color">
                <mat-icon>{{ card.icon }}</mat-icon>
              </div>
            </div>
          </mat-card>
        }
      </div>

      <div class="quick-actions card">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button mat-raised-button color="primary" (click)="navigate('/students/new')">
            <mat-icon>person_add</mat-icon>
            New Student Admission
          </button>
          <button mat-raised-button color="primary" (click)="navigate('/staff/new')">
            <mat-icon>how_to_reg</mat-icon>
            Add Staff Member
          </button>
          <button mat-raised-button color="primary" (click)="navigate('/timetable/builder')">
            <mat-icon>schedule</mat-icon>
            Manage Timetable
          </button>
          <button mat-raised-button color="primary" (click)="navigate('/exams')">
            <mat-icon>assignment</mat-icon>
            Exam Management
          </button>
        </div>
      </div>

      <div class="recent-activity card">
        <h2>Recent Activity</h2>
        <p class="placeholder-text">No recent activity to display</p>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin: 24px 0;
    }

    .stat-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-title {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 500;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      color: #212121;
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: white;
      }
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      margin-bottom: 24px;

      h2 {
        margin: 0 0 16px;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .quick-actions {
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        button {
          height: 56px;
          font-size: 14px;
        }

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    .recent-activity {
      .placeholder-text {
        padding: 24px;
        text-align: center;
        color: #9e9e9e;
      }
    }
  `]
})
export class DashboardComponent {
    protected authService = inject(AuthService);
    private router = inject(Router);

    protected cards: DashboardCard[] = [
        {
            title: 'Total Students',
            value: 1247,
            icon: 'school',
            color: '#1976d2',
            route: '/students'
        },
        {
            title: 'Total Staff',
            value: 87,
            icon: 'people',
            color: '#388e3c',
            route: '/staff'
        },
        {
            title: 'Active Classes',
            value: 24,
            icon: 'class',
            color: '#f57c00',
            route: '/classes'
        },
        {
            title: 'Upcoming Exams',
            value: 3,
            icon: 'assignment',
            color: '#d32f2f',
            route: '/exams'
        }
    ];

    protected navigate(route: string): void {
        this.router.navigate([route]);
    }
}
