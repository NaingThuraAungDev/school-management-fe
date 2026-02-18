import { Component, inject, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { StaffStore } from '../services/staff.store';
import { TableColumn } from '../../../shared/models/common.model';
import { Staff, StaffType } from '../../../shared/models/staff.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-staff-list',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        PageHeaderComponent,
        SearchInputComponent,
        DataTableComponent
    ],
    template: `
    <div class="staff-list-container">
      <app-page-header 
        title="Staff" 
        subtitle="Manage staff members and their roles"
        icon="group"
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
            (click)="addStaff()"
          >
            <mat-icon>add</mat-icon>
            Add Staff
          </button>
        </div>
      </app-page-header>

      <div class="filters-section card">
        <app-search-input
          placeholder="Search by name, email, or employee ID..."
          (searchChange)="onSearchChange($event)"
        ></app-search-input>

        <div class="filter-controls">
          <mat-form-field appearance="outline">
            <mat-label>Staff Type</mat-label>
            <mat-select [(value)]="selectedType" (selectionChange)="onTypeChange()">
              <mat-option [value]="undefined">All Types</mat-option>
              <mat-option [value]="StaffType.Teacher">Teacher</mat-option>
              <mat-option [value]="StaffType.Admin">Admin</mat-option>
              <mat-option [value]="StaffType.Support">Support</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="selectedStatus" (selectionChange)="onStatusChange()">
              <mat-option [value]="undefined">All Status</mat-option>
              <mat-option [value]="true">Active</mat-option>
              <mat-option [value]="false">Inactive</mat-option>
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
          [data]="store.filteredStaff()"
          [columns]="columns"
          [loading]="store.loading()"
          [totalItems]="store.totalItems()"
          [pageSize]="store.pageSize()"
          [pageIndex]="store.pageIndex()"
          [showActions]="false"
          [clickableRows]="true"
          (pageChange)="onPageChange($event)"
          (sortChange)="onSortChange($event)"
          (rowClick)="viewStaff($event)"
          emptyTitle="No staff found"
          emptyMessage="Start by adding your first staff member"
          emptyIcon="group"
        >
        </app-data-table>
      </div>
    </div>
  `,
    styles: [`
    .staff-list-container {
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
export class StaffListComponent {
    protected store = inject(StaffStore);
    private router = inject(Router);

    protected readonly StaffType = StaffType;
    protected selectedType: StaffType | undefined = undefined;
    protected selectedStatus: boolean | undefined = undefined;

    protected columns: TableColumn<Staff>[] = [
        {
            key: 'firstName',
            label: 'Name',
            sortable: true,
            format: (_, row: Staff) => `${row.firstName} ${row.lastName}`
        },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        {
            key: 'staffType',
            label: 'Type',
            format: (type: StaffType) => StaffType[type]
        },
        {
            key: 'joiningDate',
            label: 'Joined On',
            format: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            key: 'isActive',
            label: 'Status',
            format: (isActive: boolean) => isActive ? 'Active' : 'Inactive'
        }
    ];

    constructor() {
        // Load staff on component init
        effect(() => {
            this.store.loadStaff();
        }, { allowSignalWrites: true });
    }

    protected onSearchChange(search: string): void {
        this.store.updateFilter({ searchTerm: search });
        this.store.loadStaff();
    }

    protected onTypeChange(): void {
        this.store.updateFilter({ staffType: this.selectedType });
        this.store.loadStaff();
    }

    protected onStatusChange(): void {
        this.store.updateFilter({ isActive: this.selectedStatus });
        this.store.loadStaff();
    }

    protected clearFilters(): void {
        this.selectedType = undefined;
        this.selectedStatus = undefined;
        this.store.clearFilter();
        this.store.loadStaff();
    }

    protected onPageChange(event: PageEvent): void {
        this.store.updatePagination(event.pageIndex, event.pageSize);
        this.store.loadStaff();
    }

    protected onSortChange(event: Sort): void {
        console.log('Sort:', event);
    }

    protected addStaff(): void {
        this.router.navigate(['/staff/new']);
    }

    protected viewStaff(staff: Staff): void {
        this.router.navigate(['/staff', staff.id]);
    }

    protected exportToExcel(): void {
        console.log('Export to Excel');
    }
}
