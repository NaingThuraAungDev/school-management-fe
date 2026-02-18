import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { StudentService } from '../services/student.service';
import { ClassService } from '../../../shared/services/class.service';
import { Gender, GuardianRelationship, DocumentType, LinkGuardianRequest } from '../models/student.model';
import { ClassSection } from '../../../shared/models/class.model';

@Component({
    selector: 'app-student-admission',
    imports: [
        MatStepperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        PageHeaderComponent,
        FileUploadComponent
    ],
    template: `
    <div class="admission-container">
      <app-page-header 
        title="Student Admission"
        subtitle="Complete the registration process"
        icon="person_add"
      >
        <div actions>
          <button mat-button (click)="cancel()">Cancel</button>
        </div>
      </app-page-header>

      <div class="stepper-container card">
        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Personal Details -->
          <mat-step [stepControl]="personalForm">
            <form [formGroup]="personalForm">
              <ng-template matStepLabel>Personal Details</ng-template>
              
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
              </div>

              <div class="step-actions">
                <button mat-raised-button matStepperNext color="primary">Next</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Guardian Details -->
          <mat-step [stepControl]="guardianForm">
            <form [formGroup]="guardianForm">
              <ng-template matStepLabel>Guardian Details</ng-template>
              
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Guardian Name</mat-label>
                  <input matInput formControlName="name" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Relationship</mat-label>
                  <mat-select formControlName="relationship" required>
                    <mat-option [value]="GuardianRelationship.Father">Father</mat-option>
                    <mat-option [value]="GuardianRelationship.Mother">Mother</mat-option>
                    <mat-option [value]="GuardianRelationship.Guardian">Guardian</mat-option>
                    <mat-option [value]="GuardianRelationship.Other">Other</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Mobile</mat-label>
                  <input matInput formControlName="mobile" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email">
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-raised-button matStepperNext color="primary">Next</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Class Assignment -->
          <mat-step [stepControl]="classForm">
            <form [formGroup]="classForm">
              <ng-template matStepLabel>Class Assignment</ng-template>
              
              <div class="form-grid">
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
                  <mat-label>Academic Year</mat-label>
                  <input matInput formControlName="academicYearId" placeholder="Enter academic year ID" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Roll Number</mat-label>
                  <input matInput placeholder="Will be auto-generated" disabled>
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-raised-button matStepperNext color="primary">Next</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 4: Documents -->
          <mat-step>
            <ng-template matStepLabel>Documents</ng-template>
            
            <div class="documents-section">
              <h3>Upload Required Documents</h3>
              
              <app-file-upload
                accept="image/*,.pdf"
                hint="Upload birth certificate, photos, or other documents"
                [multiple]="true"
                (filesChange)="onFilesChange($event)"
              ></app-file-upload>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Back</button>
              <button 
                mat-raised-button 
                color="primary" 
                (click)="submit()"
                [disabled]="submitting()"
              >
                @if (submitting()) {
                  <mat-spinner diameter="20" style="display: inline-block; margin-right: 8px;"></mat-spinner>
                }
                Submit Admission
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
    styles: [`
    .admission-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .stepper-container {
      padding: 24px;
      margin-top: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;

      .full-width {
        grid-column: 1 / -1;
      }
    }

    .step-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .documents-section {
      h3 {
        margin: 0 0 16px;
      }
    }
  `]
})
export class StudentAdmissionComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private studentService = inject(StudentService);
    private classService = inject(ClassService);
    private snackBar = inject(MatSnackBar);

    // Enum references for template
    protected readonly Gender = Gender;
    protected readonly GuardianRelationship = GuardianRelationship;

    protected personalForm: FormGroup;
    protected guardianForm: FormGroup;
    protected classForm: FormGroup;
    protected uploadedFiles: File[] = [];
    protected classSections = signal<ClassSection[]>([]);
    protected submitting = signal(false);

    constructor() {
        this.personalForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            gender: [Gender.Male, Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            address: ['', Validators.required]
        });

        this.guardianForm = this.fb.group({
            name: ['', Validators.required],
            relationship: [GuardianRelationship.Father, Validators.required],
            mobile: ['', Validators.required],
            email: ['', Validators.email]
        });

        this.classForm = this.fb.group({
            classSectionId: ['', Validators.required],
            academicYearId: ['', Validators.required]
        });

        // Load class sections
        this.classService.getClassSections().subscribe({
            next: (sections) => this.classSections.set(sections),
            error: (err) => {
                console.error('Failed to load class sections:', err);
                this.snackBar.open('Failed to load class sections', 'Close', { duration: 3000 });
            }
        });
    }

    protected onFilesChange(files: File[]): void {
        this.uploadedFiles = files;
    }

    protected submit(): void {
        if (this.personalForm.valid && this.guardianForm.valid && this.classForm.valid) {
            this.submitting.set(true);

            // Format date to ISO string
            const dateOfBirth = new Date(this.personalForm.value.dateOfBirth);
            const formattedDate = dateOfBirth.toISOString().split('T')[0];

            // Create admission request
            const admissionRequest = {
                firstName: this.personalForm.value.firstName,
                lastName: this.personalForm.value.lastName,
                dateOfBirth: formattedDate,
                gender: this.personalForm.value.gender,
                email: this.personalForm.value.email,
                password: 'Student@123', // Default password
                phone: this.personalForm.value.phone,
                address: this.personalForm.value.address,
                classSectionId: this.classForm.value.classSectionId,
                academicYearId: this.classForm.value.academicYearId
            };

            this.studentService.admitStudent(admissionRequest).subscribe({
                next: (student) => {
                    // Link guardian
                    const guardianRequest: LinkGuardianRequest = {
                        studentId: student.id,
                        name: this.guardianForm.value.name,
                        mobile: this.guardianForm.value.mobile,
                        email: this.guardianForm.value.email || '',
                        relationship: this.guardianForm.value.relationship,
                        isPrimaryContact: true
                    };

                    this.studentService.linkGuardian(guardianRequest).subscribe({
                        next: () => {
                            // Upload documents if any
                            if (this.uploadedFiles.length > 0) {
                                this.uploadDocuments(student.id);
                            } else {
                                this.onSuccess();
                            }
                        },
                        error: (err) => {
                            console.error('Failed to link guardian:', err);
                            this.snackBar.open('Student admitted but failed to link guardian', 'Close', { duration: 5000 });
                            this.submitting.set(false);
                        }
                    });
                },
                error: (err) => {
                    console.error('Failed to admit student:', err);
                    this.snackBar.open(err.error?.message || 'Failed to admit student', 'Close', { duration: 5000 });
                    this.submitting.set(false);
                }
            });
        }
    }

    private uploadDocuments(studentId: string): void {
        let uploadedCount = 0;
        const totalFiles = this.uploadedFiles.length;

        this.uploadedFiles.forEach((file) => {
            this.studentService.uploadDocument(studentId, DocumentType.Photo, file).subscribe({
                next: () => {
                    uploadedCount++;
                    if (uploadedCount === totalFiles) {
                        this.onSuccess();
                    }
                },
                error: (err) => {
                    console.error('Failed to upload document:', err);
                    uploadedCount++;
                    if (uploadedCount === totalFiles) {
                        this.onSuccess();
                    }
                }
            });
        });
    }

    private onSuccess(): void {
        this.snackBar.open('Student admitted successfully!', 'Close', { duration: 3000 });
        this.submitting.set(false);
        this.router.navigate(['/students']);
    }

    protected cancel(): void {
        this.router.navigate(['/students']);
    }
}
