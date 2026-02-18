import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button 
        mat-raised-button 
        [color]="data.confirmColor || 'primary'"
        (click)="onConfirm()"
      >
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    mat-dialog-content {
      min-width: 300px;
      padding: 20px 0;

      p {
        margin: 0;
        line-height: 1.5;
      }
    }

    mat-dialog-actions {
      padding: 8px 0 0;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
    protected data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

    protected onConfirm(): void {
        this.dialogRef.close(true);
    }

    protected onCancel(): void {
        this.dialogRef.close(false);
    }
}
