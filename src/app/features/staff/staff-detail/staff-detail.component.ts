import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StaffService } from '../../../shared/services/staff.service';
import { Staff, StaffType } from '../../../shared/models/staff.model';

@Component({
    selector: 'app-staff-detail',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MatListModule,
        DatePipe,
        PageHeaderComponent
    ],
    template: `
    <div class="staff-detail-container">
      @if (staff(); as staff) {
        <app-page-header 
          [title]="staff.firstName + ' ' + staff.lastName"
          subtitle="Staff Member"
          icon="person"
        >
          <div actions>
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back
            </button>
            <button mat-button (click)="editStaff()">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button color="warn" (click)="deleteStaff()">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </div>
        </app-page-header>

        <mat-tab-group class="tabs-container">
          <!-- Personal Information Tab -->
          <mat-tab label="Personal Info">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Date of Joining</label>
                      <p>{{ staff.joiningDate | date:'mediumDate' }}</p>
                    </div>
                    <div class="info-item">
                      <label>Staff Type</label>
                      <p>{{ getStaffTypeLabel(staff.staffType) }}</p>
                    </div>
                    <div class="info-item">
                      <label>Qualification</label>
                      <p>{{ staff.qualification || 'N/A' }}</p>
                    </div>
                    <div class="info-item">
                      <label>Email</label>
                      <p>{{ staff.email }}</p>
                    </div>
                    <div class="info-item">
                      <label>Phone</label>
                      <p>{{ staff.phone }}</p>
                    </div>
                    <div class="info-item">
                      <label>Status</label>
                      <mat-chip [class.active]="staff.isActive" [class.inactive]="!staff.isActive">
                        {{ staff.isActive ? 'Active' : 'Inactive' }}
                      </mat-chip>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Roles Tab -->
          <mat-tab label="Roles">
            <div class="tab-content">
              @if (staff.roles && staff.roles.length > 0) {
                <mat-card>
                  <mat-card-content>
                    <mat-list>
                      @for (role of staff.roles; track role.id) {
                        <mat-list-item>
                          <mat-icon matListItemIcon>work</mat-icon>
                          <div matListItemTitle>{{ getRoleTypeLabel(role.role) }}</div>
                          @if (role.classSectionName) {
                            <div matListItemLine>{{ role.classSectionName }}</div>
                          }
                        </mat-list-item>
                        <mat-divider></mat-divider>
                      }
                    </mat-list>
                  </mat-card-content>
                </mat-card>
              } @else {
                <mat-card>
                  <mat-card-content>
                    <p class="empty-message">No roles assigned</p>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else if (loading()) {
        <div class="loading-container">
          <p>Loading staff details...</p>
        </div>
      } @else {
        <div class="error-container">
          <mat-card>
            <mat-card-content>
              <p>Staff member not found</p>
              <button mat-raised-button color="primary" (click)="goBack()">Go Back</button>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
    styles: [`
    .staff-detail-container {
      padding: 24px;
    }

    .tabs-container {
      margin-top: 24px;
    }

    .tab-content {
      padding: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-top: 16px;

      .info-item {
        label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          font-weight: 500;
        }

        p {
          margin: 0;
          font-size: 16px;
        }

        &.full-width {
          grid-column: 1 / -1;
        }
      }
    }

    .empty-message {
      text-align: center;
      color: #666;
      padding: 40px 0;
      margin: 0;
    }

    .loading-container, .error-container {
      padding: 40px;
      text-align: center;
    }

    mat-chip {
      &.active {
        background-color: #4caf50;
        color: white;
      }

      &.inactive {
        background-color: #f44336;
        color: white;
      }
    }
  `]
})
export class StaffDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private staffService = inject(StaffService);

    protected staff = signal<Staff | null>(null);
    protected loading = signal(true);

    constructor() {
        effect(() => {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.loadStaff(id);
            }
        }, { allowSignalWrites: true });
    }

    private loadStaff(id: string): void {
        this.loading.set(true);
        this.staffService.getStaffById(id).subscribe({
            next: (staff) => {
                this.staff.set(staff);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load staff:', err);
                this.loading.set(false);
            }
        });
    }

    protected getStaffTypeLabel(type: StaffType): string {
        return StaffType[type];
    }

    protected getRoleTypeLabel(type: number): string {
        const labels = ['Class Teacher', 'Subject Teacher', 'Department Head', 'Principal', 'Vice Principal', 'Librarian'];
        return labels[type] || 'Unknown';
    }

    protected goBack(): void {
        this.router.navigate(['/staff']);
    }

    protected editStaff(): void {
        const staff = this.staff();
        if (staff) {
            this.router.navigate(['/staff', staff.id, 'edit']);
        }
    }

    protected deleteStaff(): void {
        const staff = this.staff();
        if (staff && confirm(`Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`)) {
            this.staffService.deleteStaff(staff.id).subscribe({
                next: () => {
                    this.router.navigate(['/staff']);
                },
                error: (err) => {
                    console.error('Failed to delete staff:', err);
                    alert('Failed to delete staff member');
                }
            });
        }
    }
}
