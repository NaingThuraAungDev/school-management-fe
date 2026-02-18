import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Staff, StaffFilter } from '../../../shared/models/staff.model';
import { StaffService } from '../../../shared/services/staff.service';
import { inject } from '@angular/core';

interface StaffState {
    staff: Staff[];
    loading: boolean;
    filter: StaffFilter;
}

const initialState: StaffState = {
    staff: [],
    loading: false,
    filter: {
        pageNumber: 1,
        pageSize: 10
    }
};

export const StaffStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((state) => ({
        filteredStaff: computed(() => state.staff()),
        hasActiveFilter: computed(() => {
            const filter = state.filter();
            return !!(filter.searchTerm || filter.staffType !== undefined || filter.isActive !== undefined);
        }),
        isLoading: computed(() => state.loading()),
        totalItems: computed(() => state.staff().length),
        pageSize: computed(() => state.filter().pageSize || 10),
        pageIndex: computed(() => (state.filter().pageNumber || 1) - 1)
    })),
    withMethods((store, staffService = inject(StaffService)) => ({
        loadStaff(): void {
            patchState(store, { loading: true });
            staffService.getStaffList(store.filter()).subscribe({
                next: (staff) => {
                    patchState(store, { staff, loading: false });
                },
                error: (error) => {
                    console.error('Failed to load staff:', error);
                    patchState(store, { loading: false });
                }
            });
        },

        updateFilter(filter: Partial<StaffFilter>): void {
            patchState(store, {
                filter: { ...store.filter(), ...filter }
            });
        },

        clearFilter(): void {
            patchState(store, {
                filter: { pageNumber: 1, pageSize: 10 }
            });
        },

        updatePagination(pageIndex: number, pageSize: number): void {
            patchState(store, {
                filter: {
                    ...store.filter(),
                    pageNumber: pageIndex + 1,
                    pageSize
                }
            });
        }
    }))
);
