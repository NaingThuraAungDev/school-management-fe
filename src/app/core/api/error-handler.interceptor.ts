import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Global error handler interceptor
 */
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        errorMessage = error.error?.message || 'Bad Request';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized. Please login again.';
                        // Don't show notification for 401 - auth interceptor handles this
                        return throwError(() => error);
                    case 403:
                        errorMessage = 'You do not have permission to perform this action.';
                        router.navigate(['/forbidden']);
                        break;
                    case 404:
                        errorMessage = error.error?.message || 'Resource not found';
                        break;
                    case 422:
                        // Validation errors
                        errorMessage = error.error?.message || 'Validation failed';
                        // Don't show global notification for validation errors
                        // Let the form handle them
                        return throwError(() => error);
                    case 500:
                        errorMessage = 'Internal server error. Please try again later.';
                        break;
                    case 503:
                        errorMessage = 'Service unavailable. Please try again later.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error: ${error.status}`;
                }
            }

            // Show error notification
            notificationService.error(errorMessage);

            return throwError(() => error);
        })
    );
};
