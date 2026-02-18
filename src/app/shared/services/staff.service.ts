import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    Staff,
    OnboardStaffRequest,
    UpdateStaffRequest,
    AssignStaffRoleRequest,
    StaffFilter
} from '../models/staff.model';

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    private api = inject(ApiService);
    private readonly endpoint = 'staff';

    onboardStaff(request: OnboardStaffRequest): Observable<Staff> {
        return this.api.post<Staff>(this.endpoint, request);
    }

    updateStaff(id: string, request: UpdateStaffRequest): Observable<void> {
        return this.api.put(`${this.endpoint}/${id}`, request);
    }

    deleteStaff(id: string): Observable<void> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }

    getStaffById(id: string): Observable<Staff> {
        return this.api.get<Staff>(`${this.endpoint}/${id}`);
    }

    getStaffList(filter?: StaffFilter): Observable<Staff[]> {
        return this.api.get<Staff[]>(this.endpoint, { params: filter as any });
    }

    assignStaffRole(request: AssignStaffRoleRequest): Observable<{ roleId: string }> {
        return this.api.post<{ roleId: string }>(
            `${this.endpoint}/${request.staffId}/roles`,
            request
        );
    }
}
