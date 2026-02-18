import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loading = signal(false);
    private _loadingCount = 0;

    /**
     * Public readonly loading signal
     */
    readonly loading = this._loading.asReadonly();

    /**
     * Show loading indicator
     */
    show(): void {
        this._loadingCount++;
        this._loading.set(true);
    }

    /**
     * Hide loading indicator
     */
    hide(): void {
        this._loadingCount--;

        if (this._loadingCount <= 0) {
            this._loadingCount = 0;
            this._loading.set(false);
        }
    }

    /**
     * Reset loading state
     */
    reset(): void {
        this._loadingCount = 0;
        this._loading.set(false);
    }
}
