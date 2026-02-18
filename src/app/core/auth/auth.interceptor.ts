import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * HTTP Interceptor to attach JWT token to requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    // Skip auth header for login/register endpoints
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
        return next(req);
    }

    // Clone request and add Authorization header if token exists
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expired or invalid - logout
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};
