import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from './auth.model';

/**
 * Auth guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
    });
};

/**
 * Role guard factory to protect routes based on user roles
 * Usage: canActivate: [roleGuard(['Admin', 'SuperAdmin'])]
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            return router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url }
            });
        }

        if (authService.hasAnyRole(allowedRoles)) {
            return true;
        }

        // User doesn't have required role - redirect to forbidden page
        return router.createUrlTree(['/forbidden']);
    };
}

/**
 * Guest guard - redirects authenticated users away from auth pages
 * Usage: canActivate: [guestGuard] on login/register pages
 */
export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/dashboard']);
};
