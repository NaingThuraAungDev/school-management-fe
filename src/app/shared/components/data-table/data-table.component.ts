import { Component, input, output, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TableColumn } from '../../models/common.model';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
    selector: 'app-data-table',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        EmptyStateComponent
    ],
    template: `
    <div class="data-table-container">
      @if (loading()) {
        <div class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (data().length === 0 && !loading()) {
        <app-empty-state
          [title]="emptyTitle()"
          [message]="emptyMessage()"
          [icon]="emptyIcon()"
        >
          <ng-content select="[empty-actions]"></ng-content>
        </app-empty-state>
      } @else {
        <div class="table-wrapper">
          <table 
            mat-table 
            [dataSource]="data()" 
            matSort 
            (matSortChange)="onSortChange($event)"
            class="data-table"
          >
            <!-- Generate columns from config -->
            @for (column of columns(); track column.key) {
              <ng-container [matColumnDef]="getColumnKey(column)">
                <th 
                  mat-header-cell 
                  *matHeaderCellDef
                  [mat-sort-header]="column.sortable !== false ? getColumnKey(column) : ''"
                  [disabled]="column.sortable === false"
                  [style.width]="column.width"
                  [style.text-align]="column.align || 'left'"
                >
                  {{ column.label }}
                </th>
                <td 
                  mat-cell 
                  *matCellDef="let row"
                  [style.text-align]="column.align || 'left'"
                >
                  @if (column.type === 'custom') {
                    <ng-content [select]="'[cell-' + column.key + ']'"></ng-content>
                  } @else {
                    {{ formatCellValue(row, column) }}
                  }
                </td>
              </ng-container>
            }

            <!-- Actions Column (if provided) -->
            @if (showActions()) {
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef style="width: 120px; text-align: right">
                  Actions
                </th>
                <td mat-cell *matCellDef="let row" style="text-align: right">
                  <ng-content select="[row-actions]"></ng-content>
                </td>
              </ng-container>
            }

            <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
            <tr 
              mat-row 
              *matRowDef="let row; columns: displayedColumns()"
              [class.clickable-row]="clickableRows()"
              (click)="onRowClick(row)"
            ></tr>
          </table>
        </div>

        @if (showPagination()) {
          <mat-paginator
            [length]="totalItems()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="pageSizeOptions()"
            [pageIndex]="pageIndex()"
            (page)="onPageChange($event)"
            showFirstLastButtons
          ></mat-paginator>
        }
      }
    </div>
  `,
    styles: [`
    .data-table-container {
      position: relative;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;

      th {
        font-weight: 600;
        color: #616161;
        background: #fafafa;
      }

      td {
        color: #424242;
      }

      .mat-mdc-row {
        &.clickable-row {
          cursor: pointer;

          &:hover {
            background: #f5f5f5;
          }
        }
      }
    }
  `]
})
export class DataTableComponent<T = any> {
    // Data
    data = input.required<T[]>();
    columns = input.required<TableColumn<T>[]>();
    loading = input<boolean>(false);

    // Pagination
    showPagination = input<boolean>(true);
    totalItems = input<number>(0);
    pageSize = input<number>(10);
    pageIndex = input<number>(0);
    pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);

    // Empty state
    emptyTitle = input<string>('No data available');
    emptyMessage = input<string>('');
    emptyIcon = input<string>('inbox');

    // Actions
    showActions = input<boolean>(false);
    clickableRows = input<boolean>(false);

    // Outputs
    pageChange = output<PageEvent>();
    sortChange = output<Sort>();
    rowClick = output<T>();

    protected displayedColumns = computed(() => {
        const cols = this.columns().map(c => String(c.key));
        return this.showActions() ? [...cols, 'actions'] : cols;
    });

    protected onPageChange(event: PageEvent): void {
        this.pageChange.emit(event);
    }

    protected onSortChange(event: Sort): void {
        this.sortChange.emit(event);
    }

    protected onRowClick(row: T): void {
        if (this.clickableRows()) {
            this.rowClick.emit(row);
        }
    }

    protected getColumnKey(column: TableColumn<T>): string {
        return String(column.key);
    }

    protected formatCellValue(row: T, column: TableColumn<T>): any {
        const value = (row as any)[column.key];

        if (column.format) {
            return column.format(value, row);
        }

        return value;
    }
}
