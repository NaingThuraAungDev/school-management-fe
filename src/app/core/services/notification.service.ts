import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

const DEFAULT_DURATION = 3000;

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private snackBar = inject(MatSnackBar);

    /**
     * Show success notification
     */
    success(message: string, duration: number = DEFAULT_DURATION): void {
        this.show(message, 'success', duration);
    }

    /**
     * Show error notification
     */
    error(message: string, duration: number = 5000): void {
        this.show(message, 'error', duration);
    }

    /**
     * Show info notification
     */
    info(message: string, duration: number = DEFAULT_DURATION): void {
        this.show(message, 'info', duration);
    }

    /**
     * Show warning notification
     */
    warning(message: string, duration: number = DEFAULT_DURATION): void {
        this.show(message, 'warning', duration);
    }

    /**
     * Show notification with custom config
     */
    private show(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number): void {
        const config: MatSnackBarConfig = {
            duration,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: [`snackbar-${type}`]
        };

        this.snackBar.open(message, 'Close', config);
    }

    /**
     * Dismiss all notifications
     */
    dismiss(): void {
        this.snackBar.dismiss();
    }
}
