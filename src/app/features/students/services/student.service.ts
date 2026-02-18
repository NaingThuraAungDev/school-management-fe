import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/api/api.service';
import {
    Student,
    StudentFilter,
    AdmitStudentRequest,
    UpdateStudentRequest,
    LinkGuardianRequest,
    UploadDocumentRequest
} from '../models/student.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private api = inject(ApiService);
    private http = inject(HttpClient);
    private readonly endpoint = 'students';

    /**
     * Admit new student
     */
    admitStudent(request: AdmitStudentRequest): Observable<Student> {
        return this.api.post<Student>(this.endpoint, request);
    }

    /**
     * Update student
     */
    updateStudent(id: string, request: UpdateStudentRequest): Observable<void> {
        return this.api.put(`${this.endpoint}/${id}`, request);
    }

    /**
     * Delete student (soft delete)
     */
    deleteStudent(id: string): Observable<void> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Get student by ID
     */
    getStudentById(id: string): Observable<Student> {
        return this.api.get<Student>(`${this.endpoint}/${id}`);
    }

    /**
     * Get students list with optional filters
     */
    getStudentsList(filter?: StudentFilter): Observable<Student[]> {
        return this.api.get<Student[]>(this.endpoint, { params: filter as any });
    }

    /**
     * Link guardian to student
     */
    linkGuardian(request: LinkGuardianRequest): Observable<{ guardianId: string }> {
        return this.api.post<{ guardianId: string }>(
            `${this.endpoint}/${request.studentId}/guardians`,
            request
        );
    }

    /**
     * Upload student document
     */
    uploadDocument(studentId: string, documentType: number, file: File): Observable<{ documentId: string }> {
        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('documentType', documentType.toString());
        formData.append('file', file);

        return this.http.post<{ documentId: string }>(
            `${environment.apiUrl}/${this.endpoint}/${studentId}/documents`,
            formData
        );
    }
}
