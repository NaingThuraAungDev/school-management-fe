import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    TimeSlot,
    TimetableEntry,
    CreateTimeSlotRequest,
    CreateTimetableEntryRequest,
    UpdateTimetableEntryRequest
} from '../models/timetable.model';

@Injectable({
    providedIn: 'root'
})
export class TimetableService {
    private api = inject(ApiService);
    private readonly endpoint = 'timetable';

    // Time Slots
    createTimeSlot(request: CreateTimeSlotRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/time-slots`, request);
    }

    getTimeSlots(): Observable<TimeSlot[]> {
        return this.api.get<TimeSlot[]>(`${this.endpoint}/time-slots`);
    }

    // Timetable Entries
    createTimetableEntry(request: CreateTimetableEntryRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/entries`, request);
    }

    updateTimetableEntry(id: string, request: UpdateTimetableEntryRequest): Observable<void> {
        return this.api.put(`${this.endpoint}/entries/${id}`, request);
    }

    deleteTimetableEntry(id: string): Observable<void> {
        return this.api.delete(`${this.endpoint}/entries/${id}`);
    }

    getTimetableByClass(classSectionId: string, academicYearId: string): Observable<TimetableEntry[]> {
        return this.api.get<TimetableEntry[]>(`${this.endpoint}/by-class`, {
            params: { classSectionId, academicYearId }
        });
    }

    getTeacherTimetable(staffId: string, academicYearId: string): Observable<TimetableEntry[]> {
        return this.api.get<TimetableEntry[]>(`${this.endpoint}/by-teacher`, {
            params: { staffId, academicYearId }
        });
    }
}
