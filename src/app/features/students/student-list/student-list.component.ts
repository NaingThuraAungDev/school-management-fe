import { Component, inject, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { StudentStore } from '../services/student.store';
import { TableColumn } from '../../../shared/models/common.model';
import { Student, Gender, Guardian } from '../models/student.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ClassService } from '../../../shared/services/class.service';
import { ClassSection } from '../../../shared/models/class.model';

@Component({
    selector: 'app-student-list',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatChipsModule,
        PageHeaderComponent,
        SearchInputComponent,
        DataTableComponent,
        StatusBadgeComponent
    ],
    template: `
    <div class="student-list-container">
      <app-page-header 
        title="Students" 
        subtitle="Manage student admissions and records"
        icon="school"
      >
        <div actions>
          <button 
            mat-button 
            (click)="exportToExcel()"
          >
            <mat-icon>download</mat-icon>
            Export
          </button>
          <button 
            mat-raised-button 
            color="primary"
            (click)="navigateToAdmission()"
          >
            <mat-icon>add</mat-icon>
            New Admission
          </button>
        </div>
      </app-page-header>

      <div class="filters-section card">
        <app-search-input
          placeholder="Search by name, admission ID, or roll number..."
          (searchChange)="onSearchChange($event)"
        ></app-search-input>

        <div class="filter-controls">
          <mat-form-field appearance="outline">
            <mat-label>Class Section</mat-label>
            <mat-select [(value)]="selectedClass" (selectionChange)="onClassChange()">
              <mat-option [value]="''">All Classes</mat-option>
              @for (classSection of classSections(); track classSection.id) {
                <mat-option [value]="classSection.id">{{ classSection.className }} - {{ classSection.sectionName }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="selectedStatus" (selectionChange)="onStatusChange()">
              <mat-option [value]="''">All Status</mat-option>
              <mat-option value="ACTIVE">Active</mat-option>
              <mat-option value="INACTIVE">Inactive</mat-option>
            </mat-select>
          </mat-form-field>

          @if (store.hasActiveFilter()) {
            <button mat-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear Filters
            </button>
          }
        </div>
      </div>

      <div class="table-section">
        <app-data-table
          [data]="store.filteredStudents()"
          [columns]="columns"
          [loading]="store.loading()"
          [totalItems]="store.totalItems()"
          [pageSize]="store.pageSize()"
          [pageIndex]="store.pageIndex()"
          [showActions]="false"
          [clickableRows]="true"
          (pageChange)="onPageChange($event)"
          (sortChange)="onSortChange($event)"
          (rowClick)="viewStudent($event)"
          emptyTitle="No students found"
          emptyMessage="Start by adding your first student admission"
          emptyIcon="school"
        >
          <ng-template #cellStatus let-row>
            <app-status-badge [status]="row.status"></app-status-badge>
          </ng-template>
        </app-data-table>
      </div>
    </div>
  `,
    styles: [`
    .student-list-container {
      padding: 24px;
    }

    .filters-section {
      margin-bottom: 24px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      app-search-input {
        flex: 1;
      }
    }

    .filter-controls {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;

      mat-form-field {
        min-width: 200px;
      }
    }

    .table-section {
      background: white;
      border-radius: 8px;
    }
  `]
})
export class StudentListComponent {
    protected store = inject(StudentStore);
    private router = inject(Router);
    private classService = inject(ClassService);

    protected selectedClass = '';
    protected selectedStatus = '';
    protected classSections = signal<ClassSection[]>([]);

    protected columns: TableColumn<Student>[] = [
        { key: 'admissionId', label: 'Admission ID', sortable: true },
        { key: 'rollNumber', label: 'Roll No', sortable: true },
        {
            key: 'firstName',
            label: 'Name',
            sortable: true,
            format: (_, row: Student) => `${row.firstName} ${row.lastName}`
        },
        { key: 'classSectionName', label: 'Class Section', sortable: true },
        {
            key: 'gender',
            label: 'Gender',
            format: (gender: Gender) => Gender[gender]
        },
        {
            key: 'guardians',
            label: 'Guardian',
            format: (guardians: Guardian[]) => guardians?.[0]?.name || 'N/A'
        },
        {
            key: 'isActive',
            label: 'Status',
            format: (isActive: boolean) => isActive ? 'Active' : 'Inactive'
        }
    ];

    constructor() {
        // Load students and class sections on component init
        effect(() => {
            this.store.loadStudents();
        }, { allowSignalWrites: true });

        // Load class sections
        this.classService.getClassSections().subscribe({
            next: (sections) => this.classSections.set(sections),
            error: (err) => console.error('Failed to load class sections:', err)
        });
    }

    protected onSearchChange(search: string): void {
        this.store.updateFilter({ searchTerm: search });
        this.store.loadStudents();
    }

    protected onClassChange(): void {
        this.store.updateFilter({ classSectionId: this.selectedClass || undefined });
        this.store.loadStudents();
    }

    protected onStatusChange(): void {
        this.store.updateFilter({ isActive: this.selectedStatus === 'ACTIVE' });
        this.store.loadStudents();
    }

    protected clearFilters(): void {
        this.selectedClass = '';
        this.selectedStatus = '';
        this.store.clearFilter();
        this.store.loadStudents();
    }

    protected onPageChange(event: PageEvent): void {
        this.store.updatePagination(event.pageIndex, event.pageSize);
        this.store.loadStudents();
    }

    protected onSortChange(event: Sort): void {
        // Implement sorting logic
        console.log('Sort:', event);
    }

    protected navigateToAdmission(): void {
        this.router.navigate(['/students/new']);
    }

    protected viewStudent(student: Student): void {
        this.router.navigate(['/students', student.id]);
    }

    protected editStudent(student: Student): void {
        this.router.navigate(['/students', student.id, 'edit']);
    }

    protected exportToExcel(): void {
        // Implement export logic
        console.log('Export to Excel');
    }
}
