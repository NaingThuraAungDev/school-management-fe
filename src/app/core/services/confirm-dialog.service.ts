import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    private dialog = inject(MatDialog);

    /**
     * Open confirmation dialog
     */
    confirm(data: ConfirmDialogData): Observable<boolean> {
        const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = this.dialog.open(
            ConfirmDialogComponent,
            {
                width: '400px',
                data,
                disableClose: true
            }
        );

        return dialogRef.afterClosed() as Observable<boolean>;
    }

    /**
     * Quick confirm for delete operations
     */
    confirmDelete(itemName?: string): Observable<boolean> {
        return this.confirm({
            title: 'Confirm Delete',
            message: itemName
                ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
                : 'Are you sure you want to delete this item? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            confirmColor: 'warn'
        });
    }

    /**
     * Quick confirm for discard operations
     */
    confirmDiscard(): Observable<boolean> {
        return this.confirm({
            title: 'Discard Changes',
            message: 'You have unsaved changes. Are you sure you want to discard them?',
            confirmText: 'Discard',
            cancelText: 'Keep Editing',
            confirmColor: 'warn'
        });
    }
}
