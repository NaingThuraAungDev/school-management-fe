import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    Subject,
    SubjectTeacherMapping,
    CreateSubjectRequest,
    MapSubjectTeacherRequest
} from '../models/subject.model';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private api = inject(ApiService);
    private readonly endpoint = 'subjects';

    createSubject(request: CreateSubjectRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(this.endpoint, request);
    }

    getSubjects(): Observable<Subject[]> {
        return this.api.get<Subject[]>(this.endpoint);
    }

    mapSubjectTeacher(request: MapSubjectTeacherRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(
            `${this.endpoint}/teacher-mappings`,
            request
        );
    }

    getSubjectMappings(classSectionId?: string, academicYearId?: string): Observable<SubjectTeacherMapping[]> {
        const params: any = {};
        if (classSectionId) params.classSectionId = classSectionId;
        if (academicYearId) params.academicYearId = academicYearId;
        return this.api.get<SubjectTeacherMapping[]>(`${this.endpoint}/teacher-mappings`, { params });
    }
}
