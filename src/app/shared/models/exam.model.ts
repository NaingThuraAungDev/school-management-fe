// Exam models matching API

export enum ExamTermType {
    MidTerm = 0,
    Final = 1,
    Quarterly = 2,
    HalfYearly = 3
}

export interface ExamTerm {
    id: string;
    name: string;
    termType: ExamTermType;
    startDate: string;
    endDate: string;
    academicYearId: string;
}

export interface GradeDefinition {
    id: string;
    label: string;
    minPercentage: number;
    maxPercentage: number;
    gradePoint: number;
    description?: string;
    academicYearId: string;
}

export interface Exam {
    id: string;
    examTermId: string;
    examTermName: string;
    subjectId: string;
    subjectName: string;
    classSectionId: string;
    classSectionName: string;
    examDate: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
}

export interface ExamResult {
    id: string;
    examId: string;
    studentId: string;
    studentName: string;
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    isPassed: boolean;
    remarks?: string;
}

export interface ReportCardTemplate {
    id: string;
    name: string;
    templateContent: string;
    academicYearId: string;
}

export interface ReportCard {
    studentId: string;
    studentName: string;
    admissionId: string;
    classSectionName: string;
    examTermName: string;
    results: ExamResult[];
    totalMarksObtained: number;
    totalMaxMarks: number;
    overallPercentage: number;
    overallGrade: string;
}

// Request DTOs
export interface CreateExamTermRequest {
    name: string;
    termType: ExamTermType;
    startDate: string;
    endDate: string;
    academicYearId: string;
}

export interface CreateGradeDefinitionRequest {
    label: string;
    minPercentage: number;
    maxPercentage: number;
    gradePoint: number;
    description?: string;
    academicYearId: string;
}

export interface CreateExamRequest {
    examTermId: string;
    subjectId: string;
    classSectionId: string;
    examDate: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
}

export interface RecordExamResultRequest {
    examId: string;
    studentId: string;
    marksObtained: number;
    remarks?: string;
}

export interface CreateReportCardTemplateRequest {
    name: string;
    templateContent: string;
    academicYearId: string;
}
