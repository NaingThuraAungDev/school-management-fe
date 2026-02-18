import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./staff-list/staff-list.component').then(m => m.StaffListComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./staff-form/staff-form.component').then(m => m.StaffFormComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./staff-detail/staff-detail.component').then(m => m.StaffDetailComponent)
    },
    {
        path: ':id/edit',
        loadComponent: () => import('./staff-form/staff-form.component').then(m => m.StaffFormComponent)
    }
] satisfies Routes;
