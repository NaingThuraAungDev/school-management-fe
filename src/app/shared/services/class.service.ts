import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    Class,
    Section,
    ClassSection,
    CreateClassRequest,
    CreateSectionRequest,
    CreateClassSectionRequest
} from '../models/class.model';

@Injectable({
    providedIn: 'root'
})
export class ClassService {
    private api = inject(ApiService);
    private readonly endpoint = 'classes';

    createClass(request: CreateClassRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(this.endpoint, request);
    }

    getClasses(): Observable<Class[]> {
        return this.api.get<Class[]>(this.endpoint);
    }

    createSection(request: CreateSectionRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/sections`, request);
    }

    getSections(): Observable<Section[]> {
        return this.api.get<Section[]>(`${this.endpoint}/sections`);
    }

    createClassSection(request: CreateClassSectionRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/class-sections`, request);
    }

    getClassSections(classId?: string): Observable<ClassSection[]> {
        const params: any = classId ? { classId } : undefined;
        return this.api.get<ClassSection[]>(`${this.endpoint}/class-sections`, { params });
    }
}
