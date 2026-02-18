import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { pipe, switchMap, tap, catchError, of, debounceTime } from 'rxjs';
import { StudentService } from './student.service';
import { Student, StudentFilter } from '../models/student.model';

interface StudentState {
    students: Student[];
    selectedStudent: Student | null;
    loading: boolean;
    error: string | null;
    filter: StudentFilter;
}

const initialState: StudentState = {
    students: [],
    selectedStudent: null,
    loading: false,
    error: null,
    filter: {
        pageNumber: 1,
        pageSize: 10
    }
};

export const StudentStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((state) => ({
        // All students are already filtered by the API
        filteredStudents: computed(() => state.students()),

        hasActiveFilter: computed(() => {
            const f = state.filter();
            return !!(f.searchTerm || f.classSectionId || f.isActive !== undefined);
        }),

        isLoading: computed(() => state.loading()),
        totalItems: computed(() => state.students().length),
        pageSize: computed(() => state.filter().pageSize || 10),
        pageIndex: computed(() => (state.filter().pageNumber || 1) - 1),
        loading: computed(() => state.loading())
    })),
    withMethods((store, studentService = inject(StudentService)) => ({
        // Load students
        loadStudents: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true, error: null })),
                switchMap(() =>
                    studentService.getStudentsList(store.filter()).pipe(
                        tap(students =>
                            patchState(store, {
                                students,
                                loading: false
                            })
                        ),
                        catchError(error => {
                            patchState(store, {
                                error: error.message || 'Failed to load students',
                                loading: false
                            });
                            return of(null);
                        })
                    )
                )
            )
        ),

        // Load single student
        loadStudent: rxMethod<string>(
            pipe(
                tap(() => patchState(store, { loading: true, error: null })),
                debounceTime(300),
                switchMap(id =>
                    studentService.getStudentById(id).pipe(
                        tap(student =>
                            patchState(store, {
                                selectedStudent: student,
                                loading: false
                            })
                        ),
                        catchError(error => {
                            patchState(store, {
                                error: error.message || 'Failed to load student',
                                loading: false
                            });
                            return of(null);
                        })
                    )
                )
            )
        ),

        // Update filter
        updateFilter(filter: Partial<StudentFilter>): void {
            patchState(store, state => ({
                filter: { ...state.filter, ...filter }
            }));
        },

        // Clear filter
        clearFilter(): void {
            patchState(store, {
                filter: {
                    pageNumber: 1,
                    pageSize: 10
                }
            });
        },

        // Update pagination
        updatePagination(pageIndex: number, pageSize: number): void {
            patchState(store, state => ({
                filter: {
                    ...state.filter,
                    pageNumber: pageIndex + 1,
                    pageSize
                }
            }));
        },

        // Clear selected student
        clearSelected(): void {
            patchState(store, { selectedStudent: null });
        },

        // Reset store
        reset(): void {
            patchState(store, initialState);
        }
    }))
);