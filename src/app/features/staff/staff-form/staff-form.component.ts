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
import { StaffService } from '../../../shared/services/staff.service';
import { Staff, StaffType } from '../../../shared/models/staff.model';

@Component({
    selector: 'app-staff-form',
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
    <div class="staff-form-container">
      <app-page-header 
        [title]="isEditMode ? 'Edit Staff' : 'Add Staff'"
        [subtitle]="isEditMode ? (staff()?.firstName + ' ' + staff()?.lastName) : 'Create new staff member'"
        icon="person_add"
      >
        <div actions>
          <button mat-button (click)="cancel()">Cancel</button>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="save()"
            [disabled]="!staffForm.valid || submitting()"
          >
            @if (submitting()) {
              <mat-spinner diameter="20" style="display: inline-block; margin-right: 8px;"></mat-spinner>
            }
            {{ isEditMode ? 'Save Changes' : 'Create Staff' }}
          </button>
        </div>
      </app-page-header>
      
      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="staffForm" class="staff-form">
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
                <mat-label>Date of Joining</mat-label>
                <input matInput [matDatepicker]="dojPicker" formControlName="joiningDate" required>
                <mat-datepicker-toggle matSuffix [for]="dojPicker"></mat-datepicker-toggle>
                <mat-datepicker #dojPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Staff Type</mat-label>
                <mat-select formControlName="staffType" required>
                  <mat-option [value]="StaffType.Teacher">Teacher</mat-option>
                  <mat-option [value]="StaffType.Admin">Admin</mat-option>
                  <mat-option [value]="StaffType.Support">Support</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Qualification</mat-label>
                <input matInput formControlName="qualification">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone" required>
              </mat-form-field>

              @if (!isEditMode) {
                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" formControlName="password" required>
                </mat-form-field>
              }

              @if (isEditMode) {
                <mat-form-field appearance="outline">
                  <mat-label>Status</mat-label>
                  <mat-select formControlName="isActive" required>
                    <mat-option [value]="true">Active</mat-option>
                    <mat-option [value]="false">Inactive</mat-option>
                  </mat-select>
                </mat-form-field>
              }
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .staff-form-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .form-card {
      margin-top: 24px;
    }

    .staff-form {
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
export class StaffFormComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private staffService = inject(StaffService);
    private snackBar = inject(MatSnackBar);

    protected readonly StaffType = StaffType;

    protected staff = signal<Staff | null>(null);
    protected submitting = signal(false);
    protected isEditMode = false;

    protected staffForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        joiningDate: ['', Validators.required],
        staffType: [StaffType.Teacher, Validators.required],
        qualification: [''],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['Staff@123'],
        isActive: [true]
    });

    constructor() {
        // Check if this is edit mode
        effect(() => {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.isEditMode = true;
                this.loadStaff(id);
                // Remove password field in edit mode
                this.staffForm.removeControl('password');
            } else {
                this.staffForm.controls['password'].addValidators(Validators.required);
            }
        }, { allowSignalWrites: true });
    }

    private loadStaff(id: string): void {
        this.staffService.getStaffById(id).subscribe({
            next: (staff) => {
                this.staff.set(staff);
                this.staffForm.patchValue({
                    firstName: staff.firstName,
                    lastName: staff.lastName,
                    joiningDate: new Date(staff.joiningDate),
                    staffType: staff.staffType,
                    qualification: staff.qualification,
                    email: staff.email,
                    phone: staff.phone,
                    isActive: staff.isActive
                });
            },
            error: (err) => {
                console.error('Failed to load staff:', err);
                this.snackBar.open('Failed to load staff', 'Close', { duration: 3000 });
            }
        });
    }

    protected save(): void {
        if (this.staffForm.valid) {
            this.submitting.set(true);

            // Format date to ISO string
            const joiningDate = new Date(this.staffForm.value.joiningDate);
            const formattedJoiningDate = joiningDate.toISOString().split('T')[0];

            if (this.isEditMode && this.staff()) {
                // Update existing staff
                const updateRequest = {
                    id: this.staff()!.id,
                    firstName: this.staffForm.value.firstName,
                    lastName: this.staffForm.value.lastName,
                    email: this.staffForm.value.email,
                    phone: this.staffForm.value.phone,
                    qualification: this.staffForm.value.qualification,
                    staffType: this.staffForm.value.staffType,
                    isActive: this.staffForm.value.isActive
                };

                this.staffService.updateStaff(this.staff()!.id, updateRequest).subscribe({
                    next: () => {
                        this.snackBar.open('Staff updated successfully!', 'Close', { duration: 3000 });
                        this.router.navigate(['/staff', this.staff()!.id]);
                    },
                    error: (err) => {
                        console.error('Failed to update staff:', err);
                        this.snackBar.open(err.error?.message || 'Failed to update staff', 'Close', { duration: 5000 });
                        this.submitting.set(false);
                    }
                });
            } else {
                // Create new staff
                const createRequest = {
                    firstName: this.staffForm.value.firstName,
                    lastName: this.staffForm.value.lastName,
                    email: this.staffForm.value.email,
                    password: this.staffForm.value.password,
                    phone: this.staffForm.value.phone,
                    qualification: this.staffForm.value.qualification,
                    joiningDate: formattedJoiningDate,
                    staffType: this.staffForm.value.staffType
                };

                this.staffService.onboardStaff(createRequest).subscribe({
                    next: () => {
                        this.snackBar.open('Staff created successfully!', 'Close', { duration: 3000 });
                        this.router.navigate(['/staff']);
                    },
                    error: (err: any) => {
                        console.error('Failed to create staff:', err);
                        this.snackBar.open(err.error?.message || 'Failed to create staff', 'Close', { duration: 5000 });
                        this.submitting.set(false);
                    }
                });
            }
        }
    }

    protected cancel(): void {
        if (this.isEditMode && this.staff()) {
            this.router.navigate(['/staff', this.staff()!.id]);
        } else {
            this.router.navigate(['/staff']);
        }
    }
}
