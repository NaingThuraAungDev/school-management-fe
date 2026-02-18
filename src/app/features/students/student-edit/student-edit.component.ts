import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StudentService } from '../services/student.service';
import { ClassService } from '../../../shared/services/class.service';
import { Student, Gender } from '../models/student.model';
import { ClassSection } from '../../../shared/models/class.model';

@Component({
    selector: 'app-student-edit',
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        PageHeaderComponent
    ],
    template: `
    <div class="student-edit-container">
      @if (student(); as student) {
        <app-page-header 
          title="Edit Student"
          [subtitle]="student.firstName + ' ' + student.lastName"
          icon="edit"
        >
          <div actions>
            <button mat-button (click)="cancel()">Cancel</button>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="save()"
              [disabled]="!editForm.valid || submitting()"
            >
              @if (submitting()) {
                <mat-spinner diameter="20" style="display: inline-block; margin-right: 8px;"></mat-spinner>
              }
              Save Changes
            </button>
          </div>
        </app-page-header>
        
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="editForm" class="edit-form">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Date of Birth</mat-label>
                  <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth" required>
                  <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
                  <mat-datepicker #dobPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Gender</mat-label>
                  <mat-select formControlName="gender" required>
                    <mat-option [value]="Gender.Male">Male</mat-option>
                    <mat-option [value]="Gender.Female">Female</mat-option>
                    <mat-option [value]="Gender.Other">Other</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Phone</mat-label>
                  <input matInput formControlName="phone" required>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Address</mat-label>
                  <textarea matInput formControlName="address" rows="3" required></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Class Section</mat-label>
                  <mat-select formControlName="classSectionId" required>
                    @for (section of classSections(); track section.id) {
                      <mat-option [value]="section.id">
                        {{ section.className }} - {{ section.sectionName }}
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Status</mat-label>
                  <mat-select formControlName="isActive" required>
                    <mat-option [value]="true">Active</mat-option>
                    <mat-option [value]="false">Inactive</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      } @else if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading student details...</p>
        </div>
      }
    </div>
  `,
    styles: [`
    .student-edit-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .form-card {
      margin-top: 24px;
    }

    .edit-form {
      padding: 16px 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;

      .full-width {
        grid-column: 1 / -1;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 0;
      gap: 16px;
    }
  `]
})
export class StudentEditComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private studentService = inject(StudentService);
    private classService = inject(ClassService);
    private snackBar = inject(MatSnackBar);

    protected readonly Gender = Gender;

    protected student = signal<Student | null>(null);
    protected loading = signal(true);
    protected submitting = signal(false);
    protected classSections = signal<ClassSection[]>([]);

    protected editForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: [Gender.Male, Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        classSectionId: ['', Validators.required],
        isActive: [true, Validators.required]
    });

    constructor() {
        // Load class sections
        this.classService.getClassSections().subscribe({
            next: (sections) => this.classSections.set(sections),
            error: (err) => console.error('Failed to load class sections:', err)
        });

        // Load student data
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
                this.editForm.patchValue({
                    firstName: student.firstName,
                    lastName: student.lastName,
                    dateOfBirth: new Date(student.dateOfBirth),
                    gender: student.gender,
                    email: student.email,
                    phone: student.phone,
                    address: student.address,
                    classSectionId: student.classSectionId,
                    isActive: student.isActive
                });
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load student:', err);
                this.snackBar.open('Failed to load student', 'Close', { duration: 3000 });
                this.loading.set(false);
            }
        });
    }

    protected save(): void {
        if (this.editForm.valid && this.student()) {
            this.submitting.set(true);

            // Format date to ISO string
            const dateOfBirth = new Date(this.editForm.value.dateOfBirth);
            const formattedDate = dateOfBirth.toISOString().split('T')[0];

            const updateRequest = {
                id: this.student()!.id,
                firstName: this.editForm.value.firstName,
                lastName: this.editForm.value.lastName,
                dateOfBirth: formattedDate,
                gender: this.editForm.value.gender,
                email: this.editForm.value.email,
                phone: this.editForm.value.phone,
                address: this.editForm.value.address,
                classSectionId: this.editForm.value.classSectionId,
                isActive: this.editForm.value.isActive
            };

            this.studentService.updateStudent(this.student()!.id, updateRequest).subscribe({
                next: () => {
                    this.snackBar.open('Student updated successfully!', 'Close', { duration: 3000 });
                    this.router.navigate(['/students', this.student()!.id]);
                },
                error: (err) => {
                    console.error('Failed to update student:', err);
                    this.snackBar.open(err.error?.message || 'Failed to update student', 'Close', { duration: 5000 });
                    this.submitting.set(false);
                }
            });
        }
    }

    protected cancel(): void {
        const student = this.student();
        if (student) {
            this.router.navigate(['/students', student.id]);
        } else {
            this.router.navigate(['/students']);
        }
    }
}
