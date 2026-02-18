import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./student-admission/student-admission.component').then(m => m.StudentAdmissionComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./student-detail/student-detail.component').then(m => m.StudentDetailComponent)
    },
    {
        path: ':id/edit',
        loadComponent: () => import('./student-edit/student-edit.component').then(m => m.StudentEditComponent)
    }
] satisfies Routes;
