import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    ExamTerm,
    GradeDefinition,
    Exam,
    ExamResult,
    ReportCard,
    CreateExamTermRequest,
    CreateGradeDefinitionRequest,
    CreateExamRequest,
    RecordExamResultRequest,
    CreateReportCardTemplateRequest
} from '../models/exam.model';

@Injectable({
    providedIn: 'root'
})
export class ExamService {
    private api = inject(ApiService);
    private readonly endpoint = 'exams';

    // Exam Terms
    createExamTerm(request: CreateExamTermRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/terms`, request);
    }

    getExamTerms(academicYearId: string): Observable<ExamTerm[]> {
        return this.api.get<ExamTerm[]>(`${this.endpoint}/terms`, { params: { academicYearId } });
    }

    // Grade Definitions
    createGradeDefinition(request: CreateGradeDefinitionRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/grades`, request);
    }

    getGradeDefinitions(academicYearId: string): Observable<GradeDefinition[]> {
        return this.api.get<GradeDefinition[]>(`${this.endpoint}/grades`, { params: { academicYearId } });
    }

    // Exams
    createExam(request: CreateExamRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(this.endpoint, request);
    }

    getExams(params?: {
        examTermId?: string;
        classSectionId?: string;
        subjectId?: string;
    }): Observable<Exam[]> {
        return this.api.get<Exam[]>(this.endpoint, { params: params as any });
    }

    // Exam Results
    recordExamResult(request: RecordExamResultRequest): Observable<ExamResult> {
        return this.api.post<ExamResult>(`${this.endpoint}/results`, request);
    }

    getExamResults(params?: {
        examId?: string;
        studentId?: string;
        examTermId?: string;
    }): Observable<ExamResult[]> {
        return this.api.get<ExamResult[]>(`${this.endpoint}/results`, { params: params as any });
    }

    // Report Cards
    createReportCardTemplate(request: CreateReportCardTemplateRequest): Observable<{ id: string }> {
        return this.api.post<{ id: string }>(`${this.endpoint}/report-card-templates`, request);
    }

    getReportCard(studentId: string, examTermId: string): Observable<ReportCard> {
        return this.api.get<ReportCard>(`${this.endpoint}/report-card/${studentId}`, { params: { examTermId } });
    }
}
