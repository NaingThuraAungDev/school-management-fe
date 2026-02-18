import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: '',
        loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'students',
                loadChildren: () => import('./features/students/students.routes')
            },
            {
                path: 'staff',
                loadChildren: () => import('./features/staff/staff.routes')
            },
            {
                path: 'classes',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'timetable',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'exams',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'promotions',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
            }
        ]
    },
    {
        path: 'forbidden',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
