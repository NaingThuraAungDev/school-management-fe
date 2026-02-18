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
import { StudentService } from '../services/student.service';
import { Student, Gender, GuardianRelationship } from '../models/student.model';

@Component({
    selector: 'app-student-detail',
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
    <div class="student-detail-container">
      @if (student(); as student) {
        <app-page-header 
          [title]="student.firstName + ' ' + student.lastName"
          [subtitle]="student.admissionId"
          icon="person"
        >
          <div actions>
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back
            </button>
            <button mat-button (click)="editStudent()">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button color="warn" (click)="deleteStudent()">
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
                      <label>Roll Number</label>
                      <p>{{ student.rollNumber }}</p>
                    </div>
                    <div class="info-item">
                      <label>Admission Date</label>
                      <p>{{ student.admissionDate | date:'mediumDate' }}</p>
                    </div>
                    <div class="info-item">
                      <label>Date of Birth</label>
                      <p>{{ student.dateOfBirth | date:'mediumDate' }}</p>
                    </div>
                    <div class="info-item">
                      <label>Gender</label>
                      <p>{{ getGenderLabel(student.gender) }}</p>
                    </div>
                    <div class="info-item">
                      <label>Email</label>
                      <p>{{ student.email }}</p>
                    </div>
                    <div class="info-item">
                      <label>Phone</label>
                      <p>{{ student.phone }}</p>
                    </div>
                    <div class="info-item full-width">
                      <label>Address</label>
                      <p>{{ student.address }}</p>
                    </div>
                    <div class="info-item">
                      <label>Class Section</label>
                      <p>{{ student.classSectionName }}</p>
                    </div>
                    <div class="info-item">
                      <label>Status</label>
                      <mat-chip [class.active]="student.isActive" [class.inactive]="!student.isActive">
                        {{ student.isActive ? 'Active' : 'Inactive' }}
                      </mat-chip>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Guardian Information Tab -->
          <mat-tab label="Guardians">
            <div class="tab-content">
              @if (student.guardians && student.guardians.length > 0) {
                @for (guardian of student.guardians; track guardian.id) {
                  <mat-card class="guardian-card">
                    <mat-card-content>
                      <div class="guardian-header">
                        <h3>{{ guardian.name }}</h3>
                        @if (guardian.isPrimaryContact) {
                          <mat-chip color="primary">Primary Contact</mat-chip>
                        }
                      </div>
                      <mat-divider></mat-divider>
                      <div class="info-grid">
                        <div class="info-item">
                          <label>Relationship</label>
                          <p>{{ getRelationshipLabel(guardian.relationship) }}</p>
                        </div>
                        <div class="info-item">
                          <label>Mobile</label>
                          <p>{{ guardian.mobile }}</p>
                        </div>
                        <div class="info-item">
                          <label>Email</label>
                          <p>{{ guardian.email || 'N/A' }}</p>
                        </div>
                        <div class="info-item">
                          <label>Occupation</label>
                          <p>{{ guardian.occupation || 'N/A' }}</p>
                        </div>
                        @if (guardian.address) {
                          <div class="info-item full-width">
                            <label>Address</label>
                            <p>{{ guardian.address }}</p>
                          </div>
                        }
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              } @else {
                <mat-card>
                  <mat-card-content>
                    <p class="empty-message">No guardian information available</p>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- Documents Tab -->
          <mat-tab label="Documents">
            <div class="tab-content">
              @if (student.documents && student.documents.length > 0) {
                <mat-card>
                  <mat-card-content>
                    <mat-list>
                      @for (doc of student.documents; track doc.id) {
                        <mat-list-item>
                          <mat-icon matListItemIcon>description</mat-icon>
                          <div matListItemTitle>{{ doc.fileName }}</div>
                          <div matListItemLine>{{ getDocumentTypeLabel(doc.documentType) }}</div>
                          <button mat-icon-button matListItemMeta>
                            <mat-icon>download</mat-icon>
                          </button>
                        </mat-list-item>
                        <mat-divider></mat-divider>
                      }
                    </mat-list>
                  </mat-card-content>
                </mat-card>
              } @else {
                <mat-card>
                  <mat-card-content>
                    <p class="empty-message">No documents uploaded</p>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else if (loading()) {
        <div class="loading-container">
          <p>Loading student details...</p>
        </div>
      } @else {
        <div class="error-container">
          <mat-card>
            <mat-card-content>
              <p>Student not found</p>
              <button mat-raised-button color="primary" (click)="goBack()">Go Back</button>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
    styles: [`
    .student-detail-container {
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

    .guardian-card {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .guardian-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
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
export class StudentDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private studentService = inject(StudentService);

    protected student = signal<Student | null>(null);
    protected loading = signal(true);

    constructor() {
        effect(() => {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.loadStudent(id);
            }
        }, { allowSignalWrites: true });
    }

    private loadStudent(id: string): void {
        this.loading.set(true);
        this.studentService.getStudentById(id).subscribe({
            next: (student) => {
                this.student.set(student);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load student:', err);
                this.loading.set(false);
            }
        });
    }

    protected getGenderLabel(gender: Gender): string {
        return Gender[gender];
    }

    protected getRelationshipLabel(relationship: GuardianRelationship): string {
        return GuardianRelationship[relationship];
    }

    protected getDocumentTypeLabel(type: number): string {
        const labels = ['Birth Certificate', 'Previous Records', 'Transfer Certificate', 'Photo', 'Other'];
        return labels[type] || 'Unknown';
    }

    protected goBack(): void {
        this.router.navigate(['/students']);
    }

    protected editStudent(): void {
        const student = this.student();
        if (student) {
            this.router.navigate(['/students', student.id, 'edit']);
        }
    }

    protected deleteStudent(): void {
        const student = this.student();
        if (student && confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
            this.studentService.deleteStudent(student.id).subscribe({
                next: () => {
                    this.router.navigate(['/students']);
                },
                error: (err) => {
                    console.error('Failed to delete student:', err);
                    alert('Failed to delete student');
                }
            });
        }
    }
}
